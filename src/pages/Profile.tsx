// src/pages/Profile.tsx — DOWNSIZED EDITION (Tighter, Sleeker, 2025)
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { FaUser, FaRocket, FaLock } from "react-icons/fa";

const Profile = () => {
  const [openSheet, setOpenSheet] = useState<"campus" | "contact" | "year" | "premium" | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-32">

        {/* HERO */}
        <div className="pt-16 pb-10 px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 mx-auto shadow-xl ring-4 ring-white/60 flex items-center justify-center">
            <FaUser className="w-12 h-12 text-white" />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Alex Kimani</h1>
          <p className="mt-1 text-base font-semibold text-orange-600">Kenyatta University</p>

          <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm">
            <FaLock className="text-sm" /> Free Account
          </div>
        </div>

        {/* SETTINGS */}
        <div className="px-4 space-y-3">
          <SettingRow icon="Campus" label="My Campus" value="Kenyatta University" onTap={() => setOpenSheet("campus")} />
          <SettingRow icon="Email" label="Email & Phone" value="alex@students.ku.ac.ke" onTap={() => setOpenSheet("contact")} />
          <SettingRow icon="Year" label="Year of Study" value="3rd Year • Computer Science" onTap={() => setOpenSheet("year")} />

          <div className="h-px bg-gray-300 my-6" />

          <SettingRow icon="Bell" label="Notifications" onTap={() => alert("Coming soon")} />
          <SettingRow icon="Shield" label="Privacy & Safety" onTap={() => alert("Coming soon")} />
          <SettingRow icon="Help" label="Help & Support" onTap={() => alert("support@campushub.ke")} />
        </div>

        {/* PRO CTA */}
        <div className="mx-4 mt-10">
          <div
            onClick={() => setOpenSheet("premium")}
            className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-6 text-center text-white shadow-xl active:scale-98 transition-all"
          >
            <FaRocket className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-2xl font-black">Go Campus Pro</h3>
            <p className="mt-2 text-base opacity-90">Sell • Events • No Ads • Verified</p>

            <div className="mt-5 mx-auto w-fit bg-white/25 backdrop-blur px-6 py-2 rounded-2xl">
              <p className="text-lg font-black">1 MONTH FREE</p>
            </div>

            <div className="mt-5 py-3 bg-white text-orange-600 font-black text-base rounded-2xl shadow-sm">
              Try Free → No Card Needed
            </div>
          </div>
        </div>

        {/* SIGN OUT */}
        <div className="mx-4 mt-8">
          <button className="w-full py-4 bg-gray-100 text-red-600 rounded-2xl font-bold text-lg active:scale-95 transition">
            Sign Out
          </button>
        </div>
      </div>

      {/* SHEET */}
      {openSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenSheet(null)} />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl animate-slide-in-right overflow-y-auto rounded-l-2xl">

            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
              <button onClick={() => setOpenSheet(null)} className="text-3xl font-light">×</button>
              <h2 className="text-xl font-black">
                {openSheet === "campus" && "My Campus"}
                {openSheet === "contact" && "Verify Contact"}
                {openSheet === "year" && "Academic Info"}
                {openSheet === "premium" && "Campus Pro"}
              </h2>
              <div className="w-6" />
            </div>

            <div className="p-6">
              {openSheet === "campus" && <CampusSheet />}
              {openSheet === "contact" && <ContactSheet />}
              {openSheet === "year" && <YearSheet />}
              {openSheet === "premium" && <PremiumSheet onClose={() => setOpenSheet(null)} />}
            </div>
          </div>
        </div>
      )}

      <BottomNav openPostModal={() => {}} />
    </>
  );
};

// SETTING ROW — DOWNSIZED
const SettingRow = ({ icon, label, value, onTap }: any) => (
  <button
    onClick={onTap}
    className="w-full bg-white rounded-2xl px-5 py-5 flex items-center justify-between shadow-sm border border-gray-200 active:scale-98 transition-all"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-base font-bold">{icon}</div>
      <div>
        <p className="font-semibold text-lg text-gray-900">{label}</p>
        {value && <p className="text-sm text-gray-500 mt-0.5">{value}</p>}
      </div>
    </div>
    <span className="text-gray-400 text-2xl">›</span>
  </button>
);

// CAMPUS SHEET — REDUCED
const CampusSheet = () => (
  <div className="space-y-3">
    {["Kenyatta University", "UoN", "JKUAT", "Strathmore", "USIU", "Moi University", "Egerton"].map(c => (
      <button key={c} className="w-full py-4 bg-orange-50 rounded-2xl font-semibold text-lg active:bg-orange-100">
        {c}
      </button>
    ))}
  </div>
);

const ContactSheet = () => (
  <div className="text-center space-y-5">
    <p className="text-gray-600 text-base">Verify with your .ac.ke email</p>
    <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg">Continue with Email</button>
  </div>
);

const YearSheet = () => (
  <div className="space-y-4">
    <input placeholder="Year (e.g. 2nd Year)" className="w-full px-4 py-4 border rounded-2xl text-base" />
    <input placeholder="Course" className="w-full px-4 py-4 border rounded-2xl text-base" />
    <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg">Save</button>
  </div>
);

const PremiumSheet = ({ onClose }: { onClose: () => void }) => (
  <div className="text-center space-y-5">
    <h3 className="text-2xl font-black">Campus Pro</h3>
    <p className="text-gray-600 text-base">Everything unlocked • KSh 299/month</p>

    <div className="bg-gradient-to-r from-amber-400 to-orange-500 py-5 rounded-3xl font-black text-2xl">
      1 MONTH FREE
    </div>

    <button className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl shadow-lg">
      Start Free Trial
    </button>

    <button onClick={onClose} className="w-full py-4 bg-gray-100 rounded-2xl font-semibold text-lg">
      Maybe Later
    </button>
  </div>
);

export default Profile;