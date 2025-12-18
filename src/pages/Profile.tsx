import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { FaUser, FaChevronRight, FaSignOutAlt, FaEdit, FaExclamationCircle, FaSync, FaCheckCircle } from "react-icons/fa";
import { useUserStore } from "../store/useUserStore";
import { useCampusStore } from "../store/useCampusStore";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileData {
  id: string;
  email: string;
  year?: string;
  major?: string;
  campus_id?: number;
  show_all_campuses?: boolean;
}

interface UserPreferences {
  show_all_campuses: boolean;
  notifications_enabled: boolean;
  profile_visibility: "private" | "public";
}

interface ErrorState {
  hasError: boolean;
  message: string;
  type: "load" | "save" | "logout" | null;
  actionLabel?: string;
}

interface SuccessMessage {
  show: boolean;
  message: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

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
  const [preferences, setPreferences] = useState<UserPreferences>({
    show_all_campuses: false,
    notifications_enabled: true,
    profile_visibility: "public",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: "",
    type: null,
  });
  const [retryCount, setRetryCount] = useState(0);
  const [success, setSuccess] = useState<SuccessMessage>({ show: false, message: "" });
  const [openModal, setOpenModal] = useState<"edit-profile" | "account" | "preferences" | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ year: "", major: "" });
