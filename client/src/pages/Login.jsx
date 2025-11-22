// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApi';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Card, CardContent, CardDescription, CardHeader,
    CardTitle, CardFooter
} from '../components/ui/card';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const [login, { isLoading, error }] = useLoginMutation();

    useEffect(() => {
        if (user) {
            const path = user.role === 'Teacher' ? '/teacher/dashboard' : '/student/dashboard';
            navigate(path);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            setLocalError(error.data?.message || 'Login failed.');
        }
    }, [error]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!email || !password)
            return setLocalError('Email and password required.');

        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setUser(res.user));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card className="w-full border-none shadow-none">
            <CardHeader className="p-0 mb-6">
                <CardTitle className="text-3xl text-center text-slate-700 font-bold">
                    Welcome Back to LabLink
                </CardTitle>
                <CardDescription className="text-center text-gray-500">
                    Enter your credentials.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <form onSubmit={submitHandler} className="space-y-6">
                    {localError && (
                        <div className="text-sm text-red-700 bg-red-100 p-3 rounded-md border border-red-200">
                            {localError}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <Button className="w-full bg-slate-700 hover:bg-slate-800" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="text-sm p-0 pt-6 flex justify-center text-gray-600">
                Don't have an account?
                <Link to="/signup" className="ml-1 text-slate-700 hover:underline">
                    Sign Up
                </Link>
            </CardFooter>
        </Card>
    );
};

export default Login;
