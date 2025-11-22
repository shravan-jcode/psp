// src/pages/Teacher/SubmissionsList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useGetSubmissionsQuery } from '../../features/teacher/teacherApi';

// --- Shadcn/UI Imports ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, AlertTriangle, FileText, Clock, User, ArrowRight } from 'lucide-react';

const SubmissionsList = () => {
    // Fetch all pending submissions for the logged-in teacher
    const { data, isLoading, error } = useGetSubmissionsQuery();
    const submissions = data?.data || [];

    // Helper function to format submission date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
            
            <h1 className="text-4xl font-extrabold text-slate-800 border-b pb-4 flex items-center">
                <FileText className="h-8 w-8 mr-3 text-slate-600" />
                Pending Practicals ({submissions.length})
            </h1>

            <Card className="shadow-lg border-t-4 border-blue-600">
                <CardHeader>
                    <CardTitle className="text-xl text-blue-600">
                        Overview of Submissions
                    </CardTitle>
                    <CardDescription>
                        List of practicals currently awaiting your review.
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* --- Loading State --- */}
            {isLoading && (
                <div className='flex items-center justify-center p-12'>
                    <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                    <p className='ml-3 text-lg text-slate-600'>Fetching pending practicals...</p>
                </div>
            )}

            {/* --- Error State --- */}
            {error && (
                <div className='flex items-center space-x-3 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 shadow'>
                    <AlertTriangle className='h-6 w-6' />
                    <p className='font-medium'>Error loading data: {error.error || error.data?.message || 'Server error.'}</p>
                </div>
            )}
            
            {/* --- Empty State --- */}
            {!isLoading && !error && submissions.length === 0 && (
                <div className='p-12 text-center text-gray-600 bg-white border border-gray-200 rounded-lg shadow-md'>
                    <p className='text-2xl font-semibold mb-2'>All Clear! ✨</p>
                    <p>You currently have no pending practical submissions to review.</p>
                </div>
            )}

            {/* --- Submissions Grid/List --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((submission) => (
                    <Card 
                        key={submission.practicalId} 
                        className='group hover:shadow-xl transition duration-300 border border-gray-200'
                    >
                        <CardHeader className='pb-3 border-b'>
                            <CardTitle className='text-lg font-bold text-slate-700'>
                                Practical #{submission.practicalNumber}
                            </CardTitle>
                            <CardDescription className='font-medium text-slate-500'>
                                {submission.subject} ({submission.className})
                            </CardDescription>
                        </CardHeader>

                        <CardContent className='pt-4 space-y-3'>
                            {/* Student Info */}
                            <div className='flex items-center text-gray-700 text-sm'>
                                <User className='h-4 w-4 mr-2 text-blue-500' />
                                <span className='font-semibold'>{submission.studentName}</span>
                                <span className='ml-2 text-gray-500'>({submission.studentRollNumber})</span>
                            </div>

                            {/* Submission Time */}
                            <div className='flex items-center text-gray-500 text-sm'>
                                <Clock className='h-4 w-4 mr-2 text-amber-500' />
                                Submitted: {formatDate(submission.submittedOn)}
                            </div>

                            {/* Attempt Count */}
                            <div className='text-xs text-gray-500 pt-2'>
                                Submission Count: <span className='font-bold text-slate-600'>{submission.submissionCount}</span>
                                {submission.submissionCount > 1 && (
                                    <span className='ml-1 text-red-500'>(Re-upload)</span>
                                )}
                            </div>
                            
                            {/* Action Button */}
                            <Button asChild className='w-full mt-4 bg-blue-600 hover:bg-blue-700 transition'>
                                <Link to={`/teacher/check-practical/${submission.practicalId}`}>
                                    Review & Grade
                                    <ArrowRight className='h-4 w-4 ml-2 group-hover:translate-x-1 transition' />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SubmissionsList;