// src/pages/Student/JoinClass.jsx (Color Scheme Applied & Navigation Fixed)
import React, { useState } from 'react';
import { useJoinClassMutation } from '../../features/student/studentApi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// --- Shadcn/UI Imports ---
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

import { Loader2, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

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
        // Background: Neutral/UI (#f3f4f6 or #f9fafb)
        <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[calc(100vh-64px)] bg-[#f3f4f6]">
            {/* Card Background: Primary (#FFFFFF), Shadow: Neutral, Border Top: Secondary (#284B63) */}
            <Card className='w-full max-w-lg shadow-2xl border-t-4 border-[#284B63] bg-white'>
                <CardHeader className='text-center space-y-2'>
                    {/* Primary Brand/Action Icon: Secondary (#284B63) */}
                    <Zap className='h-10 w-10 mx-auto text-[#284B63]' />
                    {/* Card Title: Primary Text (#2B2B2B) */}
                    <CardTitle className='text-3xl font-bold text-[#2B2B2B]'>
                        Join a New Class
                    </CardTitle>
                    {/* Card Description: Neutral/UI Subtle Shading (#374151 or #111827 for contrast) */}
                    <CardDescription className='text-[#374151]'>
                        Enter the unique code provided by your teacher to enroll instantly.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    
                    {/* --- Message Box --- */}
                    {message && (
                        <div
                            className={`p-4 mb-6 rounded-lg font-medium text-sm transition-all duration-300 flex items-start space-x-2 ${
                                message.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200" // Standard Green for Success
                                    : "bg-red-50 text-red-700 border border-red-200" // Standard Red for Error
                            }`}
                        >
                            {message.type === "success" ? (
                                // Standard Green Icon for Success
                                <CheckCircle className='h-5 w-5 flex-shrink-0 mt-0.5 text-green-500' />
                            ) : (
                                // Standard Red Icon for Error
                                <AlertTriangle className='h-5 w-5 flex-shrink-0 mt-0.5 text-red-500' />
                            )}
                            <p>{message.text}</p>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            {/* Label: Primary Text (#2B2B2B) */}
                            <Label htmlFor="classCode" className='text-[#2B2B2B]'>Class Code</Label>
                            <Input
                                id="classCode"
                                value={classCode}
                                onChange={onChange}
                                placeholder="E.g., B4X9YZ"
                                disabled={isLoading}
                                // Input Border: Neutral/UI (#cbd5e1), Focus Ring: Secondary (#284B63)
                                className="text-xl tracking-wider text-center p-6 border-2 border-[#cbd5e1] focus-visible:ring-[#284B63]"
                                maxLength={8} 
                                autoFocus
                            />
                            {/* Hint Text: Neutral/UI Subtle Shading (#374151) */}
                            <p className="text-xs text-[#374151] text-right">Codes are typically 6-8 characters long and case-insensitive.</p>
                        </div>

                        {/* Primary Action Button: Secondary (#284B63), Hover: Accent (#3C6E71) */}
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className='w-full bg-[#284B63] hover:bg-[#3C6E71] transition duration-200 text-lg text-white'
                        >
                            {isLoading ? (
                                <>
                                    {/* Loader Icon inherits button color (Secondary/Accent) */}
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Enrolling...
                                </>
                            ) : (
                                "Join Class"
                            )}
                        </Button>
                        
                        <div className="pt-4 border-t border-[#cbd5e1] text-center">
                            {/* Internal Link: Primary Text (#2B2B2B), Hover: Secondary Dark (#111827 or similar dark text) */}
                            <Button asChild variant="link" className='text-[#2B2B2B] hover:text-[#111827]'>
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