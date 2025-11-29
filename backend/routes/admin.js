const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { getDb } = require('../config/database');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard', (req, res) => {
  const db = getDb();
  
  const stats = {};
  let completed = 0;
  const total = 4;

  // Count students
  db.get('SELECT COUNT(*) as count FROM students', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.students = row.count;
    completed++;
    if (completed === total) res.json(stats);
  });

  // Count teachers
  db.get('SELECT COUNT(*) as count FROM teachers', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.teachers = row.count;
    completed++;
    if (completed === total) res.json(stats);
  });

  // Count courses
  db.get('SELECT COUNT(*) as count FROM courses', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.courses = row.count;
    completed++;
    if (completed === total) res.json(stats);
  });

  // Count enrollments
  db.get('SELECT COUNT(*) as count FROM enrollments', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.enrollments = row.count;
    completed++;
    if (completed === total) res.json(stats);
  });
});

// Students Management
router.get('/students', (req, res) => {
  const db = getDb();
  db.all(`
    SELECT s.*, u.username, u.email, u.firstName, u.lastName 
    FROM students s 
    JOIN users u ON s.userId = u.id
    ORDER BY s.id DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.post('/students', [
  body('username').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('studentId').trim().notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, firstName, lastName, studentId, grade, section, parentName, parentEmail, parentPhone } = req.body;
  const db = getDb();
  const bcrypt = require('bcryptjs');

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });

    db.run(
      'INSERT INTO users (username, email, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, 'user', firstName, lastName],
      function(err) {
        if (err) return res.status(500).json({ error: 'Error creating user' });
        
        db.run(
          'INSERT INTO students (userId, studentId, grade, section, parentName, parentEmail, parentPhone) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [this.lastID, studentId, grade, section, parentName, parentEmail, parentPhone],
          function(err) {
            if (err) return res.status(500).json({ error: 'Error creating student' });
            res.status(201).json({ message: 'Student created successfully', id: this.lastID });
          }
        );
      }
    );
  });
});

router.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { grade, section, parentName, parentEmail, parentPhone } = req.body;
  const db = getDb();

  db.run(
    'UPDATE students SET grade = ?, section = ?, parentName = ?, parentEmail = ?, parentPhone = ? WHERE id = ?',
    [grade, section, parentName, parentEmail, parentPhone, id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Student updated successfully' });
    }
  );
});

router.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.get('SELECT userId FROM students WHERE id = ?', [id], (err, student) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    db.run('DELETE FROM students WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      db.run('DELETE FROM users WHERE id = ?', [student.userId], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Student deleted successfully' });
      });
    });
  });
});

// Teachers Management
router.get('/teachers', (req, res) => {
  const db = getDb();
  db.all(`
    SELECT t.*, u.username, u.email, u.firstName, u.lastName 
    FROM teachers t 
    JOIN users u ON t.userId = u.id
    ORDER BY t.id DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.post('/teachers', [
  body('username').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('employeeId').trim().notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, firstName, lastName, employeeId, department, specialization } = req.body;
  const db = getDb();
  const bcrypt = require('bcryptjs');

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });

    db.run(
      'INSERT INTO users (username, email, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, 'teacher', firstName, lastName],
      function(err) {
        if (err) return res.status(500).json({ error: 'Error creating user' });
        
        db.run(
          'INSERT INTO teachers (userId, employeeId, department, specialization) VALUES (?, ?, ?, ?)',
          [this.lastID, employeeId, department, specialization],
          function(err) {
            if (err) return res.status(500).json({ error: 'Error creating teacher' });
            res.status(201).json({ message: 'Teacher created successfully', id: this.lastID });
          }
        );
      }
    );
  });
});

router.put('/teachers/:id', (req, res) => {
  const { id } = req.params;
  const { department, specialization } = req.body;
  const db = getDb();

  db.run(
    'UPDATE teachers SET department = ?, specialization = ? WHERE id = ?',
    [department, specialization, id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Teacher updated successfully' });
    }
  );
});

router.delete('/teachers/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.get('SELECT userId FROM teachers WHERE id = ?', [id], (err, teacher) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    db.run('DELETE FROM teachers WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      db.run('DELETE FROM users WHERE id = ?', [teacher.userId], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Teacher deleted successfully' });
      });
    });
  });
});

