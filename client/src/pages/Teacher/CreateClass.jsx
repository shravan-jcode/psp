// src/pages/Teacher/CreateClass.jsx
import React, { useState } from 'react';
import { useCreateClassMutation, useGetClassesQuery } from '../../features/teacher/teacherApi';
import { Link } from 'react-router-dom';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

import { Loader2, Copy, AlertTriangle } from 'lucide-react';

const CreateClass = () => {

    const [form, setForm] = useState({
        className: "",
        subject: "",
    });

    const [message, setMessage] = useState(null);

    const [createClass, { isLoading }] = useCreateClassMutation();
    const { data: classes = [], isLoading: fetching, error } = useGetClassesQuery();

    const onChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!form.className || !form.subject) {
            return setMessage({ type: "error", text: "Both Class Name and Subject are required." });
        }

        try {
            const payload = {
                className: form.className,
                subjects: [{ name: form.subject }],
            };

            await createClass(payload).unwrap();

            setMessage({ type: "success", text: "🎉 Class created successfully! Share the code with your students." });

            setForm({ className: "", subject: "" });
        } catch (err) {
            setMessage({
                type: "error",
                text: err.data?.message || "Failed to create class. Please try again.",
            });
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setMessage({ type: "success", text: `Copied class code: ${code}` });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-12 bg-[#f9fafb] min-h-screen">

            <h1 className="text-4xl font-extrabold text-[#111827] border-b pb-4">
                Manage Your Practical Classes
            </h1>

            {/* --- Class Creation Form --- */}
            <Card className="shadow-lg border-t-4 border-[#284B63] bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl text-[#2B2B2B]">
                        Create New Class
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    {/* Message Box */}
                    {message && (
                        <div
                            className={`p-3 mb-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                                message.type === "success"
                                    ? "bg-[#a6e6ff] text-[#284B63] border border-[#4c7cff]"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Class Name */}
                            <div className="space-y-2">
                                <Label htmlFor="className" className="text-[#374151]">Class Name</Label>
                                <Input
                                    id="className"
                                    value={form.className}
                                    onChange={onChange}
                                    placeholder="TYCS / FYIT / CS501"
                                    disabled={isLoading}
                                    className="focus-visible:ring-[#284B63] border-[#cbd5e1]"
                                />
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <Label htmlFor="subject" className="text-[#374151]">Subject</Label>
                                <Input
                                    id="subject"
                                    value={form.subject}
                                    onChange={onChange}
                                    placeholder="DBMS / Operating Systems"
                                    disabled={isLoading}
                                    className="focus-visible:ring-[#284B63] border-[#cbd5e1]"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto bg-[#284B63] text-white hover:bg-[#3C6E71] transition duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Creating Class...
                                </>
                            ) : (
                                "Create Class"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* --- Existing Classes --- */}
            <h2 className="text-3xl font-semibold text-[#111827] pt-6">
                Your Existing Classes ({classes.length})
            </h2>

            {/* Loading */}
            {fetching && (
                <p className="flex items-center justify-center text-[#374151] p-6 bg-white rounded-lg shadow">
                    <Loader2 className="h-5 w-5 animate-spin mr-3 text-[#284B63]" />
                    Fetching your classes...
                </p>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center space-x-2 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 shadow">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">Failed to load classes. {error.data?.message || 'Server error.'}</p>
                </div>
            )}

            {/* Empty */}
            {!fetching && classes.length === 0 && !error && (
                <p className="p-6 text-center text-[#374151] bg-white border border-[#cbd5e1] rounded-lg shadow">
                    You haven't created any classes yet.
                </p>
            )}

            {/* Class Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.map((cls) => (
                    <Card
                        key={cls._id}
                        className="shadow-md hover:shadow-xl transition duration-300 border border-[#cbd5e1] bg-white"
                    >
                        <CardHeader className="border-b p-4 border-[#cbd5e1]">
                            <CardTitle className="text-xl text-[#111827] truncate">
                                {cls.className}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 p-4">

                            <p className="text-sm text-[#374151] font-medium">
                                Subject: <span className="text-[#2B2B2B] font-semibold">{cls.subjects[0]?.name}</span>
                            </p>

                            {/* Code Box */}
                            <div className="flex items-center justify-between bg-[#f3f4f6] border border-[#cbd5e1] p-3 rounded-lg">
                                <span className="font-mono text-lg font-bold text-[#111827] select-all">
                                    {cls.classCode}
                                </span>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyCode(cls.classCode)}
                                    className="text-[#374151] hover:bg-[#D4D4D4] rounded-md"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>

                            <Button
                                asChild
                                className="w-full bg-[#4c7cff] hover:bg-[#3C6E71] text-white transition"
                            >
                                <Link to={`/teacher/submissions?classId=${cls._id}`}>
                                    View Submissions
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CreateClass;
