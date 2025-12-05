import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Check if the error is related to invalid credentials or email not found
      if (error.message.includes("invalid login credentials")) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        setError("An error occurred. Please try again.");
      }
      return;
    }

    // Redirect to home if login is successful
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="opacity-90 mt-2 text-sm">
            Log in to continue exploring Campus Hub.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-6 border border-gray-100">
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-100 text-rose-600 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* EMAIL */}
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

            {/* PASSWORD */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                required
                placeholder="Password"
                className="bg-transparent outline-none flex-1 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-2xl font-medium hover:bg-orange-600 transition shadow-md"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-orange-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
