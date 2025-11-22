import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// --- Configuration & Utilities ---
import connectDB from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';

// --- Middleware ---
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// --- Routes ---
import authRoutes from './routes/auth.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import studentRoutes from './routes/student.routes.js';
// Note: We used teacherRoutes for practical review, so we might not need a separate practicalRoutes.js 
// If you wanted a dedicated file for general user/profile routes, you'd add userRoutes here.


// Load environment variables from .env
dotenv.config();

// Connect to database
connectDB(); 

// Configure Cloudinary (must happen after dotenv config)
configureCloudinary();

const app = express();
const PORT = process.env.PORT || 5000;
 const corsOptions = {
        origin: 'http://localhost:5173', // Replace with your frontend URL later
        credentials: true, // Allow cookies to be sent
    };
    app.use(cors(corsOptions));


// ------------------ Middleware Setup ------------------

// 1. Body parser middleware (allows us to accept JSON data in the body)
app.use(express.json()); 
// 2. Allows us to accept form-data (needed for practical number/subject ID during file upload)
app.use(express.urlencoded({ extended: true })); 
// 3. Cookie parser middleware (allows us to access cookies like the JWT)
app.use(cookieParser());


// ------------------ API Routes ------------------

// Test route
app.get('/', (req, res) => res.send('Practical Submission Portal API is running!'));

// 1. Authentication routes (Signup, Login, Logout)
app.use('/api/auth', authRoutes);

// 2. Teacher routes (Class Creation, Practical Checking/Management)
app.use('/api/teacher', teacherRoutes);

// 3. Student routes (Join Class, Practical Submission, Tracking)
app.use('/api/student', studentRoutes);


// ------------------ Error Handling Middleware ------------------

// 1. Catch 404 (Not Found) errors for unhandled routes
app.use(notFound);
// 2. General error handler (must be the last middleware)
app.use(errorHandler);


// Start the server
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));