const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Validate form inputs
  const validateProfileForm = (): boolean => {
    const yearTrimmed = editForm.year.trim();
    const majorTrimmed = editForm.major.trim();

    if (!yearTrimmed) {
      setError({
        hasError: true,
        message: "Year of study is required",
        type: "save",
      });
      return false;
    }

    if (!majorTrimmed) {
      setError({
        hasError: true,
        message: "Major/Course is required",
        type: "save",
      });
      return false;
    }

    if (yearTrimmed.length > 100) {
      setError({
        hasError: true,
        message: "Year of study is too long (max 100 characters)",
        type: "save",
      });
      return false;
    }

    if (majorTrimmed.length > 100) {
      setError({
        hasError: true,
        message: "Major/Course is too long (max 100 characters)",
        type: "save",
      });
      return false;
    }

    return true;
  };

  useEffect(() => {
    loadProfileData();
  }, [user?.id]);

  const loadProfileData = useCallback(async (isRetry = false) => {
    try {
      setError({ hasError: false, message: "", type: null });
      if (!isRetry) setLoading(true);

      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        // Profile not found is okay (new user)
        if (fetchError.code === "PGRST116") {
          const newProfile: ProfileData = {
            id: user.id,
            email: user.email || "",
            year: "",
            major: "",
            show_all_campuses: false,
          };
          setProfileData(newProfile);
          setRetryCount(0);
        } else {
          throw new Error(
            fetchError.message || "Failed to load profile. Please try again."
          );
        }
      } else if (data) {
        setProfileData(data);
        setEditForm({
          year: data.year || "",
          major: data.major || "",
        });
        setPreferences({
          show_all_campuses: data.show_all_campuses || false,
          notifications_enabled: true,
          profile_visibility: "public",
        });
        setRetryCount(0);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load profile. Please check your connection.";
      
      setError({
        hasError: true,
        message: errorMessage,
        type: "load",
        actionLabel: retryCount < MAX_RETRIES ? "Try Again" : "Close",
      });
      console.error("Profile load error:", err);

      // Auto-retry with exponential backoff
      if (retryCount < MAX_RETRIES && !isRetry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          loadProfileData(true);
        }, RETRY_DELAY * Math.pow(2, retryCount));
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, retryCount]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(0);
    setError({ hasError: false, message: "", type: null });
    loadProfileData(true);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    // Validate before saving
    if (!validateProfileForm()) {
      return;
    }

    setSaving(true);
    setError({ hasError: false, message: "", type: null });

    try {
      // Optimistic update
      const updatedProfile: ProfileData = {
        ...profileData!,
        year: editForm.year.trim(),
        major: editForm.major.trim(),
      };
      setProfileData(updatedProfile);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          year: editForm.year.trim(),
          major: editForm.major.trim(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setOpenModal(null);
      setSuccess({
        show: true,
        message: "Profile updated successfully!",
      });

      // Auto-hide success message
      setTimeout(() => {
        setSuccess({ show: false, message: "" });
      }, 3000);

      console.log("Profile saved successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save profile. Please try again.";
      setError({
        hasError: true,
        message: errorMessage,
        type: "save",
      });
      // Revert optimistic update on error
      loadProfileData(true);
      console.error("Profile save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.id) return;
    setSaving(true);
    setError({ hasError: false, message: "", type: null });

    try {
      // Optimistic update
      setProfileData((prev) =>
        prev ? { ...prev, show_all_campuses: preferences.show_all_campuses } : null
      );

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          show_all_campuses: preferences.show_all_campuses,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setOpenModal(null);
      setSuccess({
        show: true,
        message: "Preferences updated successfully!",
      });

      // Auto-hide success message
      setTimeout(() => {
        setSuccess({ show: false, message: "" });
      }, 3000);

      console.log("Preferences saved successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save preferences. Please try again.";
      setError({
        hasError: true,
        message: errorMessage,
        type: "save",
      });
      // Revert optimistic update
      loadProfileData(true);
      console.error("Preferences save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setSaving(true);
      setError({ hasError: false, message: "", type: null });
      
      // Sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      // Clear Zustand stores
      const { clearUser } = useUserStore.getState();
      const { clearCampus } = useCampusStore.getState();
      clearUser?.();
      clearCampus?.();

      // Navigate to home
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to logout. Please try again.";
      setError({
        hasError: true,
        message: errorMessage,
        type: "logout",
      });
      console.error("Logout error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Load error state
  if (error.hasError && error.type === "load") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          {retryCount < MAX_RETRIES && (
            <p className="text-xs text-gray-500 mb-4">
              Retrying... (Attempt {retryCount + 1} of {MAX_RETRIES + 1})
            </p>
          )}
          <button
            onClick={handleRetry}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSync className="text-sm" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-32">
        {/* Global Success Alert */}
        <AnimatePresence>
          {success.show && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-40 mx-4 mt-4"
            >
              <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-green-900">{success.message}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Alert */}
        <AnimatePresence>
          {error.hasError && (error.type === "save" || error.type === "logout") && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-40 mx-4 mt-4"
            >
              <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <FaExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-red-900">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error.message}</p>
                </div>
                <button
                  onClick={() =>
                    setError({ hasError: false, message: "", type: null })
                  }
                  className="text-red-600 hover:text-red-800 font-bold text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

          {/* Academic Info - Moved up, email removed */}
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
          {/* PROFILE SECTION */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Profile</p>
            <div className="space-y-2">
              <SettingRow
                icon="✏️"
                label="Edit Profile"
                value="Update your academic info"
                onTap={() => setOpenModal("edit-profile")}
              />
              <SettingRow
                icon="🔐"
                label="Account Settings"
                value="Email & security"
                onTap={() => setOpenModal("account")}
              />
            </div>
          </div>

          <div className="h-px bg-gray-200 my-6" />

          {/* PREFERENCES SECTION */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Preferences</p>
            <div className="space-y-2">
              <SettingRow
                icon="🌍"
                label="Feed Scope"
                value={preferences.show_all_campuses ? "All campuses" : "Your campus only"}
                onTap={() => setOpenModal("preferences")}
              />
              <SettingRow
                icon="🔔"
                label="Notifications"
                value="Manage notification preferences"
                onTap={() => navigate("/notifications")}
              />
            </div>
          </div>

          <div className="h-px bg-gray-200 my-6" />

          {/* LEGAL SECTION */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Legal</p>
            <div className="space-y-2">
              <SettingRow
                icon="🛡️"
                label="Privacy Policy"
                value="How we use your data"
                onTap={() => navigate("/privacy-policy")}
              />
              <SettingRow
                icon="📋"
                label="Terms of Service"
                value="Terms & conditions"
                onTap={() => navigate("/terms-and-conditions")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {openModal === "edit-profile" && (
          <ProfileEditModal
            onClose={() => setOpenModal(null)}
            onSave={handleSaveProfile}
            onLogout={handleLogout}
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
            saving={saving}
          />
        )}
        {openModal === "preferences" && (
          <PreferencesModal
            onClose={() => setOpenModal(null)}
            onSave={handleSavePreferences}
            preferences={preferences}
            setPreferences={setPreferences}
            saving={saving}
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
  onLogout: () => Promise<void> | void;
  form: { year: string; major: string };
  setForm: (form: { year: string; major: string }) => void;
  saving: boolean;
}

const ProfileEditModal = ({
  onClose,
  onSave,
  onLogout,
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
          disabled={saving}
          className="text-2xl text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Year Input */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Year of Study <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., 2nd Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            disabled={saving}
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">{form.year.length}/100 characters</p>
        </div>

        {/* Major Input */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Major / Course <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Computer Science"
            value={form.major}
            onChange={(e) => setForm({ ...form, major: e.target.value })}
            disabled={saving}
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">{form.major.length}/100 characters</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
         {saving ? (
           <>
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
             Saving...
           </>
         ) : (
           "Save Changes"
         )}
        </button>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          disabled={saving}
          className="w-full py-3 bg-gray-200 text-gray-900 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
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
  onLogout: () => Promise<void> | void;
  saving: boolean;
}

const AccountModal = ({ onClose, profileData, onLogout, saving }: AccountModalProps) => (
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
          disabled={saving}
          className="text-2xl text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
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
          onClick={() => void onLogout()}
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

// PREFERENCES MODAL
interface PreferencesModalProps {
  onClose: () => void;
  onSave: () => void;
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  saving: boolean;
}

const PreferencesModal = ({
  onClose,
  onSave,
  preferences,
  setPreferences,
  saving,
}: PreferencesModalProps) => (
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
        <h2 className="text-lg font-black text-gray-900">Feed Preferences</h2>
        <button
          onClick={onClose}
          className="text-2xl text-gray-500 hover:text-gray-700 transition"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Feed Scope Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-4">
            🌍 What content would you like to see?
          </label>
          <div className="space-y-3">
            {/* Own Campus Option */}
                  <button
                    disabled={saving}
              onClick={() =>
                setPreferences({ ...preferences, show_all_campuses: false })
              }
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                !preferences.show_all_campuses
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !preferences.show_all_campuses
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {!preferences.show_all_campuses && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Your Campus Only</p>
                  <p className="text-xs text-gray-600 mt-1">
                    See posts only from your selected campus
                  </p>
                </div>
              </div>
            </button>

            {/* All Campuses Option */}
                  <button
                    disabled={saving}
              onClick={() =>
                setPreferences({ ...preferences, show_all_campuses: true })
              }
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                preferences.show_all_campuses
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-orange-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    preferences.show_all_campuses
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {preferences.show_all_campuses && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">All Campuses</p>
                  <p className="text-xs text-gray-600 mt-1">
                    See posts from all campuses in your network
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
            💡 Tip
          </p>
          <p className="text-sm text-blue-900">
            You can always change this setting later from your preferences.
          </p>
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
            "Save Preferences"
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

export default Profile;