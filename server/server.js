const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());
app.use(cors());

// 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'svc.sel4.cloudtype.app',
  port: 32329,
  user: 'root',
  password: 'snow1010',
  database: 'motodo'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// JWT 비밀키 생성
const JWT_SECRET = 'motodo-JWT-SECRET';

// JWT 검증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null)
    return res.sendStatus(401);

  jwt.verify(toekn, JWT_SECRET, (err, user) => {
    if (err)
      return res.sendStatus(403);

    req.user = user;
    next();
  });
};

// 사용자 등록
app.post('/api/register', [
  // 입력 검증
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
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, age, student_id, department, username, password) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, age, studentId, department, username, hashedPassword], (err) => {
      if (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
      } else {
        res.status(201).json({ message: 'User registered successfully' });
      }
    });
  } catch (hashError) {
    console.error('Hashing error:', hashError);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 사용자 로그인
app.post('/api/login', [
  body('username').isString().withMessage('Username must be a string'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  console.log('Login attempt for username:', username);

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Login failed', details: err.message });
    } else if (results.length > 0) {
      console.log('User found:', results[0].username);
      try {
        // 비밀번호 비교
        const match = await bcrypt.compare(password, results[0].password);
        if (match) {
          console.log('Password match successful');
          // 로그인 성공 로직 (예: 토큰 생성 등)
          res.json({ message: 'Login successful' });
        } else {
          console.log('Password match failed');
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } catch (bcryptError) {
        console.error('Bcrypt compare error:', bcryptError);
        res.status(500).json({ error: 'Login failed', details: 'Password comparison error' });
      }
    } else {
      console.log('User not found');
      res.status(401).json({ error: 'User not found' });
    }
  });
});

app.post('api/home', async (req, res) => {
  const userId = req.user.userid;

  const calendarSql = 'SELECT * FROM calendar WHERE user_id = ?';
  const stickySql = 'SELECT * FROM sticky WHERE user_id = ?';

  try {
    // Fetch calendar data
    const [calendarResults] = await db.promise().query(calendarSql, [userId]);

    // Fetch sticky data
    const [stickyResults] = await db.promise().query(stickySql, [userId]);

    res.json({
      calendar: calendarResults,
      sticky: stickyResults
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));