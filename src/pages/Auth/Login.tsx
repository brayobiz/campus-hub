import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { withTimeout } from "../../lib/promiseUtils";
import { useUserStore } from "../../store/useUserStore";
import { useAuthStore } from "../../store/useAuthStore";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaChevronLeft } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const authLoading = useUserStore((s) => s.authLoading);
  const setAuthLoading = useUserStore((s) => s.setAuthLoading);
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResendConfirmation = async () => {
    try {
      const result: any = await withTimeout(
        supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/campuspicker`,
          },
        }),
        9000,
        'resend confirmation timed out'
      );

      const error = result?.error ?? null;

      if (error) {
        console.error('Resend confirmation error:', error);
        setError('Failed to resend confirmation email: ' + (error.message || String(error)));
      } else {
        setSuccessMessage('Confirmation email sent! Check your inbox.');
      }
    } catch (err: any) {
      console.error('Error resending confirmation:', err);
      const message = err?.message || String(err);
      if (message.includes('NOT_FOUND') || message.includes('404')) {
        setError('Failed to resend confirmation: authentication service not found. Check Supabase configuration.');
      } else {
        setError('Failed to resend confirmation email. Please try again.');
      }
    }
  };

  const login = useAuthStore((s) => s.login);
  const authError = useAuthStore((s) => s.error);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setAuthLoading(true);

    if (!email || !password) {
      setError("Please enter email and password");
      setAuthLoading(false);
      return;
    }

    try {
      console.log("🔐 [Login] Starting login via AuthStore...");
      const ok = await login(email, password);

      if (!ok) {
        // Prefer store error if available. Use getState to get the latest value set by the async action.
        const storeError = (useAuthStore as any).getState().error;
        const msg = storeError || "Login failed. Please try again.";

        // Detect common Supabase not found / 404 responses and show actionable text
        if (typeof msg === "string" && (msg.includes("NOT_FOUND") || msg.includes("404"))) {
          setError(
            "Login failed: authentication service not found (404). Please check your Supabase URL and keys in your environment configuration."
          );
          console.error("Login failure details:", msg);
        } else {
          setError(msg);
        }

        setAuthLoading(false);
        return;
      }

      // On success, the AuthStore will have populated the user state
      setSuccessMessage("Login successful! Redirecting...");
      setAuthLoading(false);

      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (err: any) {
      console.error("❌ [Login] Unexpected error:", err);

      // Handle some Supabase error shapes more gracefully
      const message = err?.message || String(err);
      if (message.includes("NOT_FOUND") || message.includes("404")) {
        setError("Login failed: authentication endpoint not found. Check Supabase URL or keys.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      setAuthLoading(false);
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
                  placeholder="harryokoth@gmail.com"
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
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 text-white font-black text-lg py-4 rounded-2xl shadow-2xl shadow-orange-500/50 transition-all duration-300 flex items-center justify-center gap-2 mt-8"
            >
              {authLoading ? (
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
