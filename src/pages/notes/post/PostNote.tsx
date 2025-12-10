// src/pages/notes/post/PostNote.tsx
import { useState } from "react";
import PostForm from "../../../components/post/PostForm";
import { useCampusStore } from "../../../store/useCampusStore"; // Zustand store
import { School } from "lucide-react";

const PostNote = () => {
  const campus = useCampusStore((state) => state.campus);
  const [courseInput, setCourseInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const SUGGESTED_COURSES = [
    "ICS 2107", "SCS 101", "BCOM 101", "BIT 3101", "ACC 101",
    "LAW 101", "HRM 210", "MKT 301", "ECO 101", "MAT 101",
    "PHY 101", "CHEM 101", "BIO 101", "SMA 101", "SPH 101",
    "ICS 2208", "BIT 2204", "BBA 301", "NUR 102", "EDU 101"
  ].sort();

  const filteredCourses = SUGGESTED_COURSES.filter(c =>
    c.toLowerCase().includes(courseInput.toLowerCase())
  ).slice(0, 8);

  if (!campus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl text-gray-600">Loading your campus...</p>
        </div>
      </div>
    );
  }

  const fields = [
    { name: "title", label: "Note Title", type: "text", required: true },

    // CAMPUS — now a disabled input showing the campus name
    {
      name: "campus",
      label: "Your Campus",
      type: "text",
      render: () => (
        <div className="relative">
          <input
            type="text"
            value={campus.name}
            disabled
            className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-300 bg-indigo-100 text-indigo-900 font-bold text-lg cursor-not-allowed outline-none"
          />
          <School className="absolute top-1/2 right-4 -translate-y-1/2 text-indigo-700 w-6 h-6" />
        </div>
      ),
    },

    // SMART COURSE CODE INPUT
    {
      name: "course",
      label: "Course Code (e.g. ICS 2107)",
      type: "custom",
      required: true,
      render: () => (
        <div className="relative">
          <input
            type="text"
            value={courseInput}
            onChange={(e) => {
              setCourseInput(e.target.value.toUpperCase());
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Type course code..."
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-300 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-gray-900 font-bold text-lg placeholder-gray-400 transition-all"
          />

          {showSuggestions && courseInput && filteredCourses.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-56 overflow-y-auto">
              {filteredCourses.map((code) => (
                <button
                  key={code}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setCourseInput(code);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-5 py-4 text-left hover:bg-indigo-50 transition font-bold text-indigo-700 border-b border-gray-100 last:border-0"
                >
                  {code}
                </button>
              ))}
              <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-xs text-gray-600 border-t">
                Not in list? Just type it exactly as shown in your portal
              </div>
            </div>
          )}

          <input type="hidden" name="course" value={courseInput.trim()} />
        </div>
      ),
    },

    { name: "year", label: "Year / Semester (e.g. Y2S1, 2024/2025)", type: "text" },
    { name: "file", label: "Upload Note (PDF/Image)", type: "file", required: true },
    { name: "description", label: "Additional Notes (optional)", type: "textarea" },
  ];

  return (
    <>
      <PostForm
        title="Upload Notes / Past Papers"
        fields={fields}
        submitUrl="/api/notes"
        onBeforeSubmit={(formData) => {
          if (!courseInput.trim()) {
            alert("Please enter a valid course code");
            return false;
          }

          formData.set("campusId", campus.id ?? "");
          formData.set("campusName", campus.name);
          formData.set("course", courseInput.trim().toUpperCase());

          return true;
        }}
        onSuccess={() => setCourseInput("")}
      />
    </>
  );
};

export default PostNote;