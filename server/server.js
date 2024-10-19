const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const http = require('http');
const socketIo = require('socket.io');
const { group } = require('console');
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
    const currentMonth = new Date().getMonth() + 1;

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
// 이벤트 확인 -> Calendar.jsx
app.get('/api/events', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT * FROM calendar WHERE user_id = ?';

  try {
    const [results] = await db.query(query, [userId]);

    res.status(201).json({events: results, userId: userId});
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events', details: error.message});
  };  
});

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

// 이벤트 수정 -> Calendar.jsx
app.put('/api/events/:id', authenticateToken, async (req, res) => {
  const { id } = req.params.id;
  const { title, description, start_date, end_date, all_day, color } = req.body;

  console.log(title, description, start_date, end_date, all_day, color);

  // 필수 필드 확인
  if (!title || !start_date || !end_date) {
    return res.status(400).send('Title, start_date, and end_date are required');
  }

  const query = `
      UPDATE calendar
      SET title = ?, description = ?, start_date = ?, end_date = ?, all_day = ?, color = ?
      WHERE id = ?`;

  try {
    const sql = 'UPDATE calendar SET title = ?, description = ?, start_date = ?, end_date = ?, all_day =? , color = ? WHERE id = ?';
    const [results] = await db.query(sql, [title, description, start_date, end_date, all_day, color, id]);

    res.status(201).json({updateEvent: results});
  } catch(error) {
    console.error('Database error:', err);
    return res.status(500).send('Error updating event');
  }
});

// 이벤트 삭제 -> Calendar.jsx
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  const id = req.params.id; // URL에서 이벤트 ID 가져오기
  const userId = req.user.id; // 로그인한 사용자의 ID

  try {
    const sql = 'DELETE FROM calendar WHERE id = ? AND user_id = ?';
    const [result] = await db.query(sql, [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sticky note not found or not authorized to delete' });
    }

    res.json({ message: 'Sticky note deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting event');
  }
});

