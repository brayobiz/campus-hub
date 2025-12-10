import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useUserStore } from "../../store/useUserStore";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaChevronLeft } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("🔐 [Login] Starting login...");
      console.log("🔐 [Login] Email:", email);
      
      // Development mode - allow demo login
      if (email === "demo@test.com" && password === "demo123") {
        console.log("✅ [Login] Demo login successful");
        setUser({
          id: "demo-user-id",
          email: "demo@test.com",
          name: "Demo User",
        });
        setSuccessMessage("Demo login successful! Redirecting...");
        setTimeout(() => navigate("/home"), 300);
        return;
      }
      
      // Create a timeout promise (15 seconds)
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Login timeout")), 15000)
      );

      let data, error;
      try {
        const result = await Promise.race([loginPromise, timeoutPromise]) as any;
        data = result?.data;
        error = result?.error;
      } catch (timeoutErr) {
        console.error("🕐 [Login] Login timed out:", timeoutErr);
        setLoading(false);
        setError("🔧 Supabase connection timeout. Tip: Try demo@test.com / demo123 for a demo session.");
        return;
      }

      setLoading(false);

      if (error) {
        console.error("❌ [Login] Login error:", error.message);
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setError("Email not confirmed. Check your inbox for the confirmation link.");
        } else if (error.message.toLowerCase().includes("invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(error.message || "An error occurred. Please try again.");
        }
        return;
      }

      console.log("✅ [Login] Login successful, redirecting...");
      
      // Set user in store
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.fullname,
        });
        setSuccessMessage("Welcome back! Redirecting...");
      }

      // Redirect immediately (don't wait for async operations)
      navigate("/home");
    } catch (err) {
      console.error("❌ [Login] Unexpected error:", err);
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setLoading(false);
    if (error) {
      setError("Failed to resend confirmation email.");
    } else {
      setSuccessMessage("Confirmation email resent! Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex flex-col">
      {/* Header with back button */}
      <div className="p-6 sm:p-8">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/70 hover:text-white transition"
        >
          <FaChevronLeft className="text-lg" />
          <span className="font-medium">Back</span>
        </motion.button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Title Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl">
                H
              </div>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Welcome Back</h1>
            <p className="text-orange-200 text-lg">
              Log in to your Campus Hub account
            </p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleLogin}
            className="space-y-5 bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20"
          >
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4"
              >
                <p className="text-red-200 text-sm font-medium">{error}</p>
                {error.includes("not confirmed") && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="text-red-300 underline text-xs mt-2 hover:text-red-200 transition"
                  >
                    Resend confirmation email
                  </button>
                )}
              </motion.div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 rounded-2xl p-4"
              >
                <p className="text-green-200 text-sm font-medium">{successMessage}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-3">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/60 group-focus-within:text-orange-400 transition" />
                <input
                  type="email"
                  required
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-white/40 focus:bg-white/10 focus:border-orange-500/50 focus:outline-none transition text-base"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-3">
                Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/60 group-focus-within:text-orange-400 transition" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-white placeholder-white/40 focus:bg-white/10 focus:border-orange-500/50 focus:outline-none transition text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400/60 hover:text-orange-400 transition"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white font-black text-lg py-4 rounded-2xl shadow-2xl shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/5 text-white/60">New to Campus Hub?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link to="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg py-3.5 rounded-2xl transition-all duration-300"
              >
                Create Account
              </motion.button>
            </Link>
          </motion.form>

          {/* Footer text */}
          <p className="text-center text-white/60 text-sm mt-8">
            By signing in, you agree to our{" "}
            <a href="#" className="text-orange-400 hover:text-orange-300 underline">
              Terms of Service
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
