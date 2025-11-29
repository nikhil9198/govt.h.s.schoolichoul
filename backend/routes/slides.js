const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { getDb } = require('../config/database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'slides');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slide-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Public route - Get all active slides
router.get('/', (req, res) => {
  const db = getDb();
  db.all(
    'SELECT * FROM slides WHERE isActive = 1 ORDER BY isDefault DESC, orderIndex ASC, id ASC',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // If no slides, ensure default slide is always included
      if (rows.length === 0) {
        db.get('SELECT * FROM slides WHERE isDefault = 1', (err, defaultSlide) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          if (defaultSlide) {
            defaultSlide.isActive = 1;
            return res.json([defaultSlide]);
          }
          return res.json([]);
        });
        return;
      }
      
      // Ensure default slide is always included and active
      const hasDefault = rows.some(slide => slide.isDefault === 1);
      if (!hasDefault) {
        db.get('SELECT * FROM slides WHERE isDefault = 1', (err, defaultSlide) => {
          if (!err && defaultSlide) {
            defaultSlide.isActive = 1;
            rows.unshift(defaultSlide);
          }
          res.json(rows);
        });
        return;
      }
      
      res.json(rows);
    }
  );
});

// Admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all slides (admin)
router.get('/admin', (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM slides ORDER BY isDefault DESC, orderIndex ASC, id ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Create slide
router.post('/', upload.single('image'), handleMulterError, (req, res) => {
  const { title, description, orderIndex, isActive } = req.body;
  const db = getDb();

  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const imagePath = `uploads/slides/${req.file.filename}`;
  const imageUrl = `/api/slides/image/${req.file.filename}`;

  db.run(
    'INSERT INTO slides (title, description, imageUrl, imagePath, orderIndex, isActive, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title || '', description || '', imageUrl, imagePath, orderIndex || 0, isActive !== undefined ? isActive : 1, 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating slide: ' + err.message });
      }
      res.status(201).json({ message: 'Slide created successfully', id: this.lastID });
    }
  );
});

// Update slide
router.put('/:id', upload.single('image'), handleMulterError, (req, res) => {
  const { id } = req.params;
  const { title, description, orderIndex, isActive } = req.body;
  const db = getDb();

  // If new image uploaded, update image path
  if (req.file) {
    const imagePath = `uploads/slides/${req.file.filename}`;
    const imageUrl = `/api/slides/image/${req.file.filename}`;

    // Get old image path to delete
    db.get('SELECT imagePath, isDefault FROM slides WHERE id = ?', [id], (err, slide) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Delete old image (if not default)
      if (slide && slide.imagePath && slide.imagePath !== 'default') {
        const oldImagePath = path.join(__dirname, '..', slide.imagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update with new image (but keep isDefault flag)
      db.run(
        'UPDATE slides SET title = ?, description = ?, imageUrl = ?, imagePath = ?, orderIndex = ?, isActive = ? WHERE id = ?',
        [title || '', description || '', imageUrl, imagePath, orderIndex || 0, isActive !== undefined ? isActive : 1, id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Slide updated successfully' });
        }
      );
    });
  } else {
    // Update without changing image
    db.run(
      'UPDATE slides SET title = ?, description = ?, orderIndex = ?, isActive = ? WHERE id = ?',
      [title || '', description || '', orderIndex || 0, isActive !== undefined ? isActive : 1, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Slide updated successfully' });
      }
    );
  }
});

// Delete slide
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  // Check if it's a default slide
  db.get('SELECT isDefault FROM slides WHERE id = ?', [id], (err, slide) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!slide) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    // Prevent deletion of default slide
    if (slide.isDefault === 1) {
      return res.status(400).json({ error: 'Cannot delete default slide' });
    }

    // Get image path to delete file
    db.get('SELECT imagePath FROM slides WHERE id = ?', [id], (err, slideData) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Delete image file (if not default)
      if (slideData && slideData.imagePath && slideData.imagePath !== 'default') {
        const imagePath = path.join(__dirname, '..', slideData.imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete from database
      db.run('DELETE FROM slides WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Slide deleted successfully' });
      });
    });
  });
});

module.exports = router;
