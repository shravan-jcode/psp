// routes/student.routes.js

import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import uploadPracticalFile from '../middleware/upload.middleware.js';
import { 
    joinClass, 
    uploadPractical,
    getStudentPracticals, // Import the new function
    getStudentSubjects
} from '../controllers/student.controller.js';

const router = express.Router();

router.use(protect, restrictTo('Student')); 

// POST /api/student/join-class
router.post('/join-class', joinClass); 
// GET /api/student/my-subjects
router.get('/my-subjects', getStudentSubjects);


// POST /api/student/upload-practical/:classId
router.post(
    '/upload-practical/:classId', 
    uploadPracticalFile, 
    uploadPractical
);

// GET /api/student/practicals <-- New Route for Tracking
router.get('/practicals', getStudentPracticals);

export default router;