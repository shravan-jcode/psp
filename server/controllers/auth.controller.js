import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
// We'll create this utility in the next step
import { createHttpOnlyCookie } from '../utils/cookieHandler.js'; 

// Helper function to generate JWT and set cookie
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });

    // Set token in a secure, HTTP-only cookie
    createHttpOnlyCookie(res, token);
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    const { name, email, password, collegeName, role, rollNumber } = req.body;

    // 1. Basic Validation (Mongoose schema handles most of this, but preemptive checks are good)
    if (!name || !email || !password || !collegeName || !role) {
        return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    if (role === 'Student' && !rollNumber) {
        return res.status(400).json({ message: 'Roll number is required for students.' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists.' });
    }

    try {
        // 3. Create the user
        const user = await User.create({
            name,
            email,
            password, // Password hashing happens in the pre-save hook
            collegeName,
            role,
            rollNumber: role === 'Student' ? rollNumber : undefined,
        });

        if (user) {
            // 4. Generate JWT and set cookie
            generateToken(res, user._id);

            // 5. Send successful response
          res.status(201).json({
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
    }
});

        } else {
            res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (error) {
        // Handle Mongoose validation errors or database issues
        res.status(500).json({ 
            message: 'Server error during signup.', 
            error: error.message 
        });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user by email and explicitly select the password field
    const user = await User.findOne({ email }).select('+password'); 

    // 2. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
        // 3. Generate JWT and set cookie
        generateToken(res, user._id);

        // 4. Send successful response (exclude the password field for the response)
       res.json({
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
    }
});

    } else {
        res.status(401).json({ message: 'Invalid email or password.' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
    // Clear the JWT cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiry to the past
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export {
    signup,
    login,
    logout
};