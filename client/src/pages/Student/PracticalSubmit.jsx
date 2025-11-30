// src/pages/Student/PracticalSubmit.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetMySubjectsQuery, 
  useUploadPracticalMutation 
} from '../../features/student/studentApi';
import { Loader2, AlertTriangle, FileText, CheckCircle } from 'lucide-react'; // Assuming you use lucide-react or similar icon library

// Color Palette Constants for better readability in JSX
const PRIMARY_TEXT = 'text-[#2B2B2B]';
const SECONDARY_ACCENT = 'bg-[#284B63]';
const HOVER_ACCENT = 'hover:bg-[#3C6E71]';
const UI_BG_LIGHT = 'bg-[#f9fafb]';
const UI_BORDER = 'border-[#cbd5e1]';
const FOCUS_RING = 'focus:ring-[#4c7cff]';
const FILE_BUTTON_BG = 'file:bg-[#D4D4D4]';
const SUCCESS_LINK = 'text-[#4c7cff]';

const PracticalSubmit = () => {
  const { classId } = useParams();
  const { data, isLoading, error } = useGetMySubjectsQuery();
  const [uploadPractical, { isLoading: uploading }] = useUploadPracticalMutation();

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [practicalNumber, setPracticalNumber] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedFileUrl, setSubmittedFileUrl] = useState('');

  useEffect(() => {
    if (data?.data && classId) {
      const cls = data.data.find(c => String(c.classId) === String(classId));
      setSelectedClass(cls || null);
    }
  }, [data, classId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous message
    setIsSuccess(false);

    if (!selectedSubject || !practicalNumber || !file) {
      setMessage('All fields and a file are required.');
      setIsSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('subjectId', selectedSubject);
    formData.append('practicalNumber', practicalNumber);
    formData.append('practicalFile', file); // must match multer .single('practicalFile')

    try {
      const res = await uploadPractical({ classId, formData }).unwrap();
      setMessage(res.message || 'Practical submitted successfully!');
      setIsSuccess(true);
      // Clear form fields on successful submission
      setPracticalNumber('');
      setFile(null);
      setSelectedSubject('');
      setSubmittedFileUrl(res.submission?.fileUrl || ''); 
    } catch (err) {
      setMessage(err?.data?.message || err?.message || 'Submission failed. Please try again.');
      setIsSuccess(false);
    }
  };

  // --- RENDERING LOADING/ERROR STATES ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md mt-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#284B63] mr-3" />
        <p className={`${PRIMARY_TEXT}`}>Loading class data...</p>
      </div>
    );
  }

  if (error || !selectedClass) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-red-50 rounded-lg shadow-md mt-8 border border-red-300">
        <div className="flex items-center text-red-600">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <p className="font-semibold">Class Data Unavailable</p>
        </div>
        <p className="mt-2 text-sm text-red-500">
          Could not load details for Class ID: {classId}. Please check the URL or try refreshing.
        </p>
      </div>
    );
  }

  // --- MAIN COMPONENT RENDER ---
  return (
    <div className="max-w-lg mx-auto p-8 bg-[#FFFFFF] shadow-xl rounded-xl mt-8 border border-[#D4D4D4]">
      {/* Header */}
      <h1 className={`text-3xl font-extrabold mb-7 ${PRIMARY_TEXT} border-b pb-3 border-[#D4D4D4]/70`}>
        📝 Submit Practical - {selectedClass.className}
      </h1>

      {/* Message Area (Toast-like) */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg shadow-sm flex items-start text-sm font-medium 
          ${isSuccess 
            ? 'bg-green-100 text-[#3C6E71]' 
            : 'bg-red-100 text-red-600'}`}
        >
          {isSuccess ? <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />}
          <p>{message}</p>
        </div>
      )}

      {/* Form Section - Disabled when uploading */}
      <form onSubmit={handleSubmit} className={`flex flex-col gap-6 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* Subject Select */}
        <div className='relative'>
          <label className={`block mb-2 font-medium ${PRIMARY_TEXT}`}>Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={`w-full p-3 border ${UI_BORDER} rounded-lg appearance-none ${UI_BG_LIGHT} ${PRIMARY_TEXT} focus:outline-none focus:ring-2 ${FOCUS_RING}`}
            required
            disabled={uploading}
          >
            <option value="">-- Choose Subject --</option>
            {selectedClass.subjects.map(sub => (
              <option key={sub.subjectId} value={sub.subjectId} className={`${PRIMARY_TEXT}`}>
                {sub.name}
              </option>
            ))}
          </select>
          {/* Custom chevron icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-3 text-[#284B63]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        {/* Practical Number Input */}
        <div>
          <label className={`block mb-2 font-medium ${PRIMARY_TEXT}`}>Practical Number/Title</label>
          <input
            type="text"
            value={practicalNumber}
            onChange={(e) => setPracticalNumber(e.target.value)}
            placeholder="E.g., Practical 1: Binary Search Algorithm"
            className={`w-full p-3 border ${UI_BORDER} rounded-lg ${UI_BG_LIGHT} ${PRIMARY_TEXT} focus:outline-none focus:ring-2 ${FOCUS_RING}`}
            required
            disabled={uploading}
          />
        </div>

        {/* File Upload Input & Preview */}
        <div>
          <label className={`block mb-2 font-medium ${PRIMARY_TEXT}`}>Upload File (.pdf or .docx)</label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className={`block w-full text-sm ${PRIMARY_TEXT} 
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
              file:text-sm file:font-semibold ${FILE_BUTTON_BG} file:text-[#284B63] 
              hover:file:bg-[#a6e6ff] hover:file:text-[#284B63] cursor-pointer
            `}
            required={!submittedFileUrl} // Require file only if no URL exists (initial submission)
            disabled={uploading}
          />
          {file && (
            <div className={`mt-2 flex items-center text-sm ${PRIMARY_TEXT}`}>
              <FileText className='w-4 h-4 mr-2 text-[#284B63]'/>
              <span className='font-medium'>Selected:</span> {file.name}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className={`
            p-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center
            ${uploading 
              ? 'bg-[#D4D4D4] text-[#374151] cursor-not-allowed' 
              : `${SECONDARY_ACCENT} text-white ${HOVER_ACCENT} focus:outline-none focus:ring-4 focus:ring-[#4c7cff]/50`
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
              Uploading...
            </>
          ) : (
            '🚀 Submit Practical'
          )}
        </button>
      </form>

      {/* Submitted File Link */}
      {(submittedFileUrl || isSuccess) && (
        <div className={`mt-8 pt-5 border-t border-[#D4D4D4]`}>
          <p className={`text-base font-semibold ${PRIMARY_TEXT} mb-2 flex items-center`}>
            <CheckCircle className="w-5 h-5 mr-2 text-[#3C6E71]" /> Submission Details:
          </p>
          {submittedFileUrl && (
             <a 
                href={submittedFileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${SUCCESS_LINK} hover:text-[#3C6E71] underline transition-colors duration-200 text-sm break-all font-medium`}
              >
                View Submitted Practical File
              </a>
          )}
          {!submittedFileUrl && isSuccess && (
            <p className="text-sm text-gray-500">Submission recorded successfully, but no direct file link was provided.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticalSubmit;