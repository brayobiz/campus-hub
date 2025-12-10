// src/pages/Profile.tsx — DOWNSIZED EDITION (Tighter, Sleeker, 2025)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FaUser, FaLock } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState<"year" | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-32">

        {/* HERO */}
        <div className="pt-16 pb-10 px-4 text-center bg-gradient-to-b from-orange-50 to-transparent">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 mx-auto shadow-xl ring-4 ring-white/60 flex items-center justify-center">
            <FaUser className="w-12 h-12 text-white" />
          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900 tracking-tight">Alex Kimani</h1>
          <p className="mt-2 text-base font-semibold text-orange-600">Kenyatta University</p>

          <div className="mt-5 inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm border border-amber-200">
            <FaLock className="text-sm" /> Free Account
          </div>
        </div>

        {/* SETTINGS SECTION */}
        <div className="px-4 py-6 space-y-3">
          <SettingRow 
            icon="⚙️" 
            label="Manage Settings" 
            value="Campus, Email, Verification..." 
            onTap={() => navigate("/settings")} 
          />
          <SettingRow 
            icon="📚" 
            label="Year of Study" 
            value="3rd Year • Computer Science" 
            onTap={() => setOpenSheet("year")} 
          />

          <div className="h-px bg-gray-200 my-6" />

          <SettingRow 
            icon="🔔" 
            label="Notifications" 
            onTap={() => alert("Coming soon")} 
          />
          <SettingRow 
            icon="🛡️" 
            label="Privacy & Safety" 
            onTap={() => alert("Coming soon")} 
          />
          <SettingRow 
            icon="❓" 
            label="Help & Support" 
            onTap={() => alert("support@campushub.ke")} 
          />
        </div>



      </div>

      {/* MODAL for Year / Premium — centered overlays */}
      {openSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenSheet(null)} />

          <div className="relative bg-white w-full max-w-lg shadow-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden my-auto sm:my-0 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-black text-gray-900">
                {openSheet === "year" && "Academic Info"}
              </h2>
              <button onClick={() => setOpenSheet(null)} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
            </div>

            <div className="p-6">
              {openSheet === "year" && <YearSheet />}
            </div>
          </div>
        </div>
      )}

      <BottomNav openPostModal={() => {}} />
    </>
  );
};

// SETTING ROW — IMPROVED STYLING
const SettingRow = ({ icon, label, value, onTap }: any) => (
  <button
    onClick={onTap}
    className="w-full bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-200 active:scale-98 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-xl">{icon}</div>
      <div className="text-left">
        <p className="font-bold text-lg text-gray-900">{label}</p>
        {value && <p className="text-sm text-gray-600 mt-1">{value}</p>}
      </div>
    </div>
    <span className="text-gray-400 text-2xl group-hover:text-orange-500 transition">›</span>
  </button>
);

// YEAR SHEET
const YearSheet = () => (
  <div className="space-y-4">
    <input 
      placeholder="Year (e.g. 2nd Year)" 
      className="w-full px-4 py-4 border border-gray-300 rounded-2xl text-base text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
    />
    <input 
      placeholder="Course" 
      className="w-full px-4 py-4 border border-gray-300 rounded-2xl text-base text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
    />
    <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-700 shadow-lg transition-all">
      Save
    </button>
  </div>
);

export default Profile;