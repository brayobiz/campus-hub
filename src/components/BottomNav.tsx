// src/components/BottomNav.tsx
import { useNavigate } from "react-router-dom";
import useModalStore from "../store/useModalStore";
import { motion } from "framer-motion";
import { FaHome, FaSearch, FaPlusCircle, FaBell, FaUser } from "react-icons/fa";

interface BottomNavProps {
  openPostModal?: () => void;
}

const BottomNav = ({ openPostModal }: BottomNavProps) => {
  const navigate = useNavigate();
  const openGlobalPost = useModalStore((s) => s.openPost);

  const navItems = [
    { to: "/home", icon: <FaHome className="text-2xl" />, label: "Home" },
    { to: "/explore", icon: <FaSearch className="text-2xl" />, label: "Explore" },
    { icon: <FaPlusCircle className="text-2xl text-orange-500 drop-shadow-lg" />, label: "Post", action: openPostModal ?? openGlobalPost },
    { to: "/alerts", icon: <FaBell className="text-2xl" />, label: "Alerts" },
    { to: "/profile", icon: <FaUser className="text-2xl" />, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
      <div className="max-w-2xl mx-auto flex justify-around items-center">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => item.action ? item.action() : navigate(item.to)}
            className="flex flex-col items-center gap-1 tap-highlight-transparent"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={item.label === "Post" ? "" : "text-gray-600"}
            >
              {item.icon}
            </motion.div>
            <span
              className={`text-xs font-medium ${
                item.label === "Post" ? "text-orange-500 font-bold" : "text-gray-600"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;