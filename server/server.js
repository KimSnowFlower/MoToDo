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

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // 검증 실패 시 403 반환

    req.user = user; // 토큰에서 추출한 사용자 정보를 req.user에 저장
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

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed' });
    } 
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // 로그인 성공 시 JWT 토큰 생성 및 반환
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Login successful', token }); // 토큰을 함께 반환
      }
    }
    res.status(401).json({ error: 'Invalid credentials' });
  });
});

app.get('/api/home', authenticateToken, async (req, res) => {
  const userId = req.user.id; // 'id'로 수정 필요

  const calendarSql = 'SELECT * FROM calendar WHERE user_id = ?';
  const stickySql = 'SELECT * FROM sticky WHERE user_id = ?';

  try {
    const [calendarResults] = await db.promise().query(calendarSql, [userId]);
    const [stickyResults] = await db.promise().query(stickySql, [userId]);

    res.json({
      calendar: calendarResults,
      sticky: stickyResults
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));