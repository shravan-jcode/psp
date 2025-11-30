// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layouts
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';


// Pages
import HeroSection from './pages/HeroSection';
import Features from './pages/Features';
import Footer from './pages/Footer';
import LearnMore from './pages/LearnMore';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

// Teacher
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import CreateClass from './pages/Teacher/CreateClass';
import SubmissionsList from './pages/Teacher/SubmissionsList';
import CheckPractical from './pages/Teacher/CheckPractical';

// Student
import StudentDashboard from './pages/Student/StudentDashboard';
import JoinClass from './pages/Student/JoinClass';
import EnrolledClass from './pages/Student/EnrolledClass';
import PracticalSubmit from './pages/Student/PracticalSubmit';
import CheckStatus from './pages/Student/CheckStatus';

// Protected Routes
import TeacherProtectRoute from "./protected/TeacherProtectRoute";
import StudentProtectRoute from "./protected/StudentProtectRoute";

// Error
import ErrorPage from './pages/ErrorPage';
import AllPracticals from './pages/Teacher/AllPracticals';
import ViewApprovedPractical from './pages/Teacher/ViewApprovedPractical';

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: (
                    <>
                        <HeroSection />
                        <Features />
                        <Footer />
                    </>
                ),
            },

            // Learn More route
            {
                path: "learn-more",
                element: <LearnMore />,
            },

            {
                element: <AuthLayout />,
                children: [
                    { path: 'login', element: <Login /> },
                    { path: 'signup', element: <SignupPage /> },
                ]
            },

            { path: 'profile', element: <ProfilePage /> },

            // Teacher Routes
          {
    path: 'teacher',
    element: <TeacherProtectRoute />,
    children: [
        { path: 'dashboard', element: <TeacherDashboard /> },
        { path: 'create-class', element: <CreateClass /> },
        { path: 'submissions', element: <SubmissionsList /> },
        { path: 'check-practical/:practicalId', element: <CheckPractical /> },
        { path: 'all-practicals', element: <AllPracticals /> },
        { path: 'approved/:practicalId', element: <ViewApprovedPractical /> },
    ],
},


            // Student Routes
            {
                path: 'student',
                element: <StudentProtectRoute />,
                children: [
                    { path: 'dashboard', element: <StudentDashboard /> },
                    { path: 'join-class', element: <JoinClass /> },
                    { path: 'my-classes', element: <EnrolledClass /> },
                { path: 'submit/:classId/:subjectId', element: <PracticalSubmit /> },

                    { path: 'check-status', element: <CheckStatus /> },
                    
                    
                ],
            },
        ]
    }
]);

const App = () => <RouterProvider router={appRouter} />;
export default App;
