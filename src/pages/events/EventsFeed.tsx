// src/pages/events/EventsFeed.tsx
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, MapPin, AlertCircle, RefreshCw, Plus } from "lucide-react";
import BottomNav from "../../components/BottomNav";

type Event = {
  id: string | number;
  title: string;
  description: string;
  date: string; // ISO or "2025-12-25"
  location: string;
  banner?: string;
};

const EventsFeed = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Today" | "This Week" | "This Month">("All");

  // Native date helpers (no deps)
  const isToday = (d: string) => new Date(d).toDateString() === new Date().toDateString();
  const isThisWeek = (d: string) => {
    const date = new Date(d);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return date >= start && date <= end;
  };
  const isThisMonth = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getDayMonth = (d: string) => {
    const date = new Date(d);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    };
  };

  // Mock events for testing
  const mockEvents: Event[] = [
    { id: 1, title: "End of Semester Bash", description: "Celebrate with us", date: "2025-12-20", location: "Kileleshwa" },
    { id: 2, title: "Tech Meetup", description: "Learn new skills", date: "2025-12-15", location: "Campus Hall" },
    { id: 3, title: "Sports Day", description: "Join the competition", date: "2025-12-10", location: "Sports Ground" },
  ];

  const fetchEvents = async () => {
    // TEMP: Using mock data for testing
    setEvents(mockEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Smart filtering with useMemo for performance
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = !searchQuery || [
        event.title,
        event.location,
        event.description,
      ].some(field => field.toLowerCase().includes(searchQuery.toLowerCase()));

      if (activeFilter === "All") return matchesSearch;
      if (activeFilter === "Today") return matchesSearch && isToday(event.date);
      if (activeFilter === "This Week") return matchesSearch && isThisWeek(event.date);
      if (activeFilter === "This Month") return matchesSearch && isThisMonth(event.date);
      return matchesSearch;
    });
  }, [events, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Events
            </h1>
            <p className="text-sm text-gray-500 mt-1">Discover what's happening</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`} />
            </button>
            <a
              href="/events/post"
              className="p-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition"
            >
              <Plus className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Sticky Search & Filters */}
      <div className="sticky top-[88px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-5 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, venues, or keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setActiveFilter("All");
              }}
              className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-300 bg-gray-50/70 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-500"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {(["All", "Today", "This Week", "This Month"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  if (filter !== "All") setSearchQuery("");
                }}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter === "All" ? "All Events" : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-8 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && events.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-7 bg-gray-200 rounded-lg w-4/5" />
                  <div className="h-5 bg-gray-200 rounded-lg w-1/2" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded" />
                    <div className="h-4 bg-gray-100 rounded w-11/12" />
                    <div className="h-4 bg-gray-100 rounded w-10/12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State – Beautiful & Actionable */}
        {!loading && !error && filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="relative inline-block">
              <Calendar className="w-32 h-32 text-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-gray-300">?</div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-4">
              {searchQuery || activeFilter !== "All" ? "No events found" : "No events yet"}
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-10">
              {searchQuery || activeFilter !== "All"
                ? "Try adjusting your search or filters"
                : "Be the first to create an amazing event!"}
            </p>
            <a
              href="/events/post"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition"
            >
              <Plus className="w-6 h-6" />
              Create First Event
            </a>
          </motion.div>
        )}

        {/* Events Grid */}
        {!loading && filteredEvents.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event, i) => {
              const { day, month } = getDayMonth(event.date);
              return (
                <motion.article
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    {event.banner ? (
                      <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center">
                        <Calendar className="w-20 h-20 text-rose-300" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-lg px-5 py-3 rounded-2xl shadow-xl border border-white/50">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{month}</p>
                      <p className="text-3xl font-black text-rose-600">{day}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-rose-600 transition">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4 text-rose-500" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="mt-5 text-gray-700 text-sm line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>

                    <a
                      href={`/events/${event.id}`}
                      className="mt-6 block text-center py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      View Details
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default EventsFeed;