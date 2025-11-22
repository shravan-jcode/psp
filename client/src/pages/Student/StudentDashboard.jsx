import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Zap, Users, ListChecks, CheckSquare } from "lucide-react";

import { useSelector } from "react-redux";
import { useGetMySubjectsQuery } from "../../features/student/studentApi";

const StudentDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    // Fetch subjects & class list
    const { data, isLoading } = useGetMySubjectsQuery();

    const classes = data?.data || [];     // array of classes
    const classCount = classes.length;

    // Count total subjects across all classes
    let totalSubjects = 0;
    classes.forEach((cls) => {
        totalSubjects += cls.subjects.length;
    });

    const DashboardCard = ({ icon, title, description, linkTo, actionText }) => (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-slate-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-slate-800 mb-2">{description}</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                    <Link to={linkTo}>{actionText}</Link>
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] p-6 md:p-10 bg-gray-50">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
                    👋 Welcome back, {user?.name}!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Your hub for classes and practical submissions.
                </p>

                {/* === Loading State === */}
                {isLoading ? (
                    <p className="text-gray-600 text-lg">Loading dashboard…</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-3">

                        <DashboardCard
                            title="New Enrollment"
                            description="Join a New Class"
                            linkTo="/student/join-class"
                            actionText="Enter Code"
                            icon={<Zap className="h-6 w-6 text-blue-600" />}
                        />

                        <DashboardCard
                            title="Active Subjects"
                            description={`${totalSubjects} Subjects`}
                            linkTo="/student/my-classes"
                            actionText="View Subjects"
                            icon={<Users className="h-6 w-6 text-slate-500" />}
                        />

                        <DashboardCard
                            title="Pending Practicals"
                            description="Check Status"
                            linkTo="/student/dashboard/submissions"
                            actionText="View Submissions"
                            icon={<ListChecks className="h-6 w-6 text-amber-500" />}
                        />
                    </div>
                )}

                <hr className="my-10 border-gray-200" />

                <section>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Quick Links</h2>

                    <div className="space-y-4">
                        <Link
                            to="/student/my-classes"
                            className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-slate-700">
                                View Your Enrolled Subjects and Practicals
                            </span>
                        </Link>

                        <Link
                            to="/profile"
                            className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Users className="h-5 w-5 text-slate-500" />
                            <span className="font-medium text-slate-700">Manage Your Profile Settings</span>
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default StudentDashboard;
