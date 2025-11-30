// src/pages/Teacher/TeacherDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useGetClassesQuery, useGetSubmissionsQuery } from '../../features/teacher/teacherApi';

// --- Shadcn/UI Imports ---
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, AlertTriangle, BookOpen, FileCheck, Users, PlusCircle } from 'lucide-react';

const TeacherDashboard = () => {
    // 1. Fetch Teacher's Classes
    const { 
        data: classes = [], 
        isLoading: classesLoading, 
        error: classesError 
    } = useGetClassesQuery();

    // 2. Fetch Pending Submissions
    const { 
        data: submissionsData, 
        isLoading: submissionsLoading, 
        error: submissionsError 
    } = useGetSubmissionsQuery();
    
    const pendingSubmissionsCount = submissionsData?.data?.length || 0;

    // --- Helper Component for Status Cards ---
    const StatusCard = ({ title, value, icon: Icon, link, linkText, loading, error }) => (
        <Card className={`shadow-lg transition-all duration-300 ${loading ? 'opacity-75' : 'hover:shadow-xl'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                    {title}
                </CardTitle>
                <Icon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                ) : error ? (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                ) : (
                    <div className="text-4xl font-bold text-slate-800">{value}</div>
                )}
                
                {link && (
                    <Button asChild className="mt-4 w-full bg-slate-700 hover:bg-slate-800" size="sm">
                        <Link to={link}>{linkText}</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );

    // --- Prepare Recent Classes (Take up to 3 for quick view) ---
    const recentClasses = classes.slice(0, 3);
    const totalClasses = classes.length;


    return (
        <div className="container mx-auto p-4 md:p-8 space-y-10 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-slate-800 border-b pb-4">
                👋 Teacher Dashboard
            </h1>

            {/* --- 1. Key Metrics Section --- */}
           {/* --- 1. Key Metrics Section --- */}
<div className="grid gap-6 md:grid-cols-4">
    
    <StatusCard
        title="Pending Submissions"
        value={pendingSubmissionsCount}
        icon={FileCheck}
        link="/teacher/submissions"
        linkText="Review Practicals"
        loading={submissionsLoading}
        error={submissionsError}
    />

    <StatusCard
        title="Total Classes"
        value={totalClasses}
        icon={BookOpen}
        link="/teacher/create-class"
        linkText="View Classes"
        loading={classesLoading}
        error={classesError}
    />

    <StatusCard
        title="Create New Class"
        value={<PlusCircle className="h-8 w-8 text-[#4c7cff]" />}
        icon={PlusCircle}
        link="/teacher/create-class"
        linkText="Start"
        loading={false}
        error={false}
    />

    <StatusCard
        title="Approved Practicals"
        value="View"
        icon={FileCheck}
        link="/teacher/all-practicals"
        linkText="Open"
        loading={false}
        error={false}
    />
</div>


            

            {/* --- 2. Recent Classes Section --- */}
            <div className='space-y-6'>
                <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-slate-600" />
                    Your Recent Classes
                </h2>

                {classesLoading && <p className='text-gray-500'>Loading class list...</p>}
                {classesError && <p className='text-red-500'>Error fetching classes.</p>}
                
                {!classesLoading && !classesError && totalClasses === 0 && (
                     <p className='p-4 bg-white border rounded-lg text-gray-600'>You have not created any classes yet.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentClasses.map((cls) => (
                        <Card key={cls._id} className="shadow-md">
                            <CardHeader className="p-4 border-b">
                                <CardTitle className="text-xl text-blue-700 truncate">{cls.className}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <p className="text-sm text-gray-600 font-medium">
                                    Subject: <span className='font-semibold text-slate-700'>{cls.subjects[0]?.name || 'N/A'}</span>
                                </p>
                                <p className="text-sm text-gray-600 font-medium flex items-center">
                                    <Users className="h-4 w-4 mr-1 text-green-500" />
                                    Class Code: <span className='ml-1 font-mono font-bold text-slate-700'>{cls.classCode}</span>
                                </p>
                                <Button asChild variant="outline" className="w-full mt-2">
                                    <Link to={`/teacher/submissions?classId=${cls._id}`}>
                                        Go to Class Submissions
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                
                {totalClasses > 3 && (
                     <div className='text-center pt-4'>
                        <Button variant="link" asChild>
                            <Link to="/teacher/create-class">View all {totalClasses} classes</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;