import express from 'express';
import { 
    signup, 
    login, 
    logout ,
    getMe
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
// We will create the protect middleware next, but it's not strictly needed for auth routes, 
// except maybe to secure the logout endpoint (though the controller handles clearing the cookie).
// import { protect } from '../middlewares/auth.middleware.js'; 

const router = express.Router();

// Public routes for user authentication
router.post('/signup', signup);
router.post('/login', login);

// Logout route (POST is preferred over GET for security best practice)
router.post('/logout', logout); // Can be used by both students and teachers


router.get("/me", protect, getMe);


export default router;