// Sticky
// Sticky 노트 데이터 가져오기
app.get('/api/stickys', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [stickyResults] = await db.query('SELECT * FROM sticky WHERE user_id = ?', [userId]);

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
      const sql = `INSERT INTO sticky (user_id, content, position_x, position_y, width, height, created_at, updated_at) 
                   VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
      const [stickyResults] = await db.query(sql, [userId, content, position_x, position_y, width, height]);
      
      console.log(stickyResults);
     
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
    const sql = 'SELECT id, content, completed FROM todos WHERE user_id = ?'; // id도 가져오도록 수정
    const [rows] = await db.query(sql, [userId]);

    res.json({ todos: rows }); 
  } catch (error) {
    console.error('Error fetching to-do items:', error);
    res.status(500).json({ error: 'Failed to fetch to-do items' }); 
  }
});

// 새로운 To-Do 항목 추가하기 -> To Do.jsx
app.post('/api/todos', authenticateToken, async (req, res) => {
  const userId = req.user.id; 
  const { content, completed }  = req.body;

  try {
    const sql = 'INSERT INTO todos (user_id, content, created_at, updated_at, completed) VALUES (?, ?, NOW(), NOW(), ?)';
    const [result] = await db.query(sql, [userId, content, completed]);

    const newTodo = {
      id: result.insertId,
      userId: userId,
      content: content,
      completed, completed,
    };

    res.status(201).json({ newTodo: newTodo }); // 새로 추가된 항목 반환
  } catch (error) {
    console.error('Error creating to-do item:', error);
    res.status(500).json({ error: 'Failed to create to-do item' }); 
  }
});

// To-Do Completed 패칭
app.patch('/api/todos/:id', authenticateToken, async (req,res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { completed } = req .body;

    try {
      const sql = 'UPDATE todos SET completed = ? WHERE id = ? AND user_id = ? ';
      await db.query(sql, [completed, id, userId]);
  
      res.status(200).json({ message: 'Todo item chekced update successfully' });
    } catch (error) {
      console.error('Error patching to-do items', error);
      res.status(500).json({ error: 'Failed to patching to-do item' });
    }
});

// 특정 To-Do 항목 삭제하기 -> To Do.jsx
app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params; // URL에서 전달된 id 가져오기'

  db.query('DELETE FROM todos WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error deleting todo:', error); 
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Todo item deleted successfully' }); // 성공 시 응답
  });
});

// 정보 가져오기 -> Friends.jsx
app.get('/api/userInfo', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // student_id 필드도 함께 선택
    const [userInfoResults] = await db.query(
      'SELECT id, name, student_id FROM users WHERE id = ?', 
      [userId]
    );

    if (!userInfoResults.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    // student_id 포함해서 응답 반환
    res.json({
      id: userInfoResults[0].id,
      name: userInfoResults[0].name,
      student_id: userInfoResults[0].student_id
    });
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
  const { userIds } = req.body; 
  const userId = req.user.id; 

  try {
    const sql = 'INSERT INTO chats (user_id, friend_id, created_at) VALUES (?, ?, NOW())';
    const friendId = userIds[0]; 
    const [result] = await db.query(sql, [userId, friendId]); 
    const chatRoomId = result.insertId;

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
    await db.query(sql2, [result.insertId, userId]);

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

// 그룹 가입 API -> Group.jsx
app.post('/api/joinGroup', authenticateToken, async (req, res) => {
  const userId = req.user.id; // 현재 로그인한 사용자 ID
  const { groupId: joinGroupCode } = req.body; // 클라이언트로부터 그룹 코드를 받음

  // 그룹 코드에 해당하는 그룹 정보 조회
  const sql = `SELECT id FROM groups WHERE code = ?`;
  const sqlInsertMember = `INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW())`;

  try {
    const [groupRows] = await db.query(sql, [joinGroupCode]);

    if (groupRows.length === 0) {
      return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' }); // 그룹이 존재하지 않음
    }

    const foundGroupId = groupRows[0].id; // 그룹 ID를 찾기 위해 foundGroupId라는 새 변수 사용

    // 그룹 멤버로 추가
    await db.query(sqlInsertMember, [foundGroupId, userId]);

    res.status(201).json({ success: true, groupId: foundGroupId });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: '그룹 가입에 실패했습니다.' });
  }
});

// 그룹 탈퇴 API -> Group.jsx
app.delete('/api/groups', authenticateToken, async (req, res) => {
  const userId = req.user.id; 
  const { groupId } = req.body; // 클라이언트로부터 그룹 코드를 받음

  // 그룹 코드에 해당하는 그룹 정보 조회
  const sql = `SELECT id FROM groups WHERE code = ?`;
  const sqlDeleteMember = `DELETE FROM group_members WHERE group_id = ? AND user_id = ?`;

  try {
      const [groupRows] = await db.query(sql, [groupId]);

      if (groupRows.length === 0) {
          return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' }); // 그룹이 존재하지 않음
      }

      const groupIdFromDb = groupRows[0].id; // 변수 이름 변경

      // 그룹 멤버 삭제
      const [deleteResult] = await db.query(sqlDeleteMember, [groupIdFromDb, userId]);

      if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ error: '그룹에서 탈퇴할 수 없습니다. 사용자 정보를 확인해주세요.' });
      }

      res.status(200).json({ success: true });
  } catch (error) {
      console.error('Error dropping group:', error);
      res.status(500).json({ error: '그룹 탈퇴에 실패했습니다.' });
  }
});

// Group To-Do
// Group To-Do 항목 가져오기
app.get('/api/groupTodos', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const groupId = req.query.groupId;

  try {
    const sql = 'SELECT id, group_id, user_id, content, completed FROM group_todos WHERE group_id =? AND user_id = ?';
    const [results] = await db.query(sql, [groupId, userId]);

    res.status(201).json({ gTodo: results });
  } catch (error){
    console.error('Error fetching Group to-do items:', error);
    res.status(500).json({ error: 'Failed to fetch Group to-do itmes' });
  }
});

// Group To-Do 항목 추가하기
app.post('/api/groupTodos', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { groupId, content, completed } = req.body;

  try {
    const sql = 'INSERT INTO group_todos (group_id, user_id, content, completed, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
    const [result] = await db.query(sql, [groupId, userId, content, completed]); 

    const newTodo = {
      id: result.insertId,
      groupId: groupId,
      userId: userId,
      content: content,
      completed: completed,
    };

    res.status(201).json({ newTodo: newTodo });
  } catch (error) {
    console.error('Error creating Group to-do items', error);
    res.status(500).json({ error: 'Failed to create Group to-do item' });
  }
});

// Group To-Do 항목 삭제하기
app.delete('/api/groupTodos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM group_todos WHERE id = ?', [id], (error, result) => {
    if(error) {
      console.error('Error deleting Group todo:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Group Todo item deleted successfully' });
  });
});

// Group To-Do 체크 표시 패치하기
app.patch('/api/groupTodos/:id', authenticateToken, async (req, res) => {
  const userId  = req.user.id;
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const sql = 'UPDATE group_todos SET completed = ? WHERE id = ? AND user_id = ? ';
    await db.query(sql, [completed, id, userId]);

    res.status(200).json({ message: 'Group Todo item chekced update successfully' });
  } catch (error) {
    console.error('Error patching Group to-do items', error);
    res.status(500).json({ error: 'Failed to patching Group to-do item' });
  }
});

// Notice
// Notice 항목 가져오기
app.get('/api/notice', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const groupId = req.query.groupId;

  try {
    const sql = 'SELECT id, title, content, author FROM notice WHERE user_id = ? AND group_id = ?';
    const [results] = await db.query(sql, [userId, groupId]);

    res.status(201).json({ notices: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Notice items' });
  }
});

// Notice 항목 추가하기
app.post('/api/notice', authenticateToken, async (req,res) => {
  const userId = req.user.id;
  const { groupId, title, content } = req.body;

  try {
    const searchUser = 'SELECT name FROM users WHERE id = ?'
    const [author] = await db.query(searchUser, [userId]);

    const sql = 'INSERT INTO notice (user_id, group_id, title, content, author, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
    const [results] = await db.query(sql, [userId, groupId, title, content, author[0].name]);

    const newNotice = {
      id: results.insertId,
      groupId: groupId,
      userId: userId,
      title: title,
      content: content,
      author: author[0].name,
    }

    res.status(200).json({ newNotice: newNotice });
  } catch (error) {
    res.status(500).json({ error: 'Failed to creating Notice items' });
  }
});

// Notice 항목 삭제하기
app.delete('/api/notice/:noticeId', authenticateToken, async (req, res) => {
  const { noticeId } = req.params;

  try {
    const sql = 'DELETE FROM notice WHERE id = ?';
    await db.query(sql, [noticeId]);

    res.status(200).json({ message: 'Notice item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error : 'Failed to deleting Notice items' });
  }
});

// Notice 항목 패치하기
app.patch('/api/notice/:noticeId', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, groupId } = req.body;

  try {
    const sql = 'UPDATE notice SET title = ?, content = ? WHERE id = ? AND group_id = ?';
    await db.query(sql, [title, content, id, groupId]);

    res.status(200).json({ message: 'Notice item updated successfully'});
  } catch (error) {
    res.status(500).json({ error : 'Failed to patching Notice items' });
  }
});

// 서버 포트 설정
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});