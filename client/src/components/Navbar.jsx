// src/components/Navbar.jsx (Updated with Student Logic)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../features/auth/authSlice';
import { useLogoutMutation } from '../features/auth/authApi';

// --- Shadcn/UI Imports ---
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { PlusCircle, UserPlus } from 'lucide-react'; // Added UserPlus for Join Class icon

import logo2 from '../assets/logo2.png';

const Navbar = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApi] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (err) {
            console.error('Logout failed', err);
        }
        dispatch(clearUser());
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                
                {/* --- Left Side: Logo and App Name --- */}
                <div className="flex items-center space-x-3">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={logo2} alt="LabLink Logo" className="h-8 w-8 object-cover" />
                        <h1 className="text-xl font-bold text-slate-700">LabLink</h1>
                    </Link>
                </div>

                {/* --- Right Side: Action Link and Profile Menu --- */}
                <div className="flex items-center space-x-4">
                    
                    {/* 1. Conditional Link: Create Class (Teacher) */}
                    {isAuthenticated && user && user.role === 'Teacher' && (
                        <Link to="/teacher/create-class">
                            <Button variant="ghost" className="hidden sm:inline-flex items-center text-slate-700 hover:bg-slate-50">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Class
                            </Button>
                            {/* Button icon for mobile view */}
                            <Button variant="ghost" size="icon" className="sm:hidden text-slate-700">
                                <PlusCircle className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

                    {/* 2. Conditional Link: Join Class (Student) */}
                    {isAuthenticated && user && user.role === 'Student' && (
                        <Link to="/student/join-class">
                            <Button variant="ghost" className="hidden sm:inline-flex items-center text-slate-700 hover:bg-slate-50">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Join Class
                            </Button>
                            {/* Button icon for mobile view */}
                            <Button variant="ghost" size="icon" className="sm:hidden text-slate-700">
                                <UserPlus className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

                    {isAuthenticated && user ? (
                        /* --- Authenticated User Menu --- */
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9 border-2 border-slate-700">
                                        <AvatarFallback className="bg-slate-700 text-white text-sm">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-gray-500">{user.role}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/profile')}>
                                    View Profile
                                </DropdownMenuItem>

                                {/* Dashboard Link */}
                                {(user.role === 'Teacher' || user.role === 'Student') && (
                                    <DropdownMenuItem onClick={() => navigate(`/${user.role.toLowerCase()}/dashboard`)}>
                                        Dashboard
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                                >
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        /* --- Unauthenticated Links --- */
                        <div className="space-x-2">
                            <Link to="/login">
                                <Button variant="outline">Log In</Button>
                            </Link>
                            <Link to="/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;