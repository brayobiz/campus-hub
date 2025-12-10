// src/pages/Home.tsx — 2025 Modern Design
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import useModalStore from "../store/useModalStore";
import { FaSearch, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import featureFeed from "../data/featureFeed";
import { useCampusStore } from "../store/useCampusStore";
import { useUserStore } from "../store/useUserStore";

// featureFeed imported from shared data

const Home = () => {
  const campus = useCampusStore((s) => s.campus);
  const user = useUserStore((s) => s.user);
  const modalOpen = useModalStore((s: any) => s.postOpen);
  const openPostModal = useModalStore((s: any) => s.openPost);
  const closePostModal = useModalStore((s: any) => s.closePost);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pb-24">

      {/* PREMIUM HEADER */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-lg shadow-sm px-4 sm:px-6 py-4 flex justify-between items-center z-20 border-b border-gray-100">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            H
          </div>
          <h1 className="text-lg sm:text-xl font-black text-gray-900">Campus Hub</h1>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="text-xs sm:text-sm bg-gradient-to-r from-orange-100 to-rose-100 text-orange-700 px-4 py-2 rounded-full font-bold shadow-sm border border-orange-200">
          📍 {campus?.name || "Campus"}
        </motion.div>
      </header>

      {/* HERO SECTION — PREMIUM */}
      <section className="px-4 sm:px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-700" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 px-6 sm:px-8 py-10 sm:py-12 text-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
              {getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Student"}
              <span className="block mt-2 text-white text-opacity-95 font-extrabold">Welcome Back 👋</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base max-w-xl opacity-95 leading-relaxed flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-white/12 px-3 py-1 rounded-full text-white/90 font-semibold">
                <FaMapMarkerAlt />
                {campus?.short_name ?? campus?.name ?? "Campus"}
              </span>
              <span>Connect, explore, and engage with your campus community.</span>
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/explore")}
                className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-6 py-3 rounded-full font-bold shadow-lg transition"
              >
                Explore Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openPostModal()}
                className="bg-white/15 backdrop-blur-md border border-white/40 text-white px-6 py-3 rounded-full font-bold shadow-lg transition"
              >
                Create Post
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SEARCH BAR — ENHANCED */}
      <section className="px-4 sm:px-6 mt-8">
        <motion.div 
          whileFocus={{ scale: 1.02 }}
          className="flex items-center bg-white border-2 border-gray-200 shadow-lg rounded-2xl px-5 py-4 gap-3 hover:shadow-xl hover:border-gray-300 transition cursor-pointer"
          onClick={() => navigate("/explore")}
        >
          <FaSearch className="text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search events, food, notes, roommates..."
            className="outline-none flex-1 text-gray-700 placeholder-gray-400 text-sm sm:text-base font-medium"
            readOnly
          />
        </motion.div>
      </section>

      {/* FEATURES GRID — MODERN */}
      <section className="px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-gray-900">Explore Features</h3>
          <p className="mt-2 text-gray-600">Everything you need in one place</p>
        </div>
        
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureFeed.map((f: any, i: number) => (
            <motion.button
              key={i}
              layoutId={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -8 }}
              onClick={() => {
                const routes: Record<string, string> = {
                  Confessions: "/confessions",
                  Marketplace: "/marketplace",
                  Events: "/events",
                  Roommates: "/roommates",
                  "Food Delivery": "/food",
                  "Notes & Past Papers": "/notes",
                };
                navigate(routes[f.title] || "/");
              }}
              className={`relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-left h-full`}
            >
              {/* Premium gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-90 group-hover:opacity-100 transition`} />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-10 transition" />

              {/* Content */}
              <div className="relative z-10">
                <div className="inline-block p-3 rounded-2xl bg-white/90 text-orange-600 text-2xl shadow-sm group-hover:scale-110 transition transform">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg sm:text-xl font-black text-white drop-shadow-sm">{f.title}</h3>
                <p className="mt-2 text-sm text-white/95 leading-relaxed drop-shadow-sm">{f.description}</p>
                <div className="mt-4 flex items-center gap-2 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition">
                  Explore <span>→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>


      {/* POST MODAL — moved to global `PostModal` component */}

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
};

export default Home;
