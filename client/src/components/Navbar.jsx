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
import { PlusCircle, UserPlus } from 'lucide-react'; 

// Assuming logo2 path is correct for the environment
import logo2 from '../assets/logo2.png';

const Navbar = () => {
    // Color Scheme Reference:
    // Primary Base: #2B2B2B (Deep Charcoal)
    // Primary Light: #FFFFFF (Pure White)
    // Secondary Dark: #284B63 (Deep Sapphire Blue)
    // Secondary Light: #D4D4D4 (Light Gray)
    // Accent 1: #3C6E71 (Muted Teal)
    
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApi] = useLogoutMutation();

    // Use Secondary Dark for action text
    const actionColor = 'text-[#284B63]'; 
    // Use Primary Base for main text/icons
    const primaryTextColor = 'text-[#2B2B2B]';
    // Use Secondary Light for subtle hover/background
    const subtleBg = 'hover:bg-[#D4D4D4]';
    // Use Accent 1 for primary button hover
    const ctaHoverBg = 'hover:bg-[#3C6E71]';
    // Use Secondary Dark for primary button BG
    const ctaBg = 'bg-[#284B63]';

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
        // Primary Light background for the header
        <header className="sticky top-0 z-50 bg-[#FFFFFF] shadow-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                
                {/* --- Left Side: Logo and App Name --- */}
                <div className="flex items-center space-x-3">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={logo2} alt="LabLink Logo" className="h-8 w-8 object-cover rounded-md" />
                        {/* Primary Base color for app name */}
                        <h1 className={`text-xl font-bold ${primaryTextColor}`}>LabLink</h1>
                    </Link>
                </div>

                {/* --- Right Side: Action Link and Profile Menu --- */}
                <div className="flex items-center space-x-4">
                    
                    {/* 1. Conditional Link: Create Class (Teacher) */}
                    {isAuthenticated && user && user.role === 'Teacher' && (
                        <Link to="/teacher/create-class">
                            {/* Primary Base color for text and hover/subtle background for state */}
                            <Button variant="ghost" className={`hidden sm:inline-flex items-center ${primaryTextColor} ${subtleBg}`}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Class
                            </Button>
                            {/* Button icon for mobile view */}
                            <Button variant="ghost" size="icon" className={`sm:hidden ${primaryTextColor} ${subtleBg}`}>
                                <PlusCircle className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

                    {/* 2. Conditional Link: Join Class (Student) */}
                    {isAuthenticated && user && user.role === 'Student' && (
                        <Link to="/student/join-class">
                            {/* Primary Base color for text and hover/subtle background for state */}
                            <Button variant="ghost" className={`hidden sm:inline-flex items-center ${primaryTextColor} ${subtleBg}`}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Join Class
                            </Button>
                            {/* Button icon for mobile view */}
                            <Button variant="ghost" size="icon" className={`sm:hidden ${primaryTextColor} ${subtleBg}`}>
                                <UserPlus className="h-5 w-5" />
                            </Button>
                        </Link>
                    )}

                    {isAuthenticated && user ? (
                        /* --- Authenticated User Menu --- */
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    {/* Primary Base color for avatar border */}
                                    <Avatar className="h-9 w-9 border-2 border-[#2B2B2B]">
                                        {/* Secondary Dark color for Avatar fallback background */}
                                        <AvatarFallback className="bg-[#284B63] text-white text-sm">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        {/* Primary Base for Name */}
                                        <p className={`text-sm font-medium leading-none ${primaryTextColor}`}>{user.name}</p>
                                        {/* Secondary Dark color for Role text */}
                                        <p className="text-xs leading-none text-[#284B63]">{user.role}</p>
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
                                    // Secondary Dark for the Logout link color, Secondary Light for focus background
                                    className={`cursor-pointer ${actionColor} focus:bg-[#D4D4D4] focus:${actionColor}`}
                                >
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        /* --- Unauthenticated Links --- */
                        <div className="space-x-2">
                            <Link to="/login">
                                {/* Outline Button: Primary Base border and text, Secondary Light hover BG */}
                                <Button 
                                    variant="outline"
                                    className={`border-[#2B2B2B] ${primaryTextColor} ${subtleBg} hover:border-[#284B63]`}
                                >
                                    Log In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                {/* Primary Button (CTA): Secondary Dark BG, Accent 1 Hover BG */}
                                <Button 
                                    className={`${ctaBg} text-white ${ctaHoverBg}`}
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;