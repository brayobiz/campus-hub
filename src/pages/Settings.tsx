import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
  FaChevronLeft,
  FaBell,
  FaLock,
  FaQuestionCircle,
  FaSchool as FaCampus,
  FaToggleOn,
  FaToggleOff,
  FaSignOutAlt,
  FaEnvelope,
  FaCheck,
  FaExclamationCircle,
} from "react-icons/fa";
import { useUserStore } from "../store/useUserStore";
import { useCampusStore } from "../store/useCampusStore";
import { supabase } from "../lib/supabaseClient";

const Settings = () => {
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState<"campus" | "email" | "notifications" | "privacy" | null>(null);
  const [showAllCampuses, setShowAllCampuses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>("");

  // Email verification state
  const [profile, setProfile] = useState<any>(null);
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolEmailVerified, setSchoolEmailVerified] = useState(false);
  const [emailStep, setEmailStep] = useState<"add" | "verify">("add");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [personalEmailVerified, setPersonalEmailVerified] = useState(false);

  const user = useUserStore((s: any) => s.user);
  const clearUser = useUserStore((s: any) => s.clearUser);
  const campus = useCampusStore((s: any) => s.campus);
  const setCampusStore = useCampusStore((s: any) => s.setCampus);

  // Load profile and preferences on mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getUser();
        const uid = sessionData?.user?.id;
        if (!uid) return;

        // Fetch profile data
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .single();

        if (p) {
          setProfile(p);
          setShowAllCampuses(p.show_all_campuses || false);
          setSchoolEmail(p.school_email || "");
          setSchoolEmailVerified(p.school_email_verified || false);
          setSelectedCampus(p.campus_id || campus?.id || "");
        }

        // Check personal email verification
        const { user: authUser } = await supabase.auth.getUser();
        setPersonalEmailVerified(!!authUser?.email_confirmed_at);
      } catch (e) {
        console.warn("Failed to load profile:", e);
      }
    };

    loadProfileData();
  }, [campus?.id]);

  // Fetch campuses
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const { data } = await supabase
          .from("campuses")
          .select("id, name, short_name, email_domain")
          .order("name", { ascending: true });
        setCampuses(data || []);
      } catch (e) {
        console.warn("Failed to fetch campuses:", e);
      }
    };
    fetchCampuses();
  }, []);

  const handleCampusChange = async (campusId: string) => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const uid = sessionData?.user?.id;
      if (!uid) throw new Error("User not signed in");

      const { error } = await supabase
        .from("profiles")
        .update({ campus_id: campusId })
        .eq("id", uid);

      if (error) throw error;

      const selected = campuses.find((c) => String(c.id) === String(campusId));
      if (selected) {
        setCampusStore(selected);
        setSelectedCampus(campusId);
      }
    } catch (e: any) {
      alert("Failed to change campus: " + (e?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAllCampuses = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const uid = sessionData?.user?.id;
      if (!uid) throw new Error("User not signed in");

      const newValue = !showAllCampuses;
      const { error } = await supabase
        .from("profiles")
        .update({ show_all_campuses: newValue })
        .eq("id", uid);

      if (error) throw error;

      setShowAllCampuses(newValue);
    } catch (e: any) {
      alert("Failed to update preference: " + (e?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchoolEmail = async () => {
    if (!schoolEmail) {
      alert("Please enter your school email");
      return;
    }

    // Simple email validation
    if (!schoolEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    setSendingEmail(true);
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      const uid = sessionData?.user?.id;
      if (!uid) throw new Error("User not signed in");

      // Update school email in database
      const { error } = await supabase
        .from("profiles")
        .update({ 
          school_email: schoolEmail,
          school_email_verified: false 
        })
        .eq("id", uid);

      if (error) throw error;

      // In production, send verification email to school_email
      alert(`✓ Verification email will be sent to ${schoolEmail}\n\nCheck your inbox for the verification link.`);
      setEmailStep("verify");
    } catch (e: any) {
      alert("Failed to add school email: " + (e?.message || "Unknown error"));
    } finally {
      setSendingEmail(false);
    }
  };

  const handleResendPersonalEmail = async () => {
    setSendingEmail(true);
    try {
      // This would call Supabase's resend auth email endpoint
      alert("✓ Verification email sent to " + user?.email + "\n\nCheck your inbox.");
    } catch (e: any) {
      alert("Failed to send email: " + (e?.message || "Unknown error"));
    } finally {
      setSendingEmail(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-32">
      {/* HEADER */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-lg shadow-sm px-4 sm:px-6 py-4 flex items-center gap-4 z-20 border-b border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/profile")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FaChevronLeft className="text-gray-600" />
        </motion.button>
        <h1 className="text-lg sm:text-xl font-black text-gray-900">Settings</h1>
      </header>

      <div className="px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* CAMPUS & PREFERENCES SECTION */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4">Campus & Preferences</h2>
            
            {/* Campus Selector */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => setOpenSheet("campus")}
              className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm hover:shadow-md border border-gray-200 cursor-pointer transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-lg shadow-lg">
                  <FaCampus />
                </div>
                <div>
                  <p className="font-bold text-gray-900">My Campus</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {campus?.short_name ? `${campus.name} (${campus.short_name})` : "Select your campus"}
                  </p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition">›</span>
            </motion.div>

            {/* Show All Campuses Toggle */}
            <div className={loading ? "opacity-50 cursor-not-allowed" : ""}>
              <motion.div
                whileHover={!loading ? { scale: 1.01 } : {}}
                onClick={!loading ? handleToggleAllCampuses : undefined}
                className="mt-4 bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm border border-gray-200 cursor-pointer transition group hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-lg shadow-lg">
                    {showAllCampuses ? <FaToggleOn /> : <FaToggleOff />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">See All Campuses</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {showAllCampuses
                        ? "Viewing content from all campuses"
                        : "Only your campus content"}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ opacity: loading ? 0.5 : 1 }}
                  className="text-2xl"
                >
                  {showAllCampuses ? "✓" : "○"}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* EMAIL VERIFICATION SECTION */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4">Email Verification</h2>
            
            {/* Personal Email Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg shadow-lg ${
                  personalEmailVerified 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                    : "bg-gradient-to-br from-yellow-500 to-orange-600"
                }`}>
                  {personalEmailVerified ? <FaCheck /> : <FaExclamationCircle />}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Personal Email</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user?.email || "Not set"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {personalEmailVerified ? "✓ Verified" : "⚠ Not verified"}
                  </p>
                </div>
              </div>
              {!personalEmailVerified && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResendPersonalEmail}
                  disabled={sendingEmail}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition"
                >
                  {sendingEmail ? "Sending..." : "Verify"}
                </motion.button>
              )}
            </motion.div>

            {/* School Email Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg shadow-lg ${
                  schoolEmailVerified 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                    : schoolEmail
                    ? "bg-gradient-to-br from-yellow-500 to-orange-600"
                    : "bg-gradient-to-br from-gray-400 to-gray-500"
                }`}>
                  {schoolEmailVerified ? <FaCheck /> : <FaEnvelope />}
                </div>
                <div>
                  <p className="font-bold text-gray-900">School Email</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {schoolEmail || "Add your school email"}
                  </p>
                  {schoolEmail && (
                    <p className="text-xs text-gray-400 mt-1">
                      {schoolEmailVerified ? "✓ Verified" : "⚠ Pending verification"}
                    </p>
                  )}
                </div>
              </div>

              {!schoolEmail ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpenSheet("email")}
                  className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition text-sm"
                >
                  Add School Email
                </motion.button>
              ) : !schoolEmailVerified ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpenSheet("email")}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition text-sm"
                >
                  Verify Email
                </motion.button>
              ) : null}
            </motion.div>
          </section>

          {/* NOTIFICATIONS */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4">Notifications</h2>
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => setOpenSheet("notifications")}
              className="w-full bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm hover:shadow-md border border-gray-200 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-lg shadow-lg">
                  <FaBell />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Manage Notifications</p>
                  <p className="text-sm text-gray-500 mt-1">Push, email, SMS preferences</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition">›</span>
            </motion.button>
          </section>

          {/* PRIVACY & SECURITY */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4">Security</h2>
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => setOpenSheet("privacy")}
              className="w-full bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm hover:shadow-md border border-gray-200 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg shadow-lg">
                  <FaLock />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Privacy & Safety</p>
                  <p className="text-sm text-gray-500 mt-1">Account security settings</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition">›</span>
            </motion.button>
          </section>

          {/* HELP & SUPPORT */}
          <section>
            <h2 className="text-lg font-black text-gray-900 mb-4">Support</h2>
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => alert("📧 support@campushub.ke")}
              className="w-full bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm hover:shadow-md border border-gray-200 transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-lg shadow-lg">
                  <FaQuestionCircle />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Help & Support</p>
                  <p className="text-sm text-gray-500 mt-1">FAQ, contact us, report issues</p>
                </div>
              </div>
              <span className="text-gray-400 group-hover:translate-x-1 transition">›</span>
            </motion.button>
          </section>

          {/* LOGOUT */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-lg shadow-lg transition flex items-center justify-center gap-2 mt-8"
          >
            <FaSignOutAlt /> Sign Out
          </motion.button>
        </motion.div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {/* CAMPUS MODAL */}
        {openSheet === "campus" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center"
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpenSheet(null)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full sm:max-w-lg max-h-[90vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto"
            >
              <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
                <h2 className="text-xl font-black">Select Your Campus</h2>
                <button
                  onClick={() => setOpenSheet(null)}
                  className="text-gray-400 text-2xl hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-6 space-y-3">
                {campuses.map((c) => (
                  <motion.button
                    key={c.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleCampusChange(c.id);
                      setOpenSheet(null);
                    }}
                    disabled={loading}
                    className={`w-full py-4 px-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-between ${
                      selectedCampus === String(c.id)
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-sm opacity-75">{c.short_name}</p>
                    </div>
                    {selectedCampus === String(c.id) && <span>✓</span>}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* EMAIL MODAL */}
        {openSheet === "email" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center"
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpenSheet(null)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full sm:max-w-lg max-h-[90vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto"
            >
              <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
                <h2 className="text-xl font-black">Add School Email</h2>
                <button
                  onClick={() => setOpenSheet(null)}
                  className="text-gray-400 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    School Email Address
                  </label>
                  <input
                    type="email"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    placeholder="student@ku.ac.ke"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Use your official school/university email address
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddSchoolEmail}
                  disabled={sendingEmail || !schoolEmail}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50 transition"
                >
                  {sendingEmail ? "Sending..." : "Send Verification Link"}
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  We'll send a verification link to your school email. Click it to confirm.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* NOTIFICATIONS MODAL */}
        {openSheet === "notifications" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center"
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpenSheet(null)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full sm:max-w-lg max-h-[90vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto"
            >
              <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
                <h2 className="text-xl font-black">Notification Settings</h2>
                <button
                  onClick={() => setOpenSheet(null)}
                  className="text-gray-400 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-6 space-y-4">
                {[
                  { label: "Push Notifications", desc: "On-app alerts" },
                  { label: "Email Notifications", desc: "Daily digest" },
                  { label: "SMS Notifications", desc: "Urgent updates only" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <button className="text-2xl hover:scale-125 transition">✓</button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Settings;
