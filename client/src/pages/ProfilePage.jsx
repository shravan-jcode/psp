// src/pages/ProfilePage.jsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation, useGetMeQuery } from "../features/auth/authApi";
import { setUser, clearUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

// Shadcn UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Load user from backend
    const { data, isLoading: isUserLoading, error } = useGetMeQuery();

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

    // Sync /me → Redux state
    useEffect(() => {
        if (data?.user) {
            dispatch(setUser(data.user));
        }
    }, [data, dispatch]);

    // If unauthorized, clear user
    useEffect(() => {
        if (error) {
            dispatch(clearUser());
        }
    }, [error, dispatch]);

    // Logout
    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(clearUser());
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    // Loading state
    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-lg">
                Loading profile...
            </div>
        );
    }

    // Not logged in
    if (!isAuthenticated || !user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Card className="w-[400px] shadow-lg">
                    <CardHeader>
                        <CardTitle>Unauthorized</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>You need to log in to view this page.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => navigate("/login")}>Go to Login</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Avatar initials
    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex justify-center items-start min-h-screen p-6 bg-gray-100">
            <Card className="w-full max-w-4xl shadow-xl border rounded-xl">
                
                {/* Header */}
                <CardHeader className="flex flex-col md:flex-row justify-between items-center bg-gray-50 border-b p-6">
                    <div className="flex items-center gap-6">
                        
                        {/* Avatar */}
                        <Avatar className="h-24 w-24 border-4 border-blue-600 shadow">
                            <AvatarFallback className="bg-blue-500 text-white text-3xl">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        {/* User Info */}
                        <div>
                            <CardTitle className="text-3xl font-bold">
                                {user.name}
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                {user.email}
                            </CardDescription>

                            <Badge
                                className={`mt-2 px-4 py-1 text-sm ${
                                    user.role === "Student"
                                        ? "bg-blue-200 text-blue-800"
                                        : "bg-green-600 text-white"
                                }`}
                            >
                                {user.role}
                            </Badge>
                        </div>
                    </div>

                    {/* Logout */}
                    <Button
                        onClick={handleLogout}
                        disabled={isLogoutLoading}
                        className="bg-blue-600 text-white hover:bg-blue-700 mt-4 md:mt-0"
                    >
                        {isLogoutLoading ? "Logging out..." : "Logout"}
                    </Button>
                </CardHeader>

                {/* Body */}
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">

                    {/* Left – Account Info */}
                    <div className="space-y-4">
                        <h3 classname="text-xl font-semibold border-l-4 border-blue-500 pl-3">
                            Account Details
                        </h3>

                        <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
                            <p><strong>College:</strong> {user.collegeName}</p>

                            {user.role === "Student" && user.rollNumber && (
                                <p><strong>Roll Number:</strong> {user.rollNumber}</p>
                            )}

                            <p><strong>User ID:</strong> {user._id}</p>
                        </div>

                        <Button variant="outline" className="w-full">
                            Edit Profile
                        </Button>
                    </div>

                    {/* Right – Classes/Courses */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-xl font-semibold border-l-4 border-blue-500 pl-3">
                            {user.role === "Student" ? "My Classes" : "My Courses"}
                        </h3>

                        <Card className="border shadow">
                            <CardContent className="p-4">

                                {/* If you later connect real classes, map them here */}
                                <p className="text-gray-600 text-center py-6">
                                    No classes assigned yet.
                                </p>

                                <Separator className="my-4" />
                                <div className="text-center">
                                    <Button variant="link">
                                        View All
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>

                <CardFooter className="bg-gray-50 p-4 text-xs text-gray-600 border-t">
                    Profile data is managed by the system administrator.
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProfilePage;
