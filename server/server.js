const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config(); // 환경 변수 설정

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
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

// 데이터베이스 연결 확인
(async () => {
  try {
    await db.getConnection();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();

// JWT 비밀키를 환경 변수로 설정
const JWT_SECRET = process.env.JWT_SECRET;

// JWT 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// 소켓 연결 처리
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log('User joined room: ${chatRoomId}');
  });

  socket.on('chatMessage', async ({ chatRoomId, senderId, message }) => {
    try {
      // 대화 내용을 messages 테이블에 저장
      const sql = 'INSERT INTO messages (chat_id, sender_id, message, created_at) VALUES (?, ?, ?, NOW())';
      await db.query(sql, [chatRoomId, senderId, message]);

      // 메시지를 방에 있는 모든 사용자에게 전송
      io.to(chatRoomId).emit('message', {
        senderId,
        message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Register
// 사용자 등록 -> Register.jsx
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

// LoginForm
// 사용자 로그인 -> LoginForm.jsx
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  try {
    const [results] = await db.query(sql, [username]);
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ message: 'Login successful', token });
      }
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Home
// 홈 데이터 가져오기 -> Home.jsx
app.get('/api/home', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // 현재 월 가져오기
    const currentMonth = new Date().getMonth() + 1;

    // 현재 월에 해당하는 캘린더 이벤트만 선택
    const [calendarResults] = await db.query(
      'SELECT * FROM calendar WHERE user_id = ? AND MONTH(start_date) = ?',
      [userId, currentMonth]
    );
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

// Calendar
// 이벤트 저장 -> Calendar.jsx
app.post('/api/events', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const { title, description, start_date, end_date, all_day, color } = req.body;

  const query = `
      INSERT INTO calendar (user_id, title, description, start_date, end_date, all_day, color, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  const [calendarEvents] = await db.query(query, [user_id, title, description, start_date, end_date, all_day, color]);

  if(!calendarEvents){
    console.log("undefined");
  }

  return res.json({ saveEventId: calendarEvents });
});

// 이벤트 확인 -> Calendar.jsx
app.get('/api/events', authenticateToken, (req, res) => {
  const userId = req.user.id; // 로그인한 사용자의 ID

  const query = `
      SELECT * FROM calendar 
      WHERE user_id = ?`; // 날짜 조건 제거

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Error fetching events');
      }
      
      res.send(results); // 결과 반환
  });
});

// 이벤트 수정 -> Calendar.jsx
app.put('/api/events/:id', authenticateToken, (req, res) => {
  const { id } = req.params.id;
  const { title, description, start_date, end_date, all_day, color } = req.body;

  // 필수 필드 확인
  if (!title || !start_date || !end_date) {
    return res.status(400).send('Title, start_date, and end_date are required');
  }

  const query = `
      UPDATE calendar
      SET title = ?, description = ?, start_date = ?, end_date = ?, all_day = ?, color = ?
      WHERE id = ?`;
  
  db.query(query, [title, description, start_date, end_date, all_day, color, id], (err) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Error updating event');
      }
      res.send('Event updated');
  });
});

// 이벤트 삭제 -> Calendar.jsx
app.delete('/api/events/:id', authenticateToken, (req, res) => {
  const id = req.params.id; // URL에서 이벤트 ID 가져오기
  const userId = req.user.id; // 로그인한 사용자의 ID

  const query = `DELETE FROM calendar WHERE id = ? AND user_id = ?`; // user_id도 조건에 추가

  db.query(query, [id, userId], (err, result) => {
    if (err) return res.status(500).send('Error deleting event');
    if (result.affectedRows === 0) return res.status(404).send('Event not found or not authorized to delete');
    res.send('Event deleted');
  });
});

// Sticky
// Sticky 노트 데이터 가져오기
app.get('/api/stickys', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [stickyResults] = await db.query('SELECT * FROM sticky WHERE user_id = ?', [userId]);

        console.log(stickyResults);
        res.json({ sticky: stickyResults });
    } catch (error) {
        console.error('Error fetching sticky notes:', error);
        res.status(500).json({ error: 'Error fetching sticky notes', details: error.message });
    }
});

// Sticky 노트 생성
app.post('/api/stickys', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { content, position_x, position_y, width, height } = req.body;

  try {
      // SQL 쿼리에서 8개의 열에 대해 8개의 값을 정확하게 전달
      const sql = `INSERT INTO sticky (user_id, content, position_x, position_y, width, height, created_at, updated_at) 
                   VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
      const [stickyResults] = await db.query(sql, [userId, content, position_x, position_y, width, height]);
      
      // 성공 시 추가된 Sticky 노트의 정보를 반환
      res.status(201).json({ sticky: stickyResults });
  } catch (error) {
      console.error('Error creating sticky note:', error);
      res.status(500).json({ error: 'Failed to create sticky note', details: error.message });
  }
});

// Sticky 노트 수정
app.put('/api/stickys/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const { content, position_x, position_y, width, height } = req.body;

    try {
        const sql = `UPDATE sticky 
                     SET content = ?, position_x = ?, position_y = ?, width = ?, height = ?, updated_at = NOW() 
                     WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(sql, [content, position_x, position_y, width, height, id, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sticky note not found or not authorized to update' });
        }

        res.json({ message: 'Sticky note updated successfully' });
    } catch (error) {
        console.error('Error updating sticky note:', error);
        res.status(500).json({ error: 'Failed to update sticky note', details: error.message });
    }
});

// Sticky 노트 삭제
app.delete('/api/stickys/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;

    try {
        const sql = `DELETE FROM sticky WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(sql, [id, userId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sticky note not found or not authorized to delete' });
        }

        res.json({ message: 'Sticky note deleted successfully' });
    } catch (error) {
        console.error('Error deleting sticky note:', error);
        res.status(500).json({ error: 'Failed to delete sticky note', details: error.message });
    }
});


// To-Do 항목 가져오기 -> To Do.jsx
app.get('/api/todos', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const sql = 'SELECT id, content FROM todos WHERE user_id = ?'; // id도 가져오도록 수정
    const [rows] = await db.query(sql, [userId]);
    res.json(rows); 
  } catch (error) {
    console.error('Error fetching to-do items:', error);
    res.status(500).json({ error: 'Failed to fetch to-do items' }); 
  }
});

// 새로운 To-Do 항목 추가하기 -> To Do.jsx
app.post('/api/todos', authenticateToken, async (req, res) => {
  const userId = req.user.id; 
  const { content } = req.body;

  try {
    const sql = 'INSERT INTO todos (user_id, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';
    const result = await db.query(sql, [userId, content]);

    // 새로 생성된 항목 반환
    const newTodo = {
      id: result.insertId, // 새로 생성된 ID
      user_id: userId,
      content: content,
    };

    res.status(201).json(newTodo); // 새로 추가된 항목 반환
  } catch (error) {
    console.error('Error creating to-do item:', error);
    res.status(500).json({ error: 'Failed to create to-do item' }); 
  }
});

// 특정 To-Do 항목 삭제하기 -> To Do.jsx
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params; // URL에서 전달된 id 가져오기
  db.query('DELETE FROM todos WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error deleting todo:', error); 
      return res.status(500).json({ error: error.message });
    }

    // 삭제 후 항상 성공 응답
    res.status(200).json({ message: 'Todo item deleted successfully' }); // 성공 시 응답
  });
});

