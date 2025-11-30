// src/pages/Explore.tsx — 1 MONTH FREE EDITION (FINAL)
import { motion } from "framer-motion";
import { FaSearch, FaCrown, FaFire, FaLock, FaRocket, FaShoppingBag, FaCalendarAlt, FaBookOpen, FaHome, FaStar } from "react-icons/fa";
import BottomNav from "../components/BottomNav";

const Explore = () => {
  const isPremium = false; // flip to true when user actually has premium

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-orange-100">
        <div className="px-6 py-5">
          <h1 className="text-3xl font-black text-gray-900">Discover</h1>
          <p className="text-orange-600 font-semibold -mt-1">What’s hot on campus today</p>
        </div>
      </header>

      {/* Hero Search */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" />
          <input
            type="text"
            placeholder="Search confessions, food, events..."
            className="w-full pl-16 pr-8 py-6 bg-white rounded-3xl shadow-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-lg font-medium"
            readOnly
          />
        </motion.div>
      </div>

      {/* Intro Card */}
      <section className="px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-4xl p-8 border border-orange-200/50 shadow-xl text-center"
        >
          <FaCrown className="text-7xl text-orange-500 mx-auto mb-5 drop-shadow-lg" />
          <h2 className="text-2xl font-black text-gray-900 mb-4">Campus Hub</h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-md mx-auto">
            Private app for <span className="font-bold text-orange-600">Kenyan university students only</span>.
            Verified with your <span className="font-bold">.ac.ke</span> email.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div><p className="text-3xl font-black text-orange-600">50K+</p><p className="text-sm text-gray-600">Students</p></div>
            <div><p className="text-3xl font-black text-orange-600">100%</p><p className="text-sm text-gray-600">Verified</p></div>
            <div><p className="text-3xl font-black text-orange-600">24/7</p><p className="text-sm text-gray-600">Active</p></div>
          </div>
        </motion.div>
      </section>

      {/* Trending Section */}
      <section className="px-6 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <FaFire className="text-3xl text-orange-500" />
            Trending Now
          </h2>
          {!isPremium && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg">
              PREMIUM ONLY
            </div>
          )}
        </div>

        {isPremium ? (
          <div className="space-y-4">
            <TrendingItem icon={<FaShoppingBag />} title="iPhone 15 Pro Max – KSh 125k" tag="Marketplace" views="2.8k" />
            <TrendingItem icon={<FaCalendarAlt />} title="End of Semester Bash @ Kileleshwa" tag="Event" views="4.2k" />
            <TrendingItem icon={<FaBookOpen />} title="All Engineering Units Notes 2025" tag="Notes" views="2.1k" />
            <TrendingItem icon={<FaHome />} title="Single room in Ngumo – KSh 7k" tag="Roommate" views="1.7k" />
          </div>
        ) : (
          <>
            {/* Locked Cards */}
            <div className="space-y-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/60 backdrop-blur-md rounded-3xl p-6 flex items-center justify-between border-2 border-dashed border-orange-300 shadow-inner"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-300/50 rounded-2xl animate-pulse" />
                    <div>
                      <div className="h-6 bg-gray-300 rounded-xl w-64 animate-pulse mb-3" />
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    </div>
                  </div>
                  <FaLock className="text-2xl text-orange-400" />
                </motion.div>
              ))}
            </div>

            {/* 1 MONTH FREE UPGRADE CARD */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-10 text-center text-white shadow-2xl overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <FaRocket className="text-6xl mx-auto mb-5" />
                <h3 className="text-3xl font-black mb-3">Go Premium</h3>
                <p className="text-xl opacity-95 mb-6">
                  See trending posts • Post in Marketplace & Events • No ads
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-2xl line-through opacity-70">KSh 599</span>
                  <span className="text-5xl font-black ml-3">KSh 299</span>
                  <span className="block text-lg mt-2">per month</span>
                </div>

                {/* 1 MONTH FREE BANNER */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl py-3 px-6 mb-8 inline-block">
                  <p className="text-2xl font-black">1 MONTH FREE</p>
                  <p className="text-sm opacity-90">when you subscribe today</p>
                </div>

                <button className="w-full py-11/12 mx-auto py-6 bg-white text-orange-600 font-black text-xl rounded-2xl shadow-2xl hover:shadow-orange-300 transition">
                  Start 1 Month Free Trial
                </button>

                <p className="text-xs opacity-80 mt-4">Cancel anytime • No card needed now</p>
              </div>
            </motion.div>
          </>
        )}
      </section>

      <BottomNav openPostModal={() => {}} />
    </div>
  );
};

const TrendingItem = ({ icon, title, tag, views }: any) => (
  <motion.div
    whileTap={{ scale: 0.97 }}
    className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center gap-5"
  >
    <div className="p-4 bg-orange-100 rounded-2xl text-orange-600 text-2xl">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          {tag}
        </span>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <FaStar className="text-yellow-500" /> {views} views
        </span>
      </div>
    </div>
    <div className="text-3xl text-gray-300">Right Arrow</div>
  </motion.div>
);

export default Explore;