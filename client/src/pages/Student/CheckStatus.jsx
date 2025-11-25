// pages/Student/CheckStatus.jsx

import React, { useState } from "react";
import { useGetPracticalsQuery } from "../../features/student/studentApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FileText, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const CheckStatus = () => {
  // State for subject filter
  const [selectedSubject, setSelectedSubject] = useState("All");

  // Fetch all practical submissions for the student
  const { data, isLoading, error } = useGetPracticalsQuery();

  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Loading submission status...</div>;

  if (error)
    return <div className="p-6 text-center text-red-500">Failed to load practical submissions.</div>;

  const allPracticals = data?.data || [];

  // Get unique subjects for the filter dropdown
  const uniqueSubjects = [
    "All",
    ...new Set(allPracticals.map((p) => p.subject)),
  ];

  // Apply the filter
  const filteredPracticals = allPracticals.filter((p) =>
    selectedSubject === "All" ? true : p.subject === selectedSubject
  );

  // Helper function to render status pill
  const getStatusPill = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <FileText className="w-8 h-8 text-blue-600" /> Practical Submission Status
      </h1>
      
      {/* Subject Filter */}
      <div className="mb-6 flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
        <label htmlFor="subject-filter" className="font-medium text-gray-700 flex items-center gap-2">
          <Search className="w-5 h-5" /> Filter by Subject:
        </label>
        <Select
          value={selectedSubject}
          onValueChange={setSelectedSubject}
          id="subject-filter"
        >
          <SelectTrigger className="w-[180px] bg-white border-gray-300">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {uniqueSubjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredPracticals.length === 0 ? (
          <p className="text-center text-gray-600 p-10 bg-white rounded-lg shadow-inner">
            {selectedSubject === "All"
              ? "You have not submitted any practicals yet."
              : `No practicals found for the subject: ${selectedSubject}.`}
          </p>
        ) : (
          filteredPracticals.map((p) => (
            <Card key={p.practicalId} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-blue-600">
                  {p.subject} - Practical #{p.practicalNumber}
                </CardTitle>
                {getStatusPill(p.status)}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Class:</span> {p.class} ({p.classCode})
                  </p>
                  <p>
                    <span className="font-medium">Submitted On:</span> {new Date(p.submittedOn).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Assigned Teacher:</span> {p.teacherAssigned}
                  </p>
                  <p>
                    <a
                      href={p.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 underline transition-colors"
                    >
                      View Submission File
                    </a>
                  </p>
                </div>
                {p.status === "Rejected" && p.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                    <p className="font-medium text-red-700">Rejection Reason:</p>
                    <p className="text-sm text-red-600">{p.rejectionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CheckStatus;