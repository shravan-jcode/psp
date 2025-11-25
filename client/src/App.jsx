import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- Layouts ---
import MainLayout from './layout/MainLayout';
// I've added a simple 'AuthLayout' to wrap login/signup pages cleanly.
import AuthLayout from './layout/AuthLayout'; 
import HeroSection from './pages/HeroSection';
import Features from './pages/Features';
import Footer from './pages/Footer';
import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import CreateClass from './pages/Teacher/CreateClass';
import SubmissionsList from './pages/Teacher/SubmissionsList';
import StudentDashboard from './pages/Student/StudentDashboard';
import JoinClass from './pages/Student/JoinClass';
import EnrolledClass from './pages/Student/EnrolledClass';
import PracticalSubmit from './pages/Student/PracticalSubmit';
import ErrorPage from './pages/ErrorPage';
import CheckPractical from './pages/Teacher/CheckPractical';
import CheckStatus from './pages/Student/CheckStatus';

// --- Public Pages ---


export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            // 1. Home Page Route
            {
                index: true, // This makes it the default child route for '/'
                element: (
                    <>
                        <HeroSection />
                        <Features />
                        <Footer />
                    </>
                ),
            },

            // 2. Authentication Routes
            {
                // Grouping Login and Signup under a simple layout if desired
                element: <AuthLayout />, // Create a simple layout for auth pages
                children: [
                    {
                        path: 'login',
                        element: <Login />,
                    },
                    {
                        path: 'signup',
                        element: <SignupPage />, // Added Signup route
                    },
                ]
            },
            
            // 3. General User Routes (Accessible by both roles)
            {
                path: 'profile',
                element: <ProfilePage />, // View Profile
            },

            // 4. Teacher Protected Routes
            {
                path: 'teacher',
                // You would wrap these routes in a 'TeacherProtectRoute' component
                children: [
                    {
                        path: 'dashboard',
                        element: <TeacherDashboard />,
                    },
                    {
                        path: 'create-class',
                        element: <CreateClass />,
                    },
                    {
                        path: 'submissions',
                        element: <SubmissionsList />, // List of pending practicals
                    },
                    {
                        // Route to check a specific practical
                        path: 'check-practical/:practicalId', 
                        element: <CheckPractical />,
                    },
                ],
            },

            // 5. Student Protected Routes
            {
                path: 'student',
                // You would wrap these routes in a 'StudentProtectRoute' component
                children: [
                    {
                        path: 'dashboard',
                        element: <StudentDashboard />,
                    },
                    {
                        path: 'join-class',
                        element: <JoinClass />,
                    },
                    {
                        path: 'my-classes',
                        element: <EnrolledClass />, // List of classes the student is enrolled in
                    },
                    {
                        path: 'submit/:classId',
                        element: <PracticalSubmit />,
                    },
                    // Optional: A dedicated page for tracking submissions if needed
                    // {
                    //     path: 'tracking',
                    //     element: <SubmissionTracking />,
                    // },
                    {
                        // --- NEW ROUTE ---
                    path: 'check-status', 
                       element: <CheckStatus />, // <--- Added CheckStatus component
                       },
                ],
            },
        ],
    },
]);

const App = () => {
    return <RouterProvider router={appRouter} />;
};

export default App;