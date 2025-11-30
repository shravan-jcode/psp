import React, { useState } from "react";
import { useGetApprovedSubmissionsQuery } from "../../features/teacher/teacherApi";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, FileCheck, Loader2, AlertTriangle } from "lucide-react";

const AllPracticals = () => {
  const { data, isLoading, error } = useGetApprovedSubmissionsQuery();
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const PRIMARY_TEXT = "text-[#2B2B2B]";
  const HEADING_TEXT = "text-[#111827]";
  const UI_BG_WHITE = "bg-[#FFFFFF]";
  const CARD_BG = "bg-[#f3f4f6]";
  const INPUT_BG = "bg-[#f9fafb]";
  const BORDER_COLOR = "border-[#cbd5e1]";
  const SUBTLE_TEXT = "text-[#374151]";
  const SECONDARY_BUTTON_BG = "bg-[#284B63]";
  const ACCENT_BUTTON_HOVER = "hover:bg-[#3C6E71]";
  const FOCUS_RING = "focus:ring-[#4c7cff]";

  if (isLoading)
    return (
      <div className={`text-center p-12 ${UI_BG_WHITE} flex justify-center items-center h-48`}>
        <Loader2 className="w-6 h-6 animate-spin mr-3 text-[#284B63]" />
        <span className={`${PRIMARY_TEXT} font-medium`}>Loading approved practicals...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-center p-8 bg-red-50 text-red-600 border border-red-300 rounded-lg max-w-6xl mx-auto mt-6">
        <AlertTriangle className="w-5 h-5 inline-block mr-2" />
        <span className="font-semibold">Failed to load approved practicals.</span>
      </div>
    );

  let approved = data?.data || [];

  const subjects = [...new Set(approved.map((p) => p.subject))];
  const classes = [...new Set(approved.map((p) => p.className))];

  approved = approved.filter((p) => {
    return (
      p.studentName.toLowerCase().includes(searchName.toLowerCase()) &&
      (filterSubject ? p.subject === filterSubject : true) &&
      (filterClass ? p.className === filterClass : true)
    );
  });

  return (
    <div className={`max-w-6xl mx-auto p-8 ${UI_BG_WHITE} shadow-2xl rounded-xl mt-6`}>
      <h2 className={`text-3xl font-extrabold mb-8 ${HEADING_TEXT} border-b border-[#D4D4D4] pb-3 flex items-center`}>
        <FileCheck className="w-7 h-7 mr-3 text-[#3C6E71]" />
        Approved Practical Submissions
      </h2>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="relative">
          <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${SUBTLE_TEXT}`} />
          <input
            type="text"
            placeholder="Search by Student Name"
            className={`w-full p-3 pl-10 border ${BORDER_COLOR} rounded-lg ${INPUT_BG} ${PRIMARY_TEXT} focus:outline-none focus:ring-2 ${FOCUS_RING}`}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <select
          className={`w-full p-3 border ${BORDER_COLOR} ${INPUT_BG} rounded-lg ${PRIMARY_TEXT} focus:ring-2 ${FOCUS_RING}`}
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
        >
          <option value="">Filter by Subject</option>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>

        <select
          className={`w-full p-3 border ${BORDER_COLOR} ${INPUT_BG} rounded-lg ${PRIMARY_TEXT} focus:ring-2 ${FOCUS_RING}`}
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">Filter by Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {approved.map((p) => (
          <div
            key={p.practicalId}
            className={`p-5 border ${BORDER_COLOR} rounded-xl ${CARD_BG} flex justify-between items-center hover:shadow-lg transition`}
          >
            <div>
              <p className={`font-extrabold ${PRIMARY_TEXT} text-lg`}>
                {p.studentName}
              </p>

              <p className={`text-sm ${SUBTLE_TEXT}`}>
                <span className="font-semibold text-[#284B63]">{p.subject}</span> | {p.className} |
                Practical {p.practicalNumber} | Roll No: {p.studentRollNumber}
              </p>
            </div>

            <button
              onClick={() => navigate(`/teacher/approved/${p.practicalId}`)}
              className={`px-5 py-2 ${SECONDARY_BUTTON_BG} text-white rounded-lg font-semibold ${ACCENT_BUTTON_HOVER} flex items-center`}
            >
              Preview Details <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        ))}

        {approved.length === 0 && (
          <div className="text-center p-10 bg-[#f9fafb] border border-[#D4D4D4] rounded-xl">
            <Search className="w-8 h-8 mx-auto mb-2 text-[#284B63]" />
            <p className="font-semibold text-[#374151]">No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPracticals;
