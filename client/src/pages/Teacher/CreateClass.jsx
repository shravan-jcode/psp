// src/pages/Teacher/CreateClass.jsx
import React, { useState } from 'react';
import { useCreateClassMutation, useGetClassesQuery } from '../../features/teacher/teacherApi';
import { Link } from 'react-router-dom';

// --- Shadcn/UI Imports ---
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

import { Loader2, Copy, AlertTriangle } from 'lucide-react';

const CreateClass = () => {

    const [form, setForm] = useState({
        className: "",
        subject: "",
    });

    const [message, setMessage] = useState(null);

    const [createClass, { isLoading }] = useCreateClassMutation();
    const { data: classes = [], isLoading: fetching, error } = useGetClassesQuery();

    const onChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!form.className || !form.subject) {
            return setMessage({ type: "error", text: "Both Class Name and Subject are required." });
        }

        try {
            const payload = {
                className: form.className,
                subjects: [{ name: form.subject }],
                // Note: If your backend expects 'branch' field, you should add it back to the form state and payload.
            };

            await createClass(payload).unwrap();

            setMessage({ type: "success", text: "🎉 Class created successfully! Share the code with your students." });

            setForm({ className: "", subject: "" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err.data?.message || "Failed to create class. Please try again.",
            });
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setMessage({ type: "success", text: `Copied class code: ${code}` });
        // Optionally clear the message after a short delay
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-12 bg-gray-50 min-h-screen">
            
            <h1 className="text-4xl font-extrabold text-slate-800 border-b pb-4">
                Manage Your Practical Classes
            </h1>
            
            {/* --- 1. Class Creation Form --- */}
            <Card className='shadow-lg border-t-4 border-slate-700'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-2xl text-slate-700'>
                        Create New Class
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    
                    {/* Message Box */}
                    {message && (
                        <div
                            className={`p-3 mb-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                                message.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Class Name */}
                            <div className="space-y-2">
                                <Label htmlFor="className" className='text-gray-700'>Class Name (e.g., TYCS-A)</Label>
                                <Input
                                    id="className"
                                    value={form.className}
                                    onChange={onChange}
                                    placeholder="TYCS / FYIT / CS501"
                                    disabled={isLoading}
                                    className="focus-visible:ring-slate-500"
                                />
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <Label htmlFor="subject" className='text-gray-700'>Subject (e.g., Data Structures)</Label>
                                <Input
                                    id="subject"
                                    value={form.subject}
                                    onChange={onChange}
                                    placeholder="DBMS / Operating Systems"
                                    disabled={isLoading}
                                    className="focus-visible:ring-slate-500"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className='w-full md:w-auto bg-slate-700 hover:bg-slate-800 transition duration-200'
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Creating Class...
                                </>
                            ) : (
                                "Create Class"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* ------------------------------------------------------------------ */}
            
            {/* --- 2. List of Created Classes --- */}
            <h2 className="text-3xl font-semibold text-slate-800 pt-6">
                Your Existing Classes ({classes.length})
            </h2>

            {/* Loading/Error/Empty States */}
            {fetching && (
                <p className="flex items-center justify-center text-gray-500 p-6 bg-white rounded-lg shadow">
                    <Loader2 className="h-5 w-5 animate-spin mr-3 text-slate-500" />
                    Fetching your classes...
                </p>
            )}

            {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 shadow">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">Error: Failed to load classes. {error.data?.message || 'Server connection issue.'}</p>
                </div>
            )}

            {!fetching && classes.length === 0 && !error && (
                <p className='p-6 text-center text-gray-600 bg-white border border-gray-200 rounded-lg shadow'>
                    You haven't created any classes yet. Get started above!
                </p>
            )}

            {/* Class List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.map((cls) => (
                    <Card key={cls._id} className='shadow-md hover:shadow-xl transition duration-300 border border-gray-200'>
                        <CardHeader className='border-b p-4'>
                            <CardTitle className='text-xl text-slate-800 truncate' title={cls.className}>
                                {cls.className}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 p-4">
                            <p className='text-sm text-gray-600 font-medium'>
                                Subject: <span className='text-slate-700 font-semibold'>{cls.subjects[0]?.name || 'N/A'}</span>
                            </p>

                            {/* Code Box */}
                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-lg">
                                <span className="font-mono text-lg font-bold text-slate-700 select-all">
                                    {cls.classCode}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyCode(cls.classCode)}
                                    className='text-slate-500 hover:bg-slate-200'
                                    title='Copy Class Code'
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 transition">
                                <Link to={`/teacher/submissions?classId=${cls._id}`}>
                                    View Submissions
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CreateClass;