# Task Management System

A comprehensive task management system built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, task management, priority boards, and admin functionality.

## Features

### Core Requirements ✅
- **Task Creation**: Form with title, description, due date, and priority (Low, Medium, High)
- **Task List**: Pagination with Ajax, filtering by status and priority
- **Task Details**: Separate page showing full task information
- **Task Editing**: Edit all task fields with form validation
- **Task Deletion**: Delete with confirmation dialog
- **Status Updates**: Mark tasks as "Pending" or "Completed"

### User Authentication & Management ✅
- **Login/Register/Logout**: JWT-based authentication
- **Role-based Access**: Users and Admin roles
- **User Management**: Admin can add/remove users and assign tasks
- **Task Assignment**: Users can only view their assigned tasks

### Priority Management ✅
- **Priority Lists**: Low (Green), Medium (Yellow), High (Red)
- **Visual Representation**: Color-coded priority boards
- **Board View**: Drag-and-drop style priority management
- **List View**: Traditional task list with filters

### Additional Features ✅
- **Responsive Design**: Mobile-friendly interface with TailwindCSS
- **Real-time Updates**: Ajax-based operations without page reloads
- **Admin Panel**: Complete user and task management
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **TailwindCSS** for styling
- **Axios** for API calls
- **Heroicons** for icons
- **Context API** for state management

## Project Structure

```
Magnet_Brains_MernStack_Task/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PriorityBoard.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskDetails.tsx
│   │   │   ├── TaskFilters.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  dueDate: Date,
  status: String (enum: ['Pending', 'Completed']),
  priority: String (enum: ['Low', 'Medium', 'High']),
  assignedUser: ObjectId (ref: 'User'),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Tasks
- `GET /api/tasks` - Get tasks with pagination and filters
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `GET /api/tasks/priority/:priority` - Get tasks by priority

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. **Set up MongoDB Atlas** (Recommended):
   - Follow the detailed guide in `MONGODB_SETUP.md`
   - Create a free MongoDB Atlas account
   - Get your connection string
   - Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

4. **Or use Local MongoDB** (Alternative):
   - Install MongoDB locally
   - Create a `.env` file with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

5. Start the backend server:
```bash
npm start
# or for development with nodemon
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

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Getting Started

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Tasks**: Click "New Task" to create tasks with title, description, due date, and priority
3. **View Tasks**: Switch between List View and Board View to manage tasks
4. **Filter Tasks**: Use filters to find specific tasks by status or priority
5. **Update Status**: Mark tasks as completed or pending
6. **Admin Functions**: Admin users can manage all users and tasks

### User Roles

- **Regular User**: Can create, view, edit, and delete their own tasks
- **Admin**: Can manage all users and tasks, assign tasks to any user

### Priority System

- **Low Priority**: Green color coding
- **Medium Priority**: Yellow color coding  
- **High Priority**: Red color coding

## Features in Detail

### Task Management
- Create tasks with full details
- Edit existing tasks
- Delete tasks with confirmation
- Update task status (Pending/Completed)
- Filter by status and priority
- Pagination for large task lists

### User Interface
- Responsive design works on all devices
- Clean, modern interface with TailwindCSS
- Intuitive navigation and user experience
- Real-time updates without page reloads

### Security
- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: Make sure to change the JWT secret and MongoDB connection string in production environments for security.
