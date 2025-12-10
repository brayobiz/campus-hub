import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowRight, FaChevronLeft, FaCheck, FaRocket } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password strength evaluation
  const evaluateStrength = (pw: string) => {
    if (pw.length < 6) return "Weak";
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/) && pw.length >= 8) return "Strong";
    return "Medium";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(evaluateStrength(value));
  };

  // Signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔐 [SignUp] Starting signup...");
      console.log("🔐 [SignUp] Email:", email);
      
      // Development mode - allow demo signup
      if (email === "demo@test.com") {
        console.log("✅ [SignUp] Demo signup successful");
        setSuccessMessage(
          "Demo account created! You can now log in with demo@test.com / demo123"
        );
        setTimeout(() => navigate("/auth/login"), 1500);
        return;
      }
      
      // Create a timeout promise (15 seconds)
      const signupPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: { fullname },
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Signup timeout")), 15000)
      );

      let data, error;
      try {
        const result = await Promise.race([signupPromise, timeoutPromise]) as any;
        data = result?.data;
        error = result?.error;
      } catch (timeoutErr) {
        console.error("🕐 [SignUp] Signup timed out:", timeoutErr);
        setLoading(false);
        setError("🔧 Supabase connection timeout. Tip: Try demo@test.com for a demo account.");
        return;
      }

      setLoading(false);

      if (error) {
        console.error("❌ [SignUp] Signup error:", error.message);
        return setError(error.message);
      }

      console.log("✅ [SignUp] Signup successful, creating profile...");

      // Create profile entry in database (non-blocking)
      if (data.user) {
        supabase.from("profiles").insert({
          id: data.user.id,
          email,
          name: fullname,
        }).then(({ error: profileError }: { error: any }) => {
          if (profileError) {
            console.error("Profile creation error:", profileError);
          } else {
            console.log("✅ [SignUp] Profile created");
          }
        });
      }

      setSuccessMessage(
        "Account created! Check your email to confirm your account, then select your campus."
      );
      
      // Navigate immediately without waiting
      navigate("/auth/campuspicker");
    } catch (err) {
      console.error("❌ [SignUp] Unexpected error:", err);
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  // Strength color mapping
  const strengthColor =
    passwordStrength === "Strong"
      ? "text-green-400"
      : passwordStrength === "Medium"
      ? "text-amber-400"
      : "text-red-400";

  const strengthBg =
    passwordStrength === "Strong"
      ? "bg-green-500/20"
      : passwordStrength === "Medium"
      ? "bg-amber-500/20"
      : "bg-red-500/20";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
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
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl">
                <FaRocket />
              </div>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Join Us</h1>
            <p className="text-purple-200 text-lg">
              Create your Campus Hub account in seconds
            </p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSignup}
            className="space-y-4 bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20"
          >
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4"
              >
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 rounded-2xl p-4 flex items-start gap-3"
              >
                <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
                <p className="text-green-200 text-sm font-medium">{successMessage}</p>
              </motion.div>
            )}

            {/* Full Name Field */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Full Name
              </label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60 group-focus-within:text-purple-400 transition" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60 group-focus-within:text-purple-400 transition" />
                <input
                  type="email"
                  required
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60 group-focus-within:text-purple-400 transition" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400/60 hover:text-purple-400 transition"
                >
                  {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`flex-1 h-2 rounded-full ${strengthBg}`} />
                  <span className={`text-xs font-bold ${strengthColor}`}>
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60 group-focus-within:text-purple-400 transition" />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:bg-white/10 focus:border-purple-500/50 focus:outline-none transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400/60 hover:text-purple-400 transition"
                >
                  {showConfirmPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white font-black text-lg py-4 rounded-2xl shadow-2xl shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/5 text-white/60">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link to="/auth/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg py-3 rounded-2xl transition-all duration-300"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.form>

          {/* Footer text */}
          <p className="text-center text-white/60 text-xs mt-6">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300 underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
