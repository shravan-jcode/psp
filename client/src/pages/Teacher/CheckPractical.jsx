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
    return <div className="text-center p-10">Loading submission...</div>;
  }

  if (!data) {
    return <div className="text-center p-10">No data found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <button
        onClick={() => navigate('/teacher/submissions')}
        className="mb-4 text-blue-600"
      >
        ← Back
      </button>

      {message && (
        <div className="mb-4 p-3 bg-gray-100 rounded">{message}</div>
      )}

      <h2 className="text-2xl font-bold mb-4">
        Check Practical Submission
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <p><b>Student:</b> {data.studentName} ({data.studentRollNumber})</p>
        <p><b>Class:</b> {data.className}</p>
        <p><b>Subject:</b> {data.subject}</p>
        <p><b>Practical No:</b> {data.practicalNumber}</p>
      </div>

      {/* ✅ FIXED PDF PREVIEW */}

<div
  className="border rounded-lg overflow-hidden mb-6"
  style={{ height: "500px" }}
>
  {data?.fileUrl ? (
    // If it's a PDF show embed; otherwise use Google Docs viewer for doc/docx fallback
    data.fileUrl.toLowerCase().endsWith('.pdf') ? (
      <embed
        src={data.fileUrl}
        type="application/pdf"
        width="100%"
        height="100%"
      />
    ) : (
      // Google Docs viewer works for doc/docx — recommended fallback
      <iframe
        title="Document preview"
        src={`https://docs.google.com/gview?url=${encodeURIComponent(data.fileUrl)}&embedded=true`}
        width="100%"
        height="100%"
      />
    )
  ) : (
    <div className="flex items-center justify-center h-full">
      No file preview available
    </div>
  )}
</div>



      {/* Actions */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              checked={status === 'Approved'}
              onChange={() => setStatus('Approved')}
            />
            Approved
          </label>

          <label>
            <input
              type="radio"
              checked={status === 'Rejected'}
              onChange={() => setStatus('Rejected')}
            />
            Rejected
          </label>
        </div>

        {status === 'Rejected' && (
          <textarea
            className="w-full border p-3 rounded"
            placeholder="Enter rejection reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        )}

        <button
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CheckPractical;
