import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetSubmissionByIdQuery } from '../../features/teacher/teacherApi';

const ViewApprovedPractical = () => {
  const { practicalId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSubmissionByIdQuery(practicalId);

  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!data) {
    return <div className="text-center p-10">No data found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">

      <button
        onClick={() => navigate('/teacher/all-practicals')}
        className="mb-4 text-blue-500 font-medium hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Approved Practical
      </h2>

      {/* Student details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-gray-700">
        <p><b>Student Name:</b> {data.studentName}</p>
        <p><b>Roll Number:</b> {data.studentRollNumber}</p>
        <p><b>Class:</b> {data.className}</p>
        <p><b>Subject:</b> {data.subject}</p>
        <p><b>Practical No:</b> {data.practicalNumber}</p>
      </div>

      {/* Inline Preview */}
      <div
        className="border rounded-lg overflow-hidden bg-gray-100 mb-6"
        style={{ height: "500px" }}
      >
        {data.fileUrl.toLowerCase().endsWith(".pdf") ? (
          <embed
            src={data.fileUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        ) : (
          <iframe
            title="Document Viewer"
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              data.fileUrl
            )}&embedded=true`}
            width="100%"
            height="100%"
          />
        )}
      </div>
    </div>
  );
};

export default ViewApprovedPractical;
