# School Management System

A fully functional school website with separate frontend and backend, featuring admin and user panels.

## Features

### Admin Panel
- Dashboard with statistics
- Student management (CRUD operations)
- Teacher management (CRUD operations)
- Course management (CRUD operations)
- Enrollment management
- Announcement management
- Grade management

### User Panel
- Dashboard with overview
- View enrolled courses
- View grades and assignments
- View announcements
- Profile management

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite database
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React
- React Router
- Axios for API calls
- Modern CSS styling

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults are used):
```env
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Admin Routes (require admin role)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- Similar endpoints for teachers, courses, enrollments, announcements, and grades

### User Routes (require user role)
- `GET /api/user/profile` - Get user profile
- `GET /api/user/courses` - Get enrolled courses
- `GET /api/user/grades` - Get grades
- `GET /api/user/announcements` - Get announcements

## Database

The application uses SQLite database which is automatically created when you first run the backend server. The database file (`database.sqlite`) will be created in the backend directory.

## Project Structure

```
Project/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── user.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── user/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Usage

1. Start the backend server first
2. Start the frontend server
3. Open your browser and navigate to `http://localhost:3000`
4. Login with admin credentials or register a new user
5. Based on your role, you'll be redirected to either admin or user panel

## Notes

- The database is automatically initialized with a default admin user on first run
- All passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- The frontend automatically includes the JWT token in API requests
- Role-based access control is implemented for both frontend and backend

