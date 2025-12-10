import type { ReactNode } from "react";
import {
  FaSearch,
  FaUtensils,
  FaStore,
  FaHeart,
  FaCalendarAlt,
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";

export type Feature = {
  title: string;
  icon: ReactNode;
  color: string;
  bg?: string;
  description?: string;
};

export const featureFeed: Feature[] = [
  { title: "Confessions", icon: <FaHeart />, color: "from-rose-500 to-pink-600", bg: "bg-rose-50", description: "Share anonymously" },
  { title: "Marketplace", icon: <FaStore />, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", description: "Buy & sell" },
  { title: "Events", icon: <FaCalendarAlt />, color: "from-sky-500 to-blue-600", bg: "bg-sky-50", description: "Discover happenings" },
  { title: "Roommates", icon: <FaUsers />, color: "from-violet-500 to-purple-600", bg: "bg-violet-50", description: "Find your buddy" },
  { title: "Food Delivery", icon: <FaUtensils />, color: "from-orange-500 to-red-600", bg: "bg-orange-50", description: "Order food" },
  { title: "Notes & Past Papers", icon: <FaBookOpen />, color: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", description: "Study materials" },
];

export default featureFeed;
