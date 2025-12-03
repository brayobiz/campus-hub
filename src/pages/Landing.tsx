// src/pages/Landing.tsx — THE FINAL, LEGENDARY LANDING PAGE
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Sparkles,
  ArrowRight,
  Check
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* HERO — Pure fire */}
      <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-orange-600 via-red-600 to-purple-700 text-white">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply opacity-70"
            animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply opacity-70"
            animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-tight mb-6">
              Your Campus.<br />
              <span className="text-orange-300">Your Voice.</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-medium opacity-90 mb-10 max-w-4xl mx-auto">
              Confessions • Marketplace • Events • Food Deals<br />
              <span className="text-yellow-300 font-bold">The #1 app for Kenyan university students</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button
              onClick={() => navigate("/auth/login")}
              className="group bg-white text-orange-600 font-black text-xl sm:text-2xl px-12 py-6 rounded-full shadow-2xl hover:shadow-orange-400 hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              Join Free Now
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition" />
            </button>
            <div className="text-sm opacity-80">
              Used by <span className="font-bold text-2xl text-yellow-300">50,000+</span> students
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BY — Dynamic Kenyan campuses */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Trusted Across Kenya
          </h2>
          <p className="text-xl text-gray-600 mb-12">From KU to USIU — we're everywhere</p>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-8 items-center justify-center">
            {[
              { name: "KU", color: "from-orange-500 to-red-600" },
              { name: "UoN", color: "from-blue-600 to-indigo-700" },
              { name: "JKUAT", color: "from-green-500 to-emerald-600" },
              { name: "Strathmore", color: "from-purple-600 to-pink-600" },
              { name: "USIU", color: "from-yellow-500 to-orange-600" },
              { name: "Moi", color: "from-teal-500 to-cyan-600" },
              { name: "Egerton", color: "from-rose-500 to-pink-600" },
              { name: "100+", color: "from-gray-600 to-black" }
            ].map((uni) => (
              <motion.div
                key={uni.name}
                whileHover={{ scale: 1.2, rotate: 5 }}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${uni.color} flex items-center justify-center text-white font-black text-lg sm:text-2xl shadow-xl`}
              >
                {uni.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — Clean, powerful, Kenyan-focused */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black text-center text-gray-900 mb-16">
            Built for <span className="text-orange-600">Real Campus Life</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <MessageCircle className="w-16 h-16" />,
                title: "Anonymous Confessions",
                desc: "Speak your truth. Get real support. No judgment.",
                color: "from-orange-500 to-red-600",
                features: ["100% anonymous", "Instant replies", "Mental health safe"]
              },
              {
                icon: <ShoppingBag className="w-16 h-16" />,
                title: "Campus Marketplace",
                desc: "Buy & sell laptops, books, clothes — safely.",
                color: "from-blue-600 to-indigo-700",
                features: ["Verified students only", "Escrow protection", "Free listings"]
              },
              {
                icon: <Calendar className="w-16 h-16" />,
                title: "Events & Parties",
                desc: "Never miss a bash, seminar, or food fest again.",
                color: "from-green-500 to-emerald-600",
                features: ["RSVP & tickets", "Live updates", "Campus map"]
              }
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${feat.color} p-5 text-white mb-6`}>
                  {feat.icon}
                </div>
                <h3 className="text-3xl font-black mb-4">{feat.title}</h3>
                <p className="text-gray-600 text-lg mb-6">{feat.desc}</p>
                <ul className="space-y-3">
                  {feat.features.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700">
                      <Check className="w-6 h-6 text-green-500" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — Impossible to ignore */}
      <section className="py-24 px-6 bg-gradient-to-r from-orange-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-20 h-20 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-5xl sm:text-7xl font-black mb-6">
            Join 50,000+ Students Today
          </h2>
          <p className="text-2xl mb-10 opacity-90">
            Free forever. No ads. Built for Kenyan campuses.
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-white text-orange-600 font-black text-2xl sm:text-3xl px-16 py-8 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Start Now — It's Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;