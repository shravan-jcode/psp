// src/pages/Student/PracticalSubmit.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetMySubjectsQuery, useUploadPracticalMutation } from '../../features/student/studentApi';

const PracticalSubmit = () => {
  const { classId } = useParams();
  const { data, isLoading, error } = useGetMySubjectsQuery();
  const [uploadPractical, { isLoading: uploading }] = useUploadPracticalMutation();

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [practicalNumber, setPracticalNumber] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [submittedFileUrl, setSubmittedFileUrl] = useState('');

  useEffect(() => {
    if (data?.data && classId) {
      const cls = data.data.find(c => String(c.classId || c.classId) === String(classId) || String(c.classId) === String(classId));
      setSelectedClass(cls || null);
    }
  }, [data, classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !practicalNumber || !file) {
      setMessage('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('subjectId', selectedSubject);
    formData.append('practicalNumber', practicalNumber);
    formData.append('practicalFile', file); // must match multer .single('practicalFile')

    try {
      const res = await uploadPractical({ classId, formData }).unwrap();
      setMessage(res.message || 'Practical submitted successfully!');
      setPracticalNumber('');
      setFile(null);
      setSelectedSubject('');
      setSubmittedFileUrl(res.submission?.fileUrl || res.submission?.fileUrl || '');
    } catch (err) {
      setMessage(err?.data?.message || err?.message || 'Submission failed.');
    }
  };

  if (isLoading) return <p className="p-6 text-center">Loading class data...</p>;
  if (error || !selectedClass) return <p className="p-6 text-center text-red-500">Class data unavailable.</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h1 className="text-2xl font-bold mb-4">{selectedClass.className} - Submit Practical</h1>

      {message && <p className="mb-4 text-center text-sm text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Choose Subject --</option>
            {selectedClass.subjects.map(sub => (
              <option key={sub.subjectId} value={sub.subjectId}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Practical Number</label>
          <input
            type="text"
            value={practicalNumber}
            onChange={(e) => setPracticalNumber(e.target.value)}
            placeholder="Enter Practical Number or Title"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload File (PDF or DOCX)</label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          {uploading ? 'Uploading...' : 'Submit Practical'}
        </button>
      </form>

      {submittedFileUrl && (
        <div className="mt-4">
          <p className="text-sm">Submitted file: </p>
          <a href={submittedFileUrl} target="_blank" rel="noopener noreferrer" className="underline">
            Open submitted file
          </a>
        </div>
      )}
    </div>
  );
};

export default PracticalSubmit;
