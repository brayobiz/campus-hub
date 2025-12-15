import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FaUser, FaChevronRight, FaSignOutAlt, FaEdit } from "react-icons/fa";
import { useUserStore } from "../store/useUserStore";
import { useCampusStore } from "../store/useCampusStore";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileData {
  id: string;
  email: string;
  year?: string;
  major?: string;
  campus_id?: string;
}

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  onTap: () => void;
}

const Profile = () => {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const campus = useCampusStore((s) => s.campus);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<"edit-profile" | "account" | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ year: "", major: "" });

  useEffect(() => {
    loadProfileData();
  }, [user?.id]);

  const loadProfileData = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Profile fetch error:", error);
      }

      if (data) {
        setProfileData(data);
        setEditForm({
          year: data.year || "",
          major: data.major || "",
        });
      } else {
        setProfileData({
          id: user.id,
          email: user.email || "",
          year: "",
          major: "",
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          year: editForm.year || null,
          major: editForm.major || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfileData((prev) =>
        prev ? { ...prev, year: editForm.year, major: editForm.major } : null
      );
      setOpenModal(null);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-32">
        {/* HERO SECTION */}
        <div className="pt-16 pb-10 px-4 text-center bg-gradient-to-b from-orange-50 to-transparent">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 mx-auto shadow-xl ring-4 ring-white/60 flex items-center justify-center">
            <FaUser className="w-12 h-12 text-white" />
          </div>

          {/* Name & Campus */}
          <h1 className="mt-6 text-3xl font-black text-gray-900 tracking-tight">
            {user?.name || "Campus User"}
          </h1>
          <p className="mt-2 text-base font-semibold text-orange-600">
            {campus?.name || "Select Campus"}
          </p>

          {/* Email */}
          <div className="mt-5 inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm border border-blue-200">
            {profileData?.email || "No email"}
          </div>

          {/* Academic Info */}
          {(profileData?.year || profileData?.major) && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm border border-amber-200">
              {profileData.year && <span>{profileData.year}</span>}
              {profileData.year && profileData.major && <span>•</span>}
              {profileData.major && <span>{profileData.major}</span>}
            </div>
          )}

          {/* No Academic Info Message */}
          {!profileData?.year && !profileData?.major && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">No academic info added yet</p>
            </div>
          )}
        </div>

        {/* SETTINGS SECTION */}
        <div className="px-4 py-6 space-y-3">
          {/* Edit Profile */}
          <SettingRow
            icon="✏️"
            label="Edit Profile"
            value="Update your academic info"
            onTap={() => setOpenModal("edit-profile")}
          />

          <div className="h-px bg-gray-200 my-6" />

          {/* Account Settings */}
          <SettingRow
            icon="🔐"
            label="Account Settings"
            value={`Email: ${profileData?.email || "N/A"}`}
            onTap={() => setOpenModal("account")}
          />

          {/* Navigation Links */}
          <SettingRow
            icon="🔔"
            label="Notifications"
            value="Manage notification preferences"
            onTap={() => navigate("/notifications")}
          />
          <SettingRow
            icon="🛡️"
            label="Privacy & Safety"
            value="Review privacy settings"
            onTap={() => navigate("/privacy-policy")}
          />
          <SettingRow
            icon="📋"
            label="Terms & Conditions"
            value="Review terms of service"
            onTap={() => navigate("/terms-and-conditions")}
          />
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {openModal === "edit-profile" && (
          <ProfileEditModal
            onClose={() => setOpenModal(null)}
            onSave={handleSaveProfile}
            form={editForm}
            setForm={setEditForm}
            saving={saving}
          />
        )}
        {openModal === "account" && (
          <AccountModal
            onClose={() => setOpenModal(null)}
            profileData={profileData}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      <BottomNav openPostModal={() => {}} />
    </>
  );
};

// SETTING ROW COMPONENT
const SettingRow = ({ icon, label, value, onTap }: SettingRowProps) => (
  <button
    onClick={onTap}
    className="w-full bg-white rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-200 active:scale-95 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-xl">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-bold text-lg text-gray-900">{label}</p>
        {value && <p className="text-sm text-gray-600 mt-1">{value}</p>}
      </div>
    </div>
    <FaChevronRight className="text-gray-400 transition" />
  </button>
);

// EDIT PROFILE MODAL
interface ProfileEditModalProps {
  onClose: () => void;
  onSave: () => void;
  form: { year: string; major: string };
  setForm: (form: { year: string; major: string }) => void;
  saving: boolean;
}

const ProfileEditModal = ({
  onClose,
  onSave,
  form,
  setForm,
  saving,
}: ProfileEditModalProps) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 overflow-y-auto">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/40"
    />

    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative bg-white w-full max-w-lg shadow-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden my-auto sm:my-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-lg font-black text-gray-900">Edit Profile</h2>
        <button
          onClick={onClose}
          className="text-2xl text-gray-500 hover:text-gray-700 transition"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Year Input */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Year of Study
          </label>
          <input
            type="text"
            placeholder="e.g., 2nd Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>

        {/* Major Input */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Major / Course
          </label>
          <input
            type="text"
            placeholder="e.g., Computer Science"
            value={form.major}
            onChange={(e) => setForm({ ...form, major: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FaEdit className="text-sm" />
              Save Changes
            </>
          )}
        </button>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          disabled={saving}
          className="w-full py-3 bg-gray-200 text-gray-900 rounded-xl font-bold transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </div>
);

// ACCOUNT MODAL
interface AccountModalProps {
  onClose: () => void;
  profileData: ProfileData | null;
  onLogout: () => void;
}

const AccountModal = ({ onClose, profileData, onLogout }: AccountModalProps) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 overflow-y-auto">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/40"
    />

    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative bg-white w-full max-w-lg shadow-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden my-auto sm:my-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-lg font-black text-gray-900">Account Settings</h2>
        <button
          onClick={onClose}
          className="text-2xl text-gray-500 hover:text-gray-700 transition"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Email Section */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            Email Address
          </p>
          <p className="mt-2 text-lg font-bold text-gray-900">
            {profileData?.email || "Not set"}
          </p>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
            🔐 Security
          </p>
          <p className="mt-2 text-sm text-blue-900">
            Your account is secured with Supabase authentication. Use your email and password to sign in.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-2" />

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full py-4 bg-red-100 text-red-700 rounded-xl font-bold text-lg hover:bg-red-200 transition flex items-center justify-center gap-2"
        >
          <FaSignOutAlt className="text-sm" />
          Logout
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-200 text-gray-900 rounded-xl font-bold transition"
        >
          Close
        </button>
      </div>
    </motion.div>
  </div>
);

export default Profile;