// Courses Management
router.get('/courses', (req, res) => {
  const db = getDb();
  db.all(`
    SELECT c.*, t.employeeId, u.firstName || ' ' || u.lastName as teacherName
    FROM courses c
    LEFT JOIN teachers t ON c.teacherId = t.id
    LEFT JOIN users u ON t.userId = u.id
    ORDER BY c.id DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.post('/courses', [
  body('courseCode').trim().notEmpty(),
  body('courseName').trim().notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { courseCode, courseName, description, teacherId, credits, schedule } = req.body;
  const db = getDb();

  db.run(
    'INSERT INTO courses (courseCode, courseName, description, teacherId, credits, schedule) VALUES (?, ?, ?, ?, ?, ?)',
    [courseCode, courseName, description, teacherId || null, credits || 0, schedule],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error creating course' });
      res.status(201).json({ message: 'Course created successfully', id: this.lastID });
    }
  );
});

router.put('/courses/:id', (req, res) => {
  const { id } = req.params;
  const { courseName, description, teacherId, credits, schedule } = req.body;
  const db = getDb();

  db.run(
    'UPDATE courses SET courseName = ?, description = ?, teacherId = ?, credits = ?, schedule = ? WHERE id = ?',
    [courseName, description, teacherId || null, credits || 0, schedule, id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Course updated successfully' });
    }
  );
});

router.delete('/courses/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.run('DELETE FROM courses WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Course deleted successfully' });
  });
});

// Enrollments Management
router.get('/enrollments', (req, res) => {
  const db = getDb();
  db.all(`
    SELECT e.*, 
           s.studentId, u1.firstName || ' ' || u1.lastName as studentName,
           c.courseCode, c.courseName
    FROM enrollments e
    JOIN students s ON e.studentId = s.id
    JOIN users u1 ON s.userId = u1.id
    JOIN courses c ON e.courseId = c.id
    ORDER BY e.id DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.post('/enrollments', [
  body('studentId').notEmpty(),
  body('courseId').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { studentId, courseId, status = 'active' } = req.body;
  const db = getDb();

  db.run(
    'INSERT INTO enrollments (studentId, courseId, status) VALUES (?, ?, ?)',
    [studentId, courseId, status],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Student already enrolled in this course' });
        }
        return res.status(500).json({ error: 'Error creating enrollment' });
      }
      res.status(201).json({ message: 'Enrollment created successfully', id: this.lastID });
    }
  );
});

router.delete('/enrollments/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.run('DELETE FROM enrollments WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Enrollment deleted successfully' });
  });
});

// Announcements Management
router.get('/announcements', (req, res) => {
  const db = getDb();
  db.all(`
    SELECT a.*, u.firstName || ' ' || u.lastName as authorName
    FROM announcements a
    JOIN users u ON a.authorId = u.id
    ORDER BY a.createdAt DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.post('/announcements', [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, targetAudience = 'all' } = req.body;
  const db = getDb();

  db.run(
    'INSERT INTO announcements (title, content, authorId, targetAudience) VALUES (?, ?, ?, ?)',
    [title, content, req.user.id, targetAudience],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error creating announcement' });
      res.status(201).json({ message: 'Announcement created successfully', id: this.lastID });
    }
  );
});

router.put('/announcements/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, targetAudience } = req.body;
  const db = getDb();

  db.run(
    'UPDATE announcements SET title = ?, content = ?, targetAudience = ? WHERE id = ?',
    [title, content, targetAudience, id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Announcement updated successfully' });
    }
  );
});

router.delete('/announcements/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.run('DELETE FROM announcements WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Announcement deleted successfully' });
  });
});

// Grades Management
router.get('/grades', (req, res) => {
  const db = getDb();
  db.all(`
    SELECT g.*, 
           s.studentId, u1.firstName || ' ' || u1.lastName as studentName,
           c.courseCode, c.courseName
    FROM grades g
    JOIN enrollments e ON g.enrollmentId = e.id
    JOIN students s ON e.studentId = s.id
    JOIN users u1 ON s.userId = u1.id
    JOIN courses c ON e.courseId = c.id
    ORDER BY g.dateRecorded DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

router.post('/grades', [
  body('enrollmentId').notEmpty(),
  body('assignment').trim().notEmpty(),
  body('score').isNumeric(),
  body('maxScore').isNumeric(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { enrollmentId, assignment, score, maxScore, grade, remarks } = req.body;
  const db = getDb();

  db.run(
    'INSERT INTO grades (enrollmentId, assignment, score, maxScore, grade, remarks) VALUES (?, ?, ?, ?, ?, ?)',
    [enrollmentId, assignment, score, maxScore, grade, remarks],
    function(err) {
      if (err) return res.status(500).json({ error: 'Error creating grade' });
      res.status(201).json({ message: 'Grade created successfully', id: this.lastID });
    }
  );
});

router.put('/grades/:id', (req, res) => {
  const { id } = req.params;
  const { assignment, score, maxScore, grade, remarks } = req.body;
  const db = getDb();

  db.run(
    'UPDATE grades SET assignment = ?, score = ?, maxScore = ?, grade = ?, remarks = ? WHERE id = ?',
    [assignment, score, maxScore, grade, remarks, id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Grade updated successfully' });
    }
  );
});

router.delete('/grades/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.run('DELETE FROM grades WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Grade deleted successfully' });
  });
});

module.exports = router;

