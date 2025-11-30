// src/pages/Teacher/CheckPractical.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useCheckPracticalMutation,
  useGetSubmissionByIdQuery,
} from '../../features/teacher/teacherApi';

const CheckPractical = () => {
  const { practicalId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: isFetching } = useGetSubmissionByIdQuery(practicalId);
  const [checkPractical, { isLoading }] = useCheckPracticalMutation();

  const [status, setStatus] = useState('Approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'Rejected' && !rejectionReason.trim()) {
      setMessage('Rejection reason required.');
      return;
    }

    try {
      await checkPractical({
        practicalId,
        data: {
          status,
          rejectionReason:
            status === 'Rejected' ? rejectionReason.trim() : undefined,
        },
      }).unwrap();

      setMessage('Updated successfully ✅');

      setTimeout(() => {
        navigate('/teacher/submissions');
      }, 1000);
    } catch (err) {
      setMessage('Update failed ❌');
    }
  };

  if (isFetching) {
    return (
      <div className="text-center p-10 text-[#2B2B2B]">
        Loading submission...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-10 text-[#2B2B2B]">
        No data found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/teacher/submissions')}
        className="mb-4 text-[#4c7cff] font-medium hover:underline"
      >
        ← Back
      </button>

      {/* Status message */}
      {message && (
        <div className="mb-4 p-3 bg-[#f3f4f6] rounded text-[#111827]">
          {message}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-[#111827]">
        Check Practical Submission
      </h2>

      {/* Student Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-[#2B2B2B]">
        <p><b>Student:</b> {data.studentName} ({data.studentRollNumber})</p>
        <p><b>Class:</b> {data.className}</p>
        <p><b>Subject:</b> {data.subject}</p>
        <p><b>Practical No:</b> {data.practicalNumber}</p>
      </div>

      {/* PDF / DOCX PREVIEW */}
      <div
        className="border border-[#D4D4D4] rounded-lg overflow-hidden mb-6 bg-[#f9fafb]"
        style={{ height: "500px" }}
      >
        {data?.fileUrl ? (
          data.fileUrl.toLowerCase().endsWith('.pdf') ? (
            <embed
              src={data.fileUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          ) : (
            <iframe
              title="Document preview"
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                data.fileUrl
              )}&embedded=true`}
              width="100%"
              height="100%"
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-[#374151]">
            No file preview available
          </div>
        )}
      </div>

      {/* Actions */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Radio */}
        <div className="flex gap-6 text-[#2B2B2B]">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={status === 'Approved'}
              onChange={() => setStatus('Approved')}
            />
            Approved
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={status === 'Rejected'}
              onChange={() => setStatus('Rejected')}
            />
            Rejected
          </label>
        </div>

        {/* Rejection Reason */}
        {status === 'Rejected' && (
          <textarea
            className="w-full border border-[#D4D4D4] p-3 rounded bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4c7cff]"
            placeholder="Enter rejection reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        )}

        {/* Submit Button */}
        <button
          disabled={isLoading}
          className="w-full p-2 rounded text-white bg-[#284B63] hover:bg-[#3C6E71] transition duration-200"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CheckPractical;