// 정보 가져오기 -> Friends.jsx
app.get('/api/userInfo', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [userInfoResults] = await db.query('SELECT id, name FROM users WHERE id = ?', [userId]);

    if (!userInfoResults.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: userInfoResults[0].id, name: userInfoResults[0].name });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Error fetching user info', details: error.message });
  }
});

// 친구 목록 가져오기 -> Friends.jsx
app.get('/api/friendsList', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // 친구 ID 조회
    const [friendResults] = await db.query('SELECT friend_id FROM friends WHERE user_id = ?', [userId]);
    const friendIds = friendResults.map(friend => friend.friend_id);

    if (friendIds.length > 0) {
      // 친구 정보 조회를 위한 쿼리
      const placeholders = friendIds.map(() => '?').join(', ');
      const friendInfoSql = `SELECT * FROM users WHERE id IN (${placeholders})`; // 백틱 사용
      const [friendInfoResults] = await db.query(friendInfoSql, friendIds);
      
      return res.json({ friends: friendInfoResults });
    }

    res.json({ friends: [] });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Error fetching friends', details: error.message });
  }
});

// 채팅 기록 가져오기 -> Friends.jsx
app.get('/api/chatHistory/:chatRoomId', authenticateToken, async (req, res) => {
  const chatRoomId = req.params.chatRoomId;

  try {
    const sql = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC';
    const [messages] = await db.query(sql, [chatRoomId]);
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Error fetching chat history', details: error.message });
  }
});

