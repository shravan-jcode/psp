// utils/cookieHandler.js

// Function to generate and set the JWT in an HTTP-Only cookie
export const createHttpOnlyCookie = (res, token) => {
    // Determine if the environment is production
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('jwt', token, {
        // httpOnly prevents client-side JavaScript from accessing the cookie, enhancing security
        httpOnly: true, 
        
        // Secure ensures the cookie is only sent over HTTPS. True in production.
        secure: isProduction, 
        
        // SameSite helps mitigate Cross-Site Request Forgery (CSRF) attacks
        sameSite: 'strict', 

        // Set cookie expiry (30 days, matching the JWT expiry from the controller)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
};

// Note: You must ensure process.env.NODE_ENV is set correctly (e.g., 'development' or 'production') 
// in your main server file or .env configuration.