// src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        // Full viewport height, centered content
        <div className='flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-gray-50'>
            {/* This container will hold the Login or Signup component.
              It uses a standard Shadcn-like card style for clean presentation.
            */}
            <div className='w-full max-w-md space-y-8 p-8 md:p-10 bg-white shadow-lg rounded-lg border border-gray-200'>
                {/* The Outlet component renders the specific child route 
                  (Login or Signup) defined in your router configuration. 
                */}
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;