// src/pages/ErrorPage.jsx (Color Scheme Applied)
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

const ErrorPage = () => {
    // You can customize the error based on router context if needed, 
    // but for a general 404/error boundary page, this is robust.

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 **bg-gray-50** text-center">
            
            <div className="max-w-md w-full p-8 rounded-xl shadow-2xl **border-t-8 border-red-500** bg-white">
                
                {/* --- Error Status Icon (Red) --- */}
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 **text-red-500**" />

                {/* --- Main Heading (Slate Primary) --- */}
                <h1 className="text-5xl font-extrabold **text-slate-800** mb-2">
                    404
                </h1>
                
                {/* --- Secondary Heading (Slate Primary) --- */}
                <h2 className="text-2xl font-semibold **text-slate-700** mb-4">
                    Page Not Found
                </h2>

                {/* --- Description (Gray Background/Text) --- */}
                <p className="text-md **text-gray-600** mb-8">
                    Oops! The page you were looking for doesn't exist or an unexpected error occurred.
                </p>

                {/* --- Action Button (Blue Secondary/Accent) --- */}
                <Button asChild 
                    className="w-full sm:w-auto px-6 py-3 text-lg **bg-blue-600 hover:bg-blue-700** transition-colors"
                >
                    {/* Assuming the user should be sent to the main dashboard or home */}
                    <Link to="/" className="flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        Go to Home/Dashboard
                    </Link>
                </Button>
            </div>

        </div>
    );
}

export default ErrorPage;