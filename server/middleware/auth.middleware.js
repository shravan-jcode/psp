import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

// Middleware to verify JWT and protect routes
const protect = async (req, res, next) => {
    let token;

    // 1. Check for the JWT cookie
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        // If no token is found in the cookie
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }

    try {
        // 2. Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find the user associated with the token ID
        // We select all fields EXCEPT the password.
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found.' });
        }

        // 4. Attach the user object to the request for use in controllers (e.g., req.user._id)
        req.user = user;
        
        // Move to the next middleware or route controller
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
};

// Middleware for Role-Based Access Control (RBAC)
// Usage: restrictTo('Teacher') or restrictTo('Student')
const restrictTo = (role) => {
    return (req, res, next) => {
        // The user object is guaranteed to be on req.user 
        // because this middleware runs *after* the 'protect' middleware.
        if (req.user.role !== role) {
            return res.status(403).json({
                message: `Forbidden: Only ${role}s are allowed to access this route.`
            });
        }
        next();
    };
};


export {
    protect,
    restrictTo
};