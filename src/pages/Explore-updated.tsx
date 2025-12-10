// src/pages/Explore.tsx — 1 MONTH FREE EDITION (FINAL)
import { motion } from "framer-motion";
import { FaSearch, FaCrown, FaFire, FaShoppingBag, FaCalendarAlt, FaBookOpen, FaHome, FaStar } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import featureFeed from "../data/featureFeed";
import { marketplacePosts } from "../data/marketplace";
import { roommatePosts } from "../data/roommates";

const Explore = () => {
  // Populate the Explore page with multiple content sections

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-orange-100">
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Discover</h1>
          <p className="text-orange-600 font-semibold text-sm -mt-1">What's hot on campus today</p>
        </div>
      </header>

      {/* Hero Search */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <FaSearch className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl sm:text-2xl" />
          <input
            type="text"
            inputMode="search"
            placeholder="Search confessions, food, events..."
            className="w-full pl-12 sm:pl-16 pr-4 sm:pr-8 py-3 sm:py-4 bg-white rounded-3xl shadow-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-sm sm:text-lg font-medium min-w-0"
            // Make focusable on mobile so keyboard appears
          />
        </motion.div>
      </div>

      {/* Intro Card */}
      <section className="px-4 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-3xl sm:rounded-4xl p-6 sm:p-8 border border-orange-200/50 shadow-xl text-center"
        >
          <FaCrown className="text-3xl sm:text-5xl text-orange-500 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Campus Hub</h2>
          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed max-w-md mx-auto">
            Private app for <span className="font-bold text-orange-600">Kenyan university students only</span>.
            Verified with your <span className="font-bold">.ac.ke</span> email.
          </p>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div><p className="text-2xl sm:text-3xl font-black text-orange-600">50K+</p><p className="text-xs sm:text-sm text-gray-600">Students</p></div>
            <div><p className="text-2xl sm:text-3xl font-black text-orange-600">100%</p><p className="text-xs sm:text-sm text-gray-600">Verified</p></div>
            <div><p className="text-2xl sm:text-3xl font-black text-orange-600">24/7</p><p className="text-xs sm:text-sm text-gray-600">Active</p></div>
          </div>
        </motion.div>
      </section>

        {/* Feature Grid */}
        <section className="px-4 sm:px-6 mt-6 sm:mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {featureFeed.map((f, i) => (
              <div
                key={i}
                className={`p-3 sm:p-4 rounded-2xl ${f.bg} border border-gray-100 shadow-sm hover:scale-105 transition-transform`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-white/95 text-orange-600 text-lg sm:text-2xl shadow-sm flex-shrink-0">{f.icon}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-xs sm:text-sm break-words">{f.title}</div>
                    <div className="text-xs text-gray-600 hidden sm:block">{f.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Marketplace Preview */}
        <section className="px-4 sm:px-6 mt-8 sm:mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-black">Marketplace</h3>
            <p className="text-xs sm:text-sm text-gray-500">Top deals near you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {marketplacePosts.slice(0, 4).map((m: any) => (
              <div key={m.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-md border">
                <div className="flex gap-3 sm:gap-4 items-start">
                  <img src={m.images?.[0]} alt={m.title} className="w-24 h-16 sm:w-28 sm:h-20 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm break-words">{m.title}</div>
                    <div className="text-xs text-gray-600 mt-1 break-words">{m.description}</div>
                    <div className="mt-2 font-black text-orange-600 text-sm">KSh {m.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Events & Notes */}
        <section className="px-4 sm:px-6 mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-4">Upcoming Events</h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { id: 1, title: "End of Semester Bash @ Kileleshwa", time: "Sat, Dec 20", rsvp: 154 },
                { id: 2, title: "Hackathon — Build for Good", time: "Fri, Jan 9", rsvp: 48 },
                { id: 3, title: "Study Group: Signals & Systems", time: "Mon, Jan 5", rsvp: 22 },
              ].map((e) => (
                <div key={e.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border">
                  <div className="font-bold text-sm sm:text-base break-words">{e.title}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{e.time} · {e.rsvp} going</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-4">Notes & Past Papers</h3>
            <div className="space-y-2 sm:space-y-3">
              {[{ id: 1, title: "Electronics 2024 Notes" }, { id: 2, title: "Discrete Maths Past Papers" }, { id: 3, title: "Thermodynamics Summary" }].map((n) => (
                <div key={n.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border">
                  <div className="font-bold text-sm sm:text-base break-words">{n.title}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Downloadable summaries & past papers</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roommates */}
        <section className="px-4 sm:px-6 mt-8 sm:mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-black">Roommates</h3>
            <p className="text-xs sm:text-sm text-gray-500">Find someone affordable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {roommatePosts.map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl p-3 sm:p-4 shadow-md border">
                <img src={r.image} alt={r.campus} className="w-full h-28 sm:h-36 object-cover rounded-lg mb-2 sm:mb-3" />
                <div className="font-bold text-sm break-words">{r.roomType} · KSh {r.budget}</div>
                <div className="text-xs text-gray-500">{r.campus}</div>
                <div className="text-xs mt-2 text-gray-700 break-words">{r.description}</div>
              </div>
            ))}
          </div>
        </section>

      {/* Trending Section */}
      <section className="px-4 sm:px-6 mt-10 sm:mt-12">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
            <FaFire className="text-2xl sm:text-3xl text-orange-500" />
            Trending Now
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <TrendingItem icon={<FaShoppingBag />} title="iPhone 15 Pro Max – KSh 125k" tag="Marketplace" views="2.8k" />
          <TrendingItem icon={<FaCalendarAlt />} title="End of Semester Bash @ Kileleshwa" tag="Event" views="4.2k" />
          <TrendingItem icon={<FaBookOpen />} title="All Engineering Units Notes 2025" tag="Notes" views="2.1k" />
          <TrendingItem icon={<FaHome />} title="Single room in Ngumo – KSh 7k" tag="Roommate" views="1.7k" />
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

const TrendingItem = ({ icon, title, tag, views }: any) => (
  <motion.div
    whileTap={{ scale: 0.97 }}
    className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100 flex items-center gap-4"
  >
    <div className="p-3 sm:p-4 bg-orange-100 rounded-2xl text-orange-600 text-lg sm:text-2xl flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-gray-900 text-sm sm:text-lg break-words">{title}</h3>
      <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
          {tag}
        </span>
        <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 whitespace-nowrap">
          <FaStar className="text-yellow-500" /> {views} views
        </span>
      </div>
    </div>
  </motion.div>
);

export default Explore;
