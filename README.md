# JKLU Feedback & Complaint System

A comprehensive feedback and complaint management system for JK Lakshmipat University, built with React, TypeScript, and Node.js.

## 🌐 Live Demo

**Frontend**: [https://himanibohra.github.io/JKLU-Feedback-Complain-System/](https://himanibohra.github.io/JKLU-Feedback-Complain-System/)

## 📋 Features

### For Students/Faculty
- Submit complaints with file attachments
- Track complaint status in real-time
- Add comments and updates to complaints
- Submit event feedback
- View complaint history

### For Department Heads
- View and manage department-specific complaints
- Update complaint status
- Add comments and resolutions
- Upload supporting documents

### For Administrators
- Complete system overview with analytics
- User management (CRUD operations)
- Department management
- System-wide complaint monitoring
- Generate reports and statistics

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **Validation**: Express Validator

## 📁 Project Structure

```
JKLU-Feedback-Complain-System/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
└── Backend/                 # Node.js backend application
    ├── controllers/         # Route controllers
    ├── models/              # MongoDB models
    ├── Routes/              # API routes
    ├── middlewares/         # Custom middlewares
    ├── uploads/             # File upload directory
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Default User Roles

The system supports three user roles:
- **Student/Faculty**: Can submit and track complaints
- **Department Head**: Can manage department-specific complaints
- **Admin**: Full system access and management

## 📦 Deployment

### Frontend (GitHub Pages)

The frontend is automatically deployed to GitHub Pages using GitHub Actions whenever you push to the main branch.

To deploy manually:
```bash
cd Frontend
npm run deploy
```

### Backend

The backend can be deployed to any Node.js hosting service (Heroku, Railway, Render, etc.). Make sure to:
1. Set environment variables
2. Configure MongoDB connection
3. Set up file upload storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Author

**Himani Bohra**
- GitHub: [@himanibohra](https://github.com/himanibohra)

## 🙏 Acknowledgments

- JK Lakshmipat University
- All contributors and testers

---

Made with ❤️ for JKLU Community
