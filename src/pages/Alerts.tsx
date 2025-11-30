// src/pages/Alerts.tsx — SENIOR DESIGNER EDITION (2025)
import { motion } from "framer-motion";
import { FaBell, FaHeart, FaComment, FaShoppingBag, FaCalendarAlt, FaUserPlus, FaStar, FaLock, FaRocket } from "react-icons/fa";
import BottomNav from "../components/BottomNav";

const Alerts = () => {
  const isPremium = false; // flip when ready

  const alerts = [
    { type: "like", title: "Sarah liked your confession", time: "now", premium: false },
    { type: "reply", title: "5 new replies on your iPhone post", time: "8m", premium: true },
    { type: "sale", title: "Your AirPods just sold for KSh 12,000!", time: "1h", premium: true },
    { type: "event", title: "150+ going to your Pool Party", time: "3h", premium: true },
    { type: "roommate", title: "Mike wants to move in", time: "6h", premium: false },
    { type: "rank", title: "You hit Top 5 Confessors this week", time: "1d", premium: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-orange-100">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Alerts</h1>
            <p className="text-orange-600 font-bold text-lg -mt-1">Live updates · {alerts.length} new</p>
          </div>

          {/* Animated Bell */}
          <motion.div
            animate={{ rotate: [0, -20, 20, -20, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 6 }}
            className="relative"
          >
            <FaBell className="text-5xl text-orange-500 drop-shadow-lg" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-pulse" />
          </motion.div>
        </div>
      </header>

      {/* Main Feed */}
      <section className="px-5 pt-6 pb-32">
        {isPremium ? (
          /* PREMIUM: Full power mode */
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex items-center gap-4"
              >
                <AlertIcon type={alert.type} />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg leading-tight">{alert.title}</p>
                  <p className="text-orange-600 font-semibold text-sm mt-1">{alert.time}</p>
                </div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              </motion.div>
            ))}
          </div>
        ) : (
          /* FREE USER: Smart gating */
          <>
            {/* Show only free alerts */}
            <div className="space-y-3 mb-8">
              {alerts
                .filter(a => !a.premium)
                .map((alert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/90 rounded-3xl p-5 flex items-center gap-4 shadow-md"
                  >
                    <AlertIcon type={alert.type} />
                    <div>
                      <p className="font-bold text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Locked Premium Alerts */}
            <div className="space-y-4 mb-10">
              <p className="text-center text-gray-600 font-semibold mb-4">
                Premium alerts are hidden
              </p>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-400/10 to-red-500/10 border-2 border-dashed border-orange-300"
                >
                  <div className="p-8 text-center">
                    <FaLock className="text-5xl text-orange-400 mx-auto mb-4" />
                    <p className="font-bold text-gray-800 text-lg">Sales alerts · Event RSVPs · Rank updates</p>
                    <p className="text-gray-600 mt-2">Only visible to Premium members</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent" />
                </motion.div>
              ))}
            </div>

            {/* FINAL UPGRADE CARD – IMPOSSIBLE TO IGNORE */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600" />
              <div className="absolute inset-0 bg-black/20" />

              <div className="relative p-10 text-center text-white">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-6"
                >
                  Rocket
                </motion.div>

                <h3 className="text-4xl font-black mb-4">Get Every Alert Instantly</h3>
                <p className="text-xl opacity-95 mb-8">
                  Never miss a sale, reply, or opportunity again
                </p>

                {/* Special Offer Badge */}
                <div className="inline-block bg-white/25 backdrop-blur-md rounded-2xl px-8 py-4 mb-8">
                  <p className="text-3xl font-black">1 MONTH FREE</p>
                  <p className="text-lg">Then just KSh 299/month</p>
                </div>

                <button className="w-full py-6 bg-white text-orange-600 font-black text-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition">
                  Start Free Trial Now
                </button>

                <p className="mt-5 text-sm opacity-80">Cancel anytime · No card required</p>
              </div>
            </motion.div>
          </>
        )}
      </section>

      <BottomNav openPostModal={() => {}} />
    </div>
  );
};

// Beautiful icon mapper
const AlertIcon = ({ type }: { type: string }) => {
  const icons: any = {
    like: <FaHeart className="text-2xl text-red-500" />,
    reply: <FaComment className="text-scale-x-100 text-2xl text-blue-500" />,
    sale: <FaShoppingBag className="text-2xl text-emerald-500" />,
    event: <FaCalendarAlt className="text-2xl text-purple-500" />,
    roommate: <FaUserPlus className="text-2xl text-orange-500" />,
    rank: <FaStar className="text-2xl text-yellow-500" />,
  };
  return <div className="p-3 bg-gray-100 rounded-2xl">{icons[type] || icons.like}</div>;
};

export default Alerts;