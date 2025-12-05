// src/pages/Home.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
  FaSearch,
  FaUtensils,
  FaStore,
  FaHeart,
  FaCalendarAlt,
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";
import { useCampusStore } from "../store/useCampusStore";

const featureFeed = [
  { title: "Confessions", icon: <FaHeart />, color: "bg-rose-500", description: "Share your thoughts anonymously" },
  { title: "Marketplace", icon: <FaStore />, color: "bg-emerald-500", description: "Buy and sell campus essentials" },
  { title: "Events", icon: <FaCalendarAlt />, color: "bg-sky-500", description: "Discover upcoming happenings" },
  { title: "Roommates", icon: <FaUsers />, color: "bg-violet-500", description: "Find your perfect roommate" },
  { title: "Food Delivery", icon: <FaUtensils />, color: "bg-orange-500", description: "Order food from nearby restaurants" },
  { title: "Notes & Past Papers", icon: <FaBookOpen />, color: "bg-indigo-500", description: "Access study materials" },
];

const Home = () => {
  const campus = useCampusStore((s) => s.campus);
  const [openPostModal, setOpenPostModal] = useState(false);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm px-4 sm:px-6 py-4 flex justify-between items-center z-20">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Campus Hub</h1>
        <div className="text-xs sm:text-sm bg-orange-100 text-orange-600 px-3 sm:px-4 py-1.5 rounded-full font-medium shadow">
          {campus?.name || "Campus"}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-4 sm:px-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">
            {getGreeting()},  
            <span className="block mt-1 opacity-90">Welcome back 👋</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base opacity-90">
            Explore everything happening at <span className="font-semibold">{campus?.name}</span>.
          </p>

          <button
            onClick={() => navigate("/explore")}
            className="mt-5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 text-sm sm:text-base font-medium hover:bg-white/30 transition"
          >
            Start Exploring
          </button>
        </motion.div>
      </section>

      {/* SEARCH BAR */}
      <section className="px-4 sm:px-6 mt-6">
        <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 gap-3 hover:shadow-md transition cursor-pointer"
             onClick={() => navigate("/explore")}>
          <FaSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search events, food, notes..."
            className="outline-none flex-1 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
            readOnly
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureFeed.map((f, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
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
            className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg border border-gray-100 cursor-pointer transition"
          >
            <div className={`${f.color} p-4 rounded-xl text-white shadow-lg text-lg sm:text-xl`}>
              {f.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">{f.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* POST MODAL */}
      {openPostModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50"
          onClick={() => setOpenPostModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl"
          >
            <h2 className="text-lg sm:text-xl font-bold text-center mb-6">
              What do you want to post?
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {featureFeed.map((f, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setOpenPostModal(false);
                    const routes: Record<string, string> = {
                      Confessions: "/confessions/post",
                      Marketplace: "/marketplace/new",
                      Events: "/events/new",
                      Roommates: "/roommates/new",
                      "Food Delivery": "/food/new",
                      "Notes & Past Papers": "/notes/new",
                    };
                    navigate(routes[f.title] || "/");
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-white font-medium shadow-md hover:shadow-xl transition ${f.color}`}
                >
                  <span className="text-xl sm:text-2xl">{f.icon}</span>
                  <span className="text-sm sm:text-base">{f.title}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpenPostModal(false)}
              className="mt-6 w-full py-3 text-gray-600 font-medium"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <BottomNav openPostModal={() => setOpenPostModal(true)} />
    </div>
  );
};

export default Home;
