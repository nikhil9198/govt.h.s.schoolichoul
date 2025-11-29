const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../config/database');

const router = express.Router();

// Register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name required'),
  body('lastName').trim().notEmpty().withMessage('Last name required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, firstName, lastName, role = 'user', studentId, grade, section, parentName, parentEmail, parentPhone, employeeId, department, specialization } = req.body;

    const db = getDb();

    // Check if user exists
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      db.run(
        'INSERT INTO users (username, email, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, role, firstName, lastName],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error creating user' });
          }

          const userId = this.lastID;

          // Create student or teacher record
          if (role === 'user' && studentId) {
            db.run(
              'INSERT INTO students (userId, studentId, grade, section, parentName, parentEmail, parentPhone) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [userId, studentId, grade, section, parentName, parentEmail, parentPhone],
              (err) => {
                if (err) {
                  console.error('Error creating student record:', err);
                }
              }
            );
          } else if (role === 'teacher' && employeeId) {
            db.run(
              'INSERT INTO teachers (userId, employeeId, department, specialization) VALUES (?, ?, ?, ?)',
              [userId, employeeId, department, specialization],
              (err) => {
                if (err) {
                  console.error('Error creating teacher record:', err);
                }
              }
            );
          }

          // Generate token
          const token = jwt.sign(
            { id: userId, username, email, role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
          );

          res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: userId, username, email, role, firstName, lastName }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('username').notEmpty().withMessage('Username required'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const db = getDb();

    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

