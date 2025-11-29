const express = require('express');
const { getDb } = require('../config/database');

const router = express.Router();

// Public route to get courses (for public courses page)
router.get('/courses', (req, res) => {
  const db = getDb();
  db.all(`
    SELECT c.*, 
           t.employeeId, 
           u.firstName || ' ' || u.lastName as teacherName
    FROM courses c
    LEFT JOIN teachers t ON c.teacherId = t.id
    LEFT JOIN users u ON t.userId = u.id
    ORDER BY c.courseName ASC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

module.exports = router;

