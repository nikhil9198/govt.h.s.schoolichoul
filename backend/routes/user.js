const express = require('express');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { getDb } = require('../config/database');

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);
router.use(requireUser);

// Get user profile
router.get('/profile', (req, res) => {
  const db = getDb();
  
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get student or teacher details
    if (user.role === 'user') {
      db.get('SELECT * FROM students WHERE userId = ?', [req.user.id], (err, student) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ ...user, studentDetails: student });
      });
    } else if (user.role === 'teacher') {
      db.get('SELECT * FROM teachers WHERE userId = ?', [req.user.id], (err, teacher) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ ...user, teacherDetails: teacher });
      });
    } else {
      res.json(user);
    }
  });
});

// Get enrolled courses
router.get('/courses', (req, res) => {
  const db = getDb();
  
  // Get student ID
  db.get('SELECT id FROM students WHERE userId = ?', [req.user.id], (err, student) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!student) return res.status(404).json({ error: 'Student record not found' });

    db.all(`
      SELECT c.*, e.enrollmentDate, e.status as enrollmentStatus,
             t.employeeId, u.firstName || ' ' || u.lastName as teacherName
      FROM enrollments e
      JOIN courses c ON e.courseId = c.id
      LEFT JOIN teachers t ON c.teacherId = t.id
      LEFT JOIN users u ON t.userId = u.id
      WHERE e.studentId = ? AND e.status = 'active'
      ORDER BY c.courseName
    `, [student.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    });
  });
});

// Get grades for enrolled courses
router.get('/grades', (req, res) => {
  const db = getDb();
  
  db.get('SELECT id FROM students WHERE userId = ?', [req.user.id], (err, student) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!student) return res.status(404).json({ error: 'Student record not found' });

    db.all(`
      SELECT g.*, 
             c.courseCode, c.courseName,
             e.enrollmentDate
      FROM grades g
      JOIN enrollments e ON g.enrollmentId = e.id
      JOIN courses c ON e.courseId = c.id
      WHERE e.studentId = ?
      ORDER BY g.dateRecorded DESC
    `, [student.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rows);
    });
  });
});

// Get announcements
router.get('/announcements', (req, res) => {
  const db = getDb();
  
  db.all(`
    SELECT a.*, u.firstName || ' ' || u.lastName as authorName
    FROM announcements a
    JOIN users u ON a.authorId = u.id
    WHERE a.targetAudience = 'all' OR a.targetAudience = ?
    ORDER BY a.createdAt DESC
  `, [req.user.role], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Get course details with grades
router.get('/courses/:courseId', (req, res) => {
  const db = getDb();
  const { courseId } = req.params;
  
  db.get('SELECT id FROM students WHERE userId = ?', [req.user.id], (err, student) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!student) return res.status(404).json({ error: 'Student record not found' });

    // Get enrollment
    db.get('SELECT * FROM enrollments WHERE studentId = ? AND courseId = ?', [student.id, courseId], (err, enrollment) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!enrollment) return res.status(404).json({ error: 'Not enrolled in this course' });

      // Get course details
      db.get(`
        SELECT c.*, 
               t.employeeId, u.firstName || ' ' || u.lastName as teacherName
        FROM courses c
        LEFT JOIN teachers t ON c.teacherId = t.id
        LEFT JOIN users u ON t.userId = u.id
        WHERE c.id = ?
      `, [courseId], (err, course) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Get grades for this enrollment
        db.all('SELECT * FROM grades WHERE enrollmentId = ? ORDER BY dateRecorded DESC', [enrollment.id], (err, grades) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.json({ course, enrollment, grades });
        });
      });
    });
  });
});

module.exports = router;

