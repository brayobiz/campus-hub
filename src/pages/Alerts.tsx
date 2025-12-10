// src/pages/Alerts.tsx — SENIOR DESIGNER EDITION (2025)
import { motion } from "framer-motion";
import { FaBell, FaHeart, FaComment, FaShoppingBag, FaCalendarAlt, FaUserPlus, FaStar } from "react-icons/fa";
import BottomNav from "../components/BottomNav";

const Alerts = () => {
  // Premium concept removed — show all alerts to users
  const alerts = [
    { type: "like", title: "Sarah liked your confession", time: "now" },
    { type: "reply", title: "5 new replies on your iPhone post", time: "8m" },
    { type: "sale", title: "Your AirPods just sold for KSh 12,000!", time: "1h" },
    { type: "event", title: "150+ going to your Pool Party", time: "3h" },
    { type: "roommate", title: "Mike wants to move in", time: "6h" },
    { type: "rank", title: "You hit Top 5 Confessors this week", time: "1d" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-orange-100">
        <div className="px-4 sm:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Alerts</h1>
            <p className="text-orange-600 font-bold text-lg -mt-1">Live updates · {alerts.length} new</p>
          </div>

          {/* Animated Bell */}
          <motion.div
            animate={{ rotate: [0, -20, 20, -20, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 6 }}
            className="relative"
          >
            <FaBell className="text-2xl sm:text-3xl text-orange-500 drop-shadow-lg" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-pulse" />
          </motion.div>
        </div>
      </header>

      {/* Main Feed */}
      <section className="px-4 sm:px-5 pt-4 sm:pt-6 pb-32">
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
      </section>

      <BottomNav />
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