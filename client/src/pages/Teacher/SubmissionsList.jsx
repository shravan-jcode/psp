// src/pages/Teacher/SubmissionsList.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetSubmissionsQuery } from '../../features/teacher/teacherApi';

// Shadcn UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, AlertTriangle, FileText, Clock, User, ArrowRight, Filter } from 'lucide-react';

const SubmissionsList = () => {
    const { data, isLoading, error } = useGetSubmissionsQuery();
    const submissions = data?.data || [];

    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedStudentRoll, setSelectedStudentRoll] = useState('all');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const uniqueSubjects = useMemo(() => {
        if (!submissions.length) return [];
        return [...new Set(submissions.map(s => s.subject))];
    }, [submissions]);

    const uniqueStudents = useMemo(() => {
        const studentsMap = new Map();
        submissions.forEach(s => {
            if (!studentsMap.has(s.studentRollNumber)) {
                studentsMap.set(s.studentRollNumber, {
                    name: s.studentName,
                    roll: s.studentRollNumber,
                });
            }
        });
        return Array.from(studentsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [submissions]);

    const filteredSubmissions = useMemo(() => {
        let filtered = submissions;

        if (selectedSubject !== 'all') {
            filtered = filtered.filter(s => s.subject === selectedSubject);
        }

        if (selectedStudentRoll !== 'all') {
            filtered = filtered.filter(s => s.studentRollNumber === selectedStudentRoll);
        }

        return filtered;
    }, [submissions, selectedSubject, selectedStudentRoll]);

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8 bg-[#f9fafb] min-h-screen">

            <h1 className="text-4xl font-extrabold text-[#111827] border-b pb-4 flex items-center">
                <FileText className="h-8 w-8 mr-3 text-[#374151]" />
                Pending Practicals ({filteredSubmissions.length})
            </h1>

            {/* FILTER SECTION */}
            <Card className="shadow-lg border-t-4 border-[#284B63] bg-white">
                <CardHeader>
                    <CardTitle className="text-xl text-[#284B63]">
                        Overview of Submissions
                    </CardTitle>
                    <CardDescription className="text-[#374151]">
                        List of practicals currently awaiting your review.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-center">

                        <Filter className="h-5 w-5 text-[#2B2B2B] hidden md:block" />

                        {/* SUBJECT FILTER */}
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-full md:w-[180px] border-[#CBD5E1] text-[#2B2B2B]">
                                <SelectValue placeholder="Filter by Subject" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="all">All Subjects</SelectItem>
                                {uniqueSubjects.map(subject => (
                                    <SelectItem key={subject} value={subject}>
                                        {subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* STUDENT FILTER */}
                        <Select value={selectedStudentRoll} onValueChange={setSelectedStudentRoll}>
                            <SelectTrigger className="w-full md:w-[250px] border-[#CBD5E1] text-[#2B2B2B]">
                                <SelectValue placeholder="Filter by Student" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="all">All Students</SelectItem>
                                {uniqueStudents.map(student => (
                                    <SelectItem key={student.roll} value={student.roll}>
                                        {student.name} ({student.roll})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* LOADING */}
            {isLoading && (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#284B63]" />
                    <p className="ml-3 text-lg text-[#2B2B2B]">
                        Fetching pending practicals...
                    </p>
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 shadow">
                    <AlertTriangle className="h-6 w-6" />
                    <p className="font-medium">
                        Error loading data: {error.error || error.data?.message || 'Server error.'}
                    </p>
                </div>
            )}

            {/* NO SUBMISSIONS */}
            {!isLoading && submissions.length === 0 && (
                <div className="p-12 text-center bg-white border border-[#CBD5E1] rounded-lg shadow">
                    <p className="text-2xl font-semibold text-[#111827]">All Clear! ✨</p>
                    <p className="text-[#374151]">No pending submissions.</p>
                </div>
            )}

            {/* NO MATCH AFTER FILTER */}
            {!isLoading && submissions.length > 0 && filteredSubmissions.length === 0 && (
                <div className="p-12 text-center bg-white border border-[#CBD5E1] rounded-lg shadow">
                    <p className="text-2xl font-semibold text-[#111827]">No Results Found 🧐</p>
                    <p className="text-[#374151]">Change your filters and try again.</p>
                </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubmissions.map((submission) => (
                    <Card
                        key={submission.practicalId}
                        className="group hover:shadow-xl transition duration-300 border border-[#CBD5E1] bg-white"
                    >
                        <CardHeader className="pb-3 border-b border-[#f3f4f6]">
                            <CardTitle className="text-lg font-bold text-[#2B2B2B]">
                                Practical #{submission.practicalNumber}
                            </CardTitle>

                            <CardDescription className="font-medium text-[#374151]">
                                {submission.subject} ({submission.className})
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center text-[#2B2B2B] text-sm">
                                <User className="h-4 w-4 mr-2 text-[#284B63]" />
                                <span className="font-semibold">{submission.studentName}</span>
                                <span className="ml-2 text-[#374151]">({submission.studentRollNumber})</span>
                            </div>

                            <div className="flex items-center text-[#374151] text-sm">
                                <Clock className="h-4 w-4 mr-2 text-[#3C6E71]" />
                                Submitted: {formatDate(submission.submittedOn)}
                            </div>

                            <div className="text-xs text-[#374151] pt-2">
                                Submission Count:{" "}
                                <span className="font-bold text-[#2B2B2B]">
                                    {submission.submissionCount}
                                </span>

                                {submission.submissionCount > 1 && (
                                    <span className="ml-1 text-red-500">(Re-upload)</span>
                                )}
                            </div>

                            <Button
                                asChild
                                className="w-full mt-4 bg-[#284B63] hover:bg-[#3C6E71] text-white transition"
                            >
                                <Link to={`/teacher/check-practical/${submission.practicalId}`}>
                                    Review & Grade
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SubmissionsList;
