// middlewares/errorMiddleware.js

// 1. Handles routes that don't exist (404)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the next middleware (errorHandler)
};

// 2. Generic error handler
const errorHandler = (err, req, res, next) => {
    // Check if the status code is a standard success code (like 200), if so, set it to 500 (Internal Server Error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Special case for Mongoose CastError (e.g., bad ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Special case for Mongoose Validation Error (from model schema)
    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad Request
        // Join all validation messages into one string
        message = Object.values(err.errors).map(val => val.message).join('. ');
    }

    res.status(statusCode).json({
        message: message,
        // Only send the stack trace in development mode for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };