// src/pages/Auth/Login.tsx — Final Production Version
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, Shield, Zap, Users } from "lucide-react";

import { supabase } from "../../lib/supabaseClient";

const ALLOWED_DOMAINS = [
  "ku.ac.ke", "uonbi.ac.ke", "students.uonbi.ac.ke",
  "strathmore.edu", "jkuat.ac.ke", "mku.ac.ke", "dkut.ac.ke", "ttu.ac.ke"
];

const Login = () => {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value: string): string | null => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
    const domain = value.split("@")[1]?.toLowerCase();
    if (!domain || !ALLOWED_DOMAINS.some(d => domain.endsWith(d))) {
      return "Please use your official campus email";
    }
    return null;
  };

  useEffect(() => {
    const err = validateEmail(email);
    setError(err);
    setIsValid(!err && email.trim() !== "");
  }, [email]);

  useEffect(() => {
    setEmail("");
    setError(null);
    setIsValid(false);
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    const  {error} = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setError(error.message);
    } else {
      alert(`Magic link sent to ${email}. Please check your inbox.`);
      setEmail("");
    }

    navigate("/auth/check-email", { state: { email, action: activeTab } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-orange-100">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl shadow-lg">
              <Mail className="w-12 h-12 text-[#F97316]" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
            {activeTab === "signIn" ? "Welcome Back" : "Join Campus Hub"}
          </h1>
          <p className="text-center text-gray-600 mb-8 max-w-xs mx-auto">
            The private social platform for Kenyan university students
          </p>

          {/* Clean Separate Buttons */}
          <div className="flex justify-center gap-5 mb-10">
            <button
              onClick={() => setActiveTab("signIn")}
              className={`px-10 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                activeTab === "signIn"
                  ? "bg-[#F97316] text-white shadow-xl shadow-orange-200"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signUp")}
              className={`px-10 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                activeTab === "signUp"
                  ? "bg-[#F97316] text-white shadow-xl shadow-orange-200"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@ku.ac.ke"
                className={`w-full px-6 py-5 rounded-2xl border-2 text-lg focus:outline-none transition-all ${
                  error
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                }`}
              />
              {error && (
                <p className="text-red-600 text-sm text-center mt-2 font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-5 rounded-2xl font-bold text-xl text-white transition-all shadow-lg ${
                isValid && !isLoading
                  ? "bg-gradient-to-r from-[#F97316] to-orange-600 hover:from-orange-600 hover:to-amber-600 hover:shadow-2xl"
                  : "bg-orange-300 cursor-not-allowed"
              } flex items-center justify-center gap-3`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Sending Link...
                </>
              ) : activeTab === "signIn" ? (
                "Send Magic Link"
              ) : (
                "Create My Account"
              )}
            </button>
          </form>

          {/* Trust & Benefits Section */}
          <div className="mt-12 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Zap className="w-8 h-8 text-[#F97316] mb-2" />
                <p className="text-xs font-medium text-gray-700">Instant Access</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-[#F97316] mb-2" />
                <p className="text-xs font-medium text-gray-700">Private & Safe</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-[#F97316] mb-2" />
                <p className="text-xs font-medium text-gray-700">Students Only</p>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                How it works
              </p>
              <ol className="text-xs text-gray-600 space-y-1.5">
                <li>1. Enter your campus email</li>
                <li>2. We send you a secure magic link</li>
                <li>3. Click the link → you’re in! (no password)</li>
              </ol>
            </div>

            <p className="text-center text-xs text-gray-500 mt-8">
              By continuing, you agree to our{" "}
              <a href="#" className="underline font-medium">Terms of Service</a> and{" "}
              <a href="#" className="underline font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;