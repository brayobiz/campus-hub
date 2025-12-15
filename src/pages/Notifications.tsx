import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
  FaChevronLeft,
  FaBell,
  FaCheckCircle,
  FaTrash,
  FaClock,
} from "react-icons/fa";
import { supabase } from "../lib/supabaseClient";
import { useUserStore } from "../store/useUserStore";

type Notification = {
  id: string;
  type: "like" | "comment" | "follow" | "message" | "event" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  relatedPostId?: string;
  relatedUserId?: string;
  actionUrl?: string;
};

const Notifications = () => {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch notifications from Supabase
      const { data, error: fetchError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      const formattedNotifications: Notification[] = (data || []).map((n: any) => ({
        id: n.id,
        type: n.type || "system",
        title: n.title || "Notification",
        message: n.message || "",
        timestamp: n.created_at,
        read: n.read || false,
        userId: n.user_id,
        relatedPostId: n.related_post_id,
        relatedUserId: n.related_user_id,
        actionUrl: n.action_url,
      }));

      setNotifications(formattedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Using mock data for demo.");
      // Mock notifications for demo
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = (): Notification[] => [
    {
      id: "1",
      type: "like",
      title: "Someone liked your confession",
      message: "Your anonymous confession received a like",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      userId: user?.id || "",
    },
    {
      id: "2",
      type: "comment",
      title: "New comment on your post",
      message: "Someone commented: 'This is so relatable!'",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      userId: user?.id || "",
    },
    {
      id: "3",
      type: "follow",
      title: "New follower",
      message: "Someone started following you",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      userId: user?.id || "",
    },
    {
      id: "4",
      type: "event",
      title: "Upcoming event on your campus",
      message: "Don't miss: End of Semester Bash tomorrow",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      userId: user?.id || "",
    },
  ];

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user?.id)
        .eq("read", false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const filteredNotifications = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    const colors: { [key: string]: string } = {
      like: "text-rose-500 bg-rose-50",
      comment: "text-sky-500 bg-sky-50",
      follow: "text-violet-500 bg-violet-50",
      message: "text-emerald-500 bg-emerald-50",
      event: "text-orange-500 bg-orange-50",
      system: "text-gray-500 bg-gray-50",
    };
    return colors[type] || colors.system;
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diff = Math.floor((now.getTime() - notifTime.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return notifTime.toLocaleDateString();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white pb-32">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaChevronLeft className="text-gray-900" />
              </button>
              <div className="flex items-center gap-3">
                <FaBell className="text-2xl text-blue-600" />
                <div>
                  <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
                  {unreadCount > 0 && (
                    <p className="text-xs text-blue-600 font-semibold">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Filter & Actions */}
        <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex gap-2">
              {["all", "unread"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as "all" | "unread")}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    filter === f
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f === "all" ? "All" : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <main className="max-w-2xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <FaClock className="text-3xl text-blue-600 animate-spin" />
              </div>
              <p className="text-gray-600 font-semibold">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center mb-6">
              <p className="text-amber-900 font-semibold">{error}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <FaBell className="text-3xl text-blue-600" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">
                All caught up!
              </h2>
              <p className="text-gray-600">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet. We'll notify you about activity on your posts and follows."}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {filteredNotifications.map((notif, idx) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-2xl p-5 border-l-4 transition-all cursor-pointer group ${
                      notif.read
                        ? "bg-white border-gray-200 hover:shadow-md"
                        : "bg-blue-50 border-blue-400 shadow-md"
                    }`}
                    onClick={() =>
                      !notif.read && handleMarkAsRead(notif.id)
                    }
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getNotificationIcon(
                          notif.type
                        )}`}
                      >
                        {notif.type === "like" && "❤️"}
                        {notif.type === "comment" && "💬"}
                        {notif.type === "follow" && "👥"}
                        {notif.type === "message" && "✉️"}
                        {notif.type === "event" && "🎉"}
                        {notif.type === "system" && "ℹ️"}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">
                              {notif.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notif.timestamp)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notif.id);
                            }}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                            title="Mark as read"
                          >
                            <FaCheckCircle className="text-lg" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif.id);
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </main>
      </div>
      <BottomNav openPostModal={() => {}} />
    </>
  );
};

export default Notifications;
