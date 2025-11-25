// src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import { useSignupMutation } from '../features/auth/authApi';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Card, CardContent, CardDescription, CardHeader,
    CardTitle, CardFooter
} from '../components/ui/card';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from '../components/ui/select';
import { Loader2 } from 'lucide-react';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        collegeName: '',
        role: 'Student',
        rollNumber: '',
    });

    const [localError, setLocalError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const [signup, { isLoading, error }] = useSignupMutation();

    useEffect(() => {
        if (user) {
            const dashboard = user.role === 'Teacher' ? '/teacher/dashboard' : '/student/dashboard';
            navigate(dashboard);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            setLocalError(error.data?.message || 'Registration failed.');
        }
    }, [error]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            role: value,
            rollNumber: value === 'Teacher' ? '' : prev.rollNumber,
        }));
    };

    const validateForm = () => {
        const { name, email, password, collegeName, role, rollNumber } = formData;

        if (!name || !email || !password || !collegeName) return 'All fields required.';
        if (password.length < 6) return 'Password must be 6+ chars.';
        if (role === 'Student' && !rollNumber) return 'Roll number required.';

        return null;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLocalError('');

        const msg = validateForm();
        if (msg) return setLocalError(msg);

        try {
            const apiData = {
                ...formData,
                rollNumber: formData.role === 'Student' ? formData.rollNumber : undefined,
            };

            const res = await signup(apiData).unwrap();
            dispatch(setUser(res.user));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card className="w-full border-none shadow-none">
            <CardHeader className="p-0 mb-6">
                <CardTitle className="text-3xl font-bold text-center text-slate-700">
                    Create Your LabLink Account
                </CardTitle>
                <CardDescription className="text-center text-gray-500">
                    Join your college's practical submission system.
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <form onSubmit={submitHandler} className="space-y-5">
                    {localError && (
                        <div className="text-sm text-red-700 bg-red-100 p-3 rounded-md border border-red-200">
                            {localError}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" type="text" value={formData.name}
                            onChange={handleChange} disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={formData.email}
                            onChange={handleChange} disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={formData.password}
                            onChange={handleChange} disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="collegeName">College Name</Label>
                        <Input id="collegeName" type="text" value={formData.collegeName}
                            onChange={handleChange} disabled={isLoading} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Your Role</Label>
                            <Select value={formData.role} onValueChange={handleRoleChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Student">Student</SelectItem>
                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.role === 'Student' && (
                            <div className="space-y-2">
                                <Label htmlFor="rollNumber">Roll Number</Label>
                                <Input id="rollNumber" type="text"
                                    value={formData.rollNumber} onChange={handleChange} />
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign Up'}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="p-0 pt-6 text-sm flex justify-center text-gray-600">
                Already have an account?
                <Link to="/login" className="ml-1 text-slate-700 font-medium hover:underline">
                    Log In
                </Link>
            </CardFooter>
        </Card>
    );
};

export default SignupPage;