// 메시지 저장 API -> Friends.jsx
app.post('/api/saveMessage', authenticateToken, async (req, res) => {
  const { chat_id, sender_id, message } = req.body;

  console.log(chat_id, sender_id, message);

  // SQL 쿼리 작성
  const sql = 'INSERT INTO messages (chat_id, sender_id, message, created_at) VALUES (?, ?, ?, NOW())';
  
  try {
      const [result] = await db.query(sql, [chat_id, sender_id, message]); // 값을 SQL 쿼리에 전달
      // 성공적으로 메시지가 저장된 경우
      res.status(201).json({ message: '메시지가 저장되었습니다.' });
  } catch (error) {
      console.error('메시지 저장 실패:', error);
      res.status(500).json({ error: '메시지 저장 실패', details: error.message });
  }
});

// 새로운 채팅 방 생성 -> Friends.jsx
app.post('/api/chatRoom', authenticateToken, async (req, res) => {
  const { userIds } = req.body; // 채팅에 참여할 사용자 ID 배열
  const userId = req.user.id; // 현재 사용자 ID

  console.log(userIds);

  try {
    // 새 채팅 방 생성
    const sql = 'INSERT INTO chats (user_id, friend_id, created_at) VALUES (?, ?, NOW())'; // user_id와 friend_id 모두 추가
    const friendId = userIds[0]; // 예를 들어 첫 번째 친구 ID 사용
    const [result] = await db.query(sql, [userId, friendId]); // userId와 friendId를 SQL 쿼리에 전달
    const chatRoomId = result.insertId;

    // 참여할 친구와의 관계 설정 (채팅 방에 추가)
    const friendInsertPromises = userIds.map(friendId => {
      return db.query('INSERT INTO chats (user_id, friend_id, created_at) VALUES (?, ?, NOW())', [chatRoomId, friendId]);
    });

    await Promise.all(friendInsertPromises);

    res.status(201).json({ chatRoomId });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ error: 'Error creating chat room', details: error.message });
  }
});

// 채팅 방 조회 API -> Friends.jsx
app.get('/api/chatRooms', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
      // 사용자가 참여하고 있는 모든 채팅 방 조회
      const sql = `
          SELECT c.id AS chatRoomId, c.created_at AS createdAt, 
                 CASE 
                     WHEN c.user_id = ? THEN c.friend_id 
                     ELSE c.user_id 
                 END AS otherUserId
          FROM chats c
          WHERE c.user_id = ? OR c.friend_id = ?
          ORDER BY c.created_at DESC
      `;
      const [chatRooms] = await db.query(sql, [userId, userId, userId]);

      res.json({ chatRooms });
  } catch (error) {
      console.error('Error fetching chat rooms:', error);
      res.status(500).json({ error: 'Error fetching chat rooms', details: error.message });
  }
});

// 그룹 조회 -> Group.jsx
app.get('/api/groups', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  // 그룹 멤버 테이블과 그룹 테이블을 조인하여 사용자가 속한 그룹 정보 조회
  const sql = `
    SELECT g.id, g.name, g.code
    FROM groups g
    JOIN group_members gm ON g.id = gm.group_id
    WHERE gm.user_id = ?
  `;

  try {
    const [rows] = await db.query(sql, [userId]);
    res.json(rows); // 그룹 정보 반환
  } catch (error) {
    console.error('그룹 조회 실패:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// 그룹 생성 API -> Group.jsx
app.post('/api/createGroup', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { code, name } = req.body; // 클라이언트로부터 그룹 코드와 이름을 받음

  const sql = `INSERT INTO groups (code, name, created_at, updated_at, creator_id) VALUES (?, ?, NOW(), NOW(), ?)`;
  const sql2 = `INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW())`;

  try {
    const [result] = await db.query(sql, [code, name, userId]);
    
    const [joinGroup] = await db.query(sql2, [result.insertId, userId]);

    console.log('User ID:', userId);
    console.log('Group creation result:', result);
    console.log("JoinGroup: ", joinGroup);

    res.status(201).json({ success: true, groupId: result.insertId });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// 그룹 코드 중복 확인 API -> Group.jsx
app.get('/api/checkGroupCode/:code', async (req, res) => {
  const groupCode = req.params.code;

  const sql = `SELECT COUNT(*) AS count FROM groups WHERE code = ?`;

  try {
    const [rows] = await db.query(sql, [groupCode]);
    res.json({ exists: rows[0].count > 0 }); // 존재 여부를 반환
  } catch (error) {
    console.error('Error checking group code:', error);
    res.status(500).json({ error: 'Failed to check group code' });
  }
});

// 서버 포트 설정
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
