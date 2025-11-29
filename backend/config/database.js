const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

let db;

const initDatabase = () => {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database');
      createTables();
    }
  });
};

const createTables = () => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    firstName TEXT,
    lastName TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }

    // Students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      studentId TEXT UNIQUE NOT NULL,
      grade TEXT,
      section TEXT,
      parentName TEXT,
      parentEmail TEXT,
      parentPhone TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating students table:', err);
        return;
      }

      // Teachers table
      db.run(`CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        employeeId TEXT UNIQUE NOT NULL,
        department TEXT,
        specialization TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`, (err) => {
        if (err) {
          console.error('Error creating teachers table:', err);
          return;
        }

        // Courses table
        db.run(`CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          courseCode TEXT UNIQUE NOT NULL,
          courseName TEXT NOT NULL,
          description TEXT,
          teacherId INTEGER,
          credits INTEGER DEFAULT 0,
          schedule TEXT,
          FOREIGN KEY (teacherId) REFERENCES teachers(id)
        )`, (err) => {
          if (err) {
            console.error('Error creating courses table:', err);
            return;
          }

          // Enrollments table
          db.run(`CREATE TABLE IF NOT EXISTS enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId INTEGER NOT NULL,
            courseId INTEGER NOT NULL,
            enrollmentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (studentId) REFERENCES students(id),
            FOREIGN KEY (courseId) REFERENCES courses(id),
            UNIQUE(studentId, courseId)
          )`, (err) => {
            if (err) {
              console.error('Error creating enrollments table:', err);
              return;
            }

            // Grades table
            db.run(`CREATE TABLE IF NOT EXISTS grades (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              enrollmentId INTEGER NOT NULL,
              assignment TEXT,
              score REAL,
              maxScore REAL,
              grade TEXT,
              remarks TEXT,
              dateRecorded DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (enrollmentId) REFERENCES enrollments(id)
            )`, (err) => {
              if (err) {
                console.error('Error creating grades table:', err);
                return;
              }

              // Announcements table
              db.run(`CREATE TABLE IF NOT EXISTS announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                authorId INTEGER NOT NULL,
                targetAudience TEXT DEFAULT 'all',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (authorId) REFERENCES users(id)
              )`, (err) => {
                if (err) {
                  console.error('Error creating announcements table:', err);
                  return;
                }

                // Slides table for home page carousel
                db.run(`CREATE TABLE IF NOT EXISTS slides (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  title TEXT,
                  description TEXT,
                  imageUrl TEXT NOT NULL,
                  imagePath TEXT,
                  orderIndex INTEGER DEFAULT 0,
                  isActive INTEGER DEFAULT 1,
                  isDefault INTEGER DEFAULT 0,
                  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )`, (err) => {
                  if (err) {
                    console.error('Error creating slides table:', err);
                    return;
                  }

                  // Create default slide if it doesn't exist
                  db.get('SELECT * FROM slides WHERE isDefault = 1', (err, defaultSlide) => {
                    if (err) {
                      console.error('Error checking default slide:', err);
                    } else if (!defaultSlide) {
                      // Create default slide with placeholder
                      db.run(
                        'INSERT INTO slides (title, description, imageUrl, imagePath, orderIndex, isActive, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        ['Welcome to Our School', 'Quality Education for All', '/api/slides/default-image', 'default', 0, 1, 1],
                        (err) => {
                          if (err) {
                            console.error('Error creating default slide:', err);
                          } else {
                            console.log('Default slide created');
                          }
                        }
                      );
                    }
                  });

                  // Create default admin user after all tables are created
                  db.get('SELECT * FROM users WHERE role = ?', ['admin'], (err, row) => {
                    if (err) {
                      console.error('Error checking admin:', err);
                      return;
                    }
                    if (!row) {
                      const hashedPassword = bcrypt.hashSync('admin123', 10);
                      db.run(
                        'INSERT INTO users (username, email, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)',
                        ['admin', 'admin@school.com', hashedPassword, 'admin', 'Admin', 'User'],
                        function(err) {
                          if (err) {
                            console.error('Error creating admin:', err);
                          } else {
                            console.log('Default admin created: username=admin, password=admin123');
                          }
                        }
                      );
                    } else {
                      console.log('Admin user already exists');
                    }
                  });

                  // Create default teacher user
                  db.get('SELECT * FROM users WHERE username = ?', ['teacher'], (err, row) => {
                    if (err) {
                      console.error('Error checking teacher:', err);
                      return;
                    }
                    if (!row) {
                      const hashedPassword = bcrypt.hashSync('teacher123', 10);
                      db.run(
                        'INSERT INTO users (username, email, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)',
                        ['teacher', 'teacher@school.com', hashedPassword, 'teacher', 'John', 'Teacher'],
                        function(err) {
                          if (err) {
                            console.error('Error creating teacher:', err);
                          } else {
                            console.log('Default teacher created: username=teacher, password=teacher123');
                            const teacherUserId = this.lastID;
                            // Create teacher record
                            db.run(
                              'INSERT INTO teachers (userId, employeeId, department, specialization) VALUES (?, ?, ?, ?)',
                              [teacherUserId, 'T001', 'Mathematics', 'Algebra'],
                              (err) => {
                                if (err) console.error('Error creating teacher record:', err);
                              }
                            );
                          }
                        }
                      );
                    }
                  });

                  // Create default student user
                  db.get('SELECT * FROM users WHERE username = ?', ['student'], (err, row) => {
                    if (err) {
                      console.error('Error checking student:', err);
                      return;
                    }
                    if (!row) {
                      const hashedPassword = bcrypt.hashSync('student123', 10);
                      db.run(
                        'INSERT INTO users (username, email, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)',
                        ['student', 'student@school.com', hashedPassword, 'user', 'Jane', 'Student'],
                        function(err) {
                          if (err) {
                            console.error('Error creating student:', err);
                          } else {
                            console.log('Default student created: username=student, password=student123');
                            const studentUserId = this.lastID;
                            // Create student record
                            db.run(
                              'INSERT INTO students (userId, studentId, grade, section, parentName, parentEmail, parentPhone) VALUES (?, ?, ?, ?, ?, ?, ?)',
                              [studentUserId, 'S001', '10', 'A', 'Parent Name', 'parent@school.com', '123-456-7890'],
                              (err) => {
                                if (err) console.error('Error creating student record:', err);
                              }
                            );
                          }
                        }
                      );
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

const getDb = () => {
  if (!db) {
    initDatabase();
  }
  return db;
};

module.exports = { initDatabase, getDb };

