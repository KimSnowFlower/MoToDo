const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config(); // 환경 변수 설정

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// 데이터베이스 설정을 환경 변수로 관리
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// JWT 비밀키를 환경 변수로 설정
const JWT_SECRET = process.env.JWT_SECRET;

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 소켓 연결 및 채팅 기능
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new join room", async (preJoinRoom, newJoinRoom, name) => {
    socket.name = name;
    socket.join(newJoinRoom);
    socket.room = newJoinRoom;

    let clients = io.sockets.adapter.rooms.get(newJoinRoom);
    const { currentChatRoomUserList, roomClientsNum } = getRoomInfo(clients);

    io.to(newJoinRoom).emit(
      "notice",
      currentChatRoomUserList,
      roomClientsNum,
      socket.name,
      "님이 들어오셨습니다"
    );

    if (preJoinRoom !== "") {
      socket.leave(preJoinRoom);

      let preClients = io.sockets.adapter.rooms.get(preJoinRoom);
      const preRoomInfo = getRoomInfo(preClients);
      io.to(preJoinRoom).emit(
        "notice",
        preRoomInfo.currentChatRoomUserList,
        preRoomInfo.roomClientsNum,
        socket.name,
        "님이 나가셨습니다"
      );
    }
  });

  socket.on("chat message", async (msg) => {
    try {
      const sql = "INSERT INTO messages (chat_id, sender_id, message, created_at) VALUES (?, ?, ?, NOW())";
      await db.query(sql, [socket.room, socket.name, msg]);

      io.to(socket.room).emit("chat message", socket.name, msg);
    } catch (error) {
      console.error("Message saving failed:", error);
    }
  });

  socket.on("disconnect", () => {
    let clients = io.sockets.adapter.rooms.get(socket.room);
    const { currentChatRoomUserList, roomClientsNum } = getRoomInfo(clients);
    io.to(socket.room).emit(
      "notice",
      currentChatRoomUserList,
      roomClientsNum,
      socket.name,
      "님이 나가셨습니다"
    );
  });
});

// 사용자 등록
app.post('/api/register', [
  body('name').isString().withMessage('Name must be a string'),
  body('age').isInt({ min: 1 }).withMessage('Age must be a positive integer'),
  body('studentId').isString().withMessage('Student ID must be a string'),
  body('department').isString().withMessage('Department must be a string'),
  body('username')
    .matches(/^[A-Za-z0-9@_\-~]+$/).withMessage('Username can only contain letters, numbers, and special characters (@, _, -, ~)')
    .notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, age, studentId, department, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, age, student_id, department, username, password) VALUES (?, ?, ?, ?, ?, ?)';
    await db.query(sql, [name, age, studentId, department, username, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// 사용자 로그인
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  try {
    const [results] = await db.query(sql, [username]);
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '5h' });
        return res.json({ message: 'Login successful', token });
      }
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// 사용자 정보 가져오기
app.get('/api/userInfo', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const sql = 'SELECT id, name, username FROM users WHERE id = ?';
    const [userInfo] = await db.query(sql, [userId]);
    res.json({ userInfo: userInfo[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user info', details: error.message });
  }
});

// 홈 데이터 가져오기
app.get('/api/home', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [calendarResults] = await db.query('SELECT * FROM calendar WHERE user_id = ?', [userId]);
    const [stickyResults] = await db.query('SELECT * FROM sticky WHERE user_id = ?', [userId]);

    res.json({
      calendar: calendarResults,
      sticky: stickyResults,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
});

// 메시지 기록 가져오기
app.get('/api/chatHistory/:chatRoomId', authenticateToken, async (req, res) => {
  const chatRoomId = req.params.chatRoomId;
  try {
    const sql = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC';
    const [messages] = await db.query(sql, [chatRoomId]);
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat history', details: error.message });
  }
});

// 친구 목록 가져오기
app.get('/api/friendsList', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const sql = 'SELECT u.id, u.name, u.username FROM friends f JOIN users u ON f.friend_id = u.id WHERE f.user_id = ?';
    const [friends] = await db.query(sql, [userId]);
    res.json({ friends });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friends list', details: error.message });
  }
});

// Helper function
function getRoomInfo(clients) {
  const roomClientsNum = clients ? clients.size : 0;
  const currentChatRoomUserList = [];
  if (clients) {
    clients.forEach((id) => {
      currentChatRoomUserList.push(io.sockets.sockets.get(id).name);
    });
  }
  return { roomClientsNum, currentChatRoomUserList };
}

server.listen(3000, () => {
  console.log("Server listening on *:3000");
});
