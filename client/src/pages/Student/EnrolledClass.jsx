import React from "react";
import { useGetMySubjectsQuery } from "../../features/student/studentApi";
import { Card, CardContent } from "../../components/ui/card";
import { BookOpen } from "lucide-react";

const EnrolledClass = () => {
  const { data, isLoading, error } = useGetMySubjectsQuery();

  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Loading classes...</div>;

  if (error)
    return <div className="p-6 text-center text-red-500">Failed to load classes.</div>;

  const classes = data?.data || [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">My Subjects</h1>

      {classes.length === 0 ? (
        <p className="text-gray-600">You haven't joined any classes yet.</p>
      ) : (
        classes.map((cls) => (
          <Card key={cls.classId} className="mb-6 shadow-md border border-gray-200">
            <CardContent className="p-5">

              <h2 className="text-xl font-semibold text-slate-700 mb-2">
                {cls.className}
              </h2>

              <p className="text-gray-600 mb-3">
                <span className="font-medium">Class Code:</span> {cls.classCode}
              </p>

              <h3 className="font-semibold text-slate-700 mb-2">Subjects</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cls.subjects.map((sub) => (
                  <div
                    key={sub.subjectId}
                    className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg"
                  >
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-800 font-medium">{sub.name}</span>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default EnrolledClass;
