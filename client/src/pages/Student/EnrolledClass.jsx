import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetMySubjectsQuery } from "../../features/student/studentApi";
// Assuming Card/CardContent are styled wrappers, we'll focus on className props
import { Card, CardContent } from "../../components/ui/card"; 
import { BookOpen, AlertTriangle, Loader2 } from "lucide-react"; // Added AlertTriangle and Loader2

const EnrolledClass = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMySubjectsQuery();

  // --- Utility Class Constants ---
  const PRIMARY_TEXT = 'text-[#2B2B2B]';
  const UI_BG_WHITE = 'bg-[#FFFFFF]';
  const CARD_BORDER = 'border-[#cbd5e1]';
  const SECONDARY_BUTTON_BG = 'bg-[#284B63]';
  const ACCENT_BUTTON_HOVER = 'hover:bg-[#3C6E71]';
  const SUBJECT_ITEM_BG = 'bg-[#f9fafb]';
  const ICON_COLOR = 'text-[#4c7cff]';

  // --- Loading State ---
  if (isLoading)
    return (
      <div className={`p-8 text-center ${PRIMARY_TEXT} flex items-center justify-center h-40 ${UI_BG_WHITE}`}>
        <Loader2 className={`w-5 h-5 animate-spin mr-3 ${ICON_COLOR}`} />
        <span className="font-medium">Loading classes...</span>
      </div>
    );

  // --- Error State ---
  if (error)
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg max-w-4xl mx-auto mt-6 border border-red-300">
        <AlertTriangle className="w-6 h-6 inline-block mr-2" />
        <span className="font-semibold">Failed to load classes.</span>
        <p className="text-sm text-red-500 mt-1">Please check your connection and try again.</p>
      </div>
    );

  const classes = data?.data || [];

  return (
    <div className={`p-8 max-w-4xl mx-auto ${UI_BG_WHITE}`}>
      <h1 className={`text-3xl font-bold ${PRIMARY_TEXT} mb-8 border-b border-[#D4D4D4] pb-3`}>
        My Enrolled Subjects
      </h1>

      {classes.length === 0 ? (
        <p className={`text-[#374151] p-6 border ${CARD_BORDER} rounded-lg ${UI_BG_WHITE} shadow-sm`}>
          You haven't joined any classes yet. Please join a class using a class code.
        </p>
      ) : (
        classes.map((cls) => (
          // --- Class Card ---
          <Card
            key={cls.classId}
            className={`mb-8 shadow-lg ${CARD_BORDER} ${UI_BG_WHITE} rounded-xl overflow-hidden`}
          >
            <CardContent className="p-6">
              <h2 className={`text-2xl font-bold ${PRIMARY_TEXT} mb-1`}>
                {cls.className}
              </h2>

              <p className={`text-[#374151] mb-4 text-sm`}>
                <span className="font-bold">Class Code:</span>{" "}
                <span className="text-[#284B63] font-mono">{cls.classCode}</span>
              </p>
              
              <h3 className={`font-bold ${PRIMARY_TEXT} mb-3 text-lg border-t border-[#f3f4f6] pt-4`}>
                Subjects in this Class
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cls.subjects.map((sub) => (
                  // --- Subject Item ---
                  <div
                    key={sub.subjectId}
                    className={`flex items-center justify-between gap-3 p-4 ${SUBJECT_ITEM_BG} rounded-lg border border-[#f3f4f6] transition-shadow duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className={`h-5 w-5 ${ICON_COLOR}`} />
                      <span className={`text-[#2B2B2B] font-medium`}>
                        {sub.name}
                      </span>
                    </div>

                    {/* Button to go to PracticalSubmit */}
                    <button
                      onClick={() =>
                        navigate(
                          `/student/submit/${cls.classId}/${sub.subjectId}`
                        )
                      }
                      className={`
                        ${SECONDARY_BUTTON_BG} text-white px-4 py-2 rounded-full 
                        ${ACCENT_BUTTON_HOVER} transition-colors text-sm font-semibold
                        focus:outline-none focus:ring-4 focus:ring-[#4c7cff]/50
                      `}
                    >
                      Submit Practical
                    </button>
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