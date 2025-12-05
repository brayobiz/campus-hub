import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  // --- PASSWORD STRENGTH LOGIC ---
  const evaluateStrength = (pw: string) => {
    if (pw.length < 6) return "Weak";
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/) && pw.length >= 8) return "Strong";
    return "Medium";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordStrength(evaluateStrength(value));
  };

  // --- SIGNUP HANDLER ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullname },
      },
    });

    setLoading(false);

    if (error) return setError(error.message);

    navigate("/auth/campuspicker");
  };

  // --- PASSWORD STRENGTH COLORS ---
  const strengthColor =
    passwordStrength === "Strong"
      ? "text-green-600"
      : passwordStrength === "Medium"
      ? "text-orange-500"
      : passwordStrength === "Weak"
      ? "text-rose-500"
      : "text-gray-400";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="opacity-90 mt-2 text-sm">
            Join your campus community today.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-6 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSignup}>
            {error && (
              <div className="bg-rose-100 text-rose-600 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* FULL NAME FIELD */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                required
                placeholder="Full name"
                className="bg-transparent outline-none flex-1 text-sm"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            {/* EMAIL FIELD */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                required
                placeholder="Email"
                className="bg-transparent outline-none flex-1 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex items-center">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="Password"
                className="bg-transparent outline-none flex-1 text-sm"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-400 ml-3"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* PASSWORD STRENGTH */}
            {password.length > 0 && (
              <p className={`text-xs font-medium ${strengthColor}`}>
                Strength: {passwordStrength}
              </p>
            )}

            {/* CONFIRM PASSWORD FIELD */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex items-center">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showConfirmPass ? "text" : "password"}
                required
                placeholder="Confirm password"
                className="bg-transparent outline-none flex-1 text-sm"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="text-gray-400 ml-3"
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-2xl font-medium hover:bg-orange-600 transition shadow-md"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER LINK */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-orange-600 font-medium">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
