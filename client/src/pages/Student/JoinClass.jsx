// src/pages/Student/JoinClass.jsx (Color Scheme Applied & Navigation Fixed)
import React, { useState } from 'react';
import { useJoinClassMutation } from '../../features/student/studentApi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// --- Shadcn/UI Imports ---
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

import { Loader2, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const JoinClass = () => {
    const [classCode, setClassCode] = useState('');
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
    const navigate = useNavigate(); // Initialize useNavigate

    const [joinClass, { isLoading }] = useJoinClassMutation();

    const onChange = (e) => {
        // Convert to uppercase on input for convenience and consistency with backend logic
        setClassCode(e.target.value.toUpperCase());
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!classCode) {
            return setMessage({ type: "error", text: "Please enter a class code." });
        }

        try {
            const result = await joinClass(classCode).unwrap();
            
            // Set success message briefly (optional, could skip this and navigate immediately)
            setMessage({ 
                type: "success", 
                text: `✅ Success! Redirecting you to My Classes...` 
            });

            setClassCode(''); // Clear input on success
            
            // --- FIX APPLIED HERE ---
            // Navigate to the 'my-classes' route after successful join
            setTimeout(() => {
                navigate('/student/my-classes');
            }, 1000); // Wait 1 second before navigating to show the success message

        } catch (err) {
            // Handle error response from RTK Query / backend
            const errorText = err.data?.message || "Failed to join class. Please check the code and try again.";
            setMessage({
                type: "error",
                text: errorText,
            });
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[calc(100vh-64px)] **bg-gray-50**">
            <Card className='w-full max-w-lg shadow-2xl border-t-4 **border-blue-600**'>
                <CardHeader className='text-center space-y-2'>
                    {/* Primary Brand/Action Icon - Consistent with Blue Accent */}
                    <Zap className='h-10 w-10 mx-auto **text-blue-600**' />
                    <CardTitle className='text-3xl font-bold **text-slate-700**'>
                        Join a New Class
                    </CardTitle>
                    {/* Secondary Text for Description (Generic text/subtle shading) */}
                    <CardDescription className='**text-gray-500**'>
                        Enter the unique code provided by your teacher to enroll instantly.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    
                    {/* --- Message Box (Uses Success (Green) / Error (Red) Colors) --- */}
                    {message && (
                        <div
                            className={`p-4 mb-6 rounded-lg font-medium text-sm transition-all duration-300 flex items-start space-x-2 ${
                                message.type === "success"
                                    ? "**bg-green-50 text-green-700 border border-green-200**" // Using Green for Success Status
                                    : "**bg-red-50 text-red-700 border border-red-200**" // Using Red for Error Status
                            }`}
                        >
                            {message.type === "success" ? (
                                // Green Icon for Success
                                <CheckCircle className='h-5 w-5 flex-shrink-0 mt-0.5 **text-green-500**' />
                            ) : (
                                // Red Icon for Error
                                <AlertTriangle className='h-5 w-5 flex-shrink-0 mt-0.5 **text-red-500**' />
                            )}
                            <p>{message.text}</p>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            {/* Secondary Text for Label (Generic text) */}
                            <Label htmlFor="classCode" className='**text-gray-700**'>Class Code</Label>
                            <Input
                                id="classCode"
                                value={classCode}
                                onChange={onChange}
                                placeholder="E.g., B4X9YZ"
                                disabled={isLoading}
                                // Input border and focus ring use Gray (Border) and Blue (Accent)
                                className="text-xl tracking-wider text-center p-6 border-2 **border-gray-300** focus-visible:ring-**blue-600**"
                                maxLength={8} 
                                autoFocus
                            />
                            {/* Secondary Text for hint (Subtle shading) */}
                            <p className="text-xs **text-gray-500** text-right">Codes are typically 6-8 characters long and case-insensitive.</p>
                        </div>

                        {/* Primary Action Button (Blue Secondary/Accent) */}
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className='w-full **bg-blue-600 hover:bg-blue-700** transition duration-200 text-lg'
                        >
                            {isLoading ? (
                                <>
                                    {/* Loader Icon inherits button color, which is Blue/Accent */}
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Enrolling...
                                </>
                            ) : (
                                "Join Class"
                            )}
                        </Button>
                        
                        <div className="pt-4 **border-t** text-center">
                            {/* Primary Brand Color for Internal Link (Primary Text) */}
                            <Button asChild variant="link" className='**text-slate-700 hover:text-slate-900**'>
                                <Link to="/student/dashboard">Go to Dashboard</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default JoinClass;