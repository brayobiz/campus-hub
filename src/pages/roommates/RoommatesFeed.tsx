// src/pages/roommates/RoommatesFeed.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Users, Phone, MessageCircle, RefreshCw } from "lucide-react";
import { roommatePosts } from "../../data/roommates";
import BottomNav from "../../components/BottomNav";

type RoommatePost = (typeof roommatePosts)[0];

const RoommatesFeed = () => {
  const [posts] = useState(roommatePosts);
  const [search, setSearch] = useState("");

  // Unified search across name, campus, roomType, description
  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const query = search.toLowerCase();
    return posts.filter(
      (post) =>
        post.campus?.toLowerCase().includes(query) ||
        post.roomType?.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query)
    );
  }, [posts, search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-purple-50 to-gray-100 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Roommates
            </h1>
            <p className="text-sm text-gray-600 mt-1">Find your perfect campus buddy</p>
          </div>
          <RefreshCw className="w-6 h-6 text-gray-500 animate-spin-slow" />
        </div>
      </header>

      {/* Sticky Search */}
      <div className="sticky top-[88px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-5 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, campus, room type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-300 bg-gray-50/70 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <Users className="w-32 h-32 text-gray-200 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {search ? "No roommates found" : "No listings yet"}
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {search
                ? "Try searching for a different campus or name"
                : "Be the first to help someone find their perfect roommate!"}
            </p>
          </motion.div>
        )}

        {/* Roommates Grid */}
        {filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Image + Budget Badge */}
                <div className="relative h-48 bg-gray-200">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={`${post.roomType} room near ${post.campus}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center">
                      <Users className="w-20 h-20 text-rose-300" />
                    </div>
                  )}
                  {post.budget && (
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm">
                      Ksh {post.budget.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {`${post.roomType} — ${post.campus}`}
                  </h3>

                  <div className="space-y-3 text-sm text-gray-600 mb-5">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>{post.campus}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-rose-500" />
                      <span className="capitalize">{post.roomType} Room</span>
                    </div>
                  </div>

                  {post.description && (
                    <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed mb-6">
                      {post.description}
                    </p>
                  )}

                  {/* Dual Contact Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={`tel:${post.contact}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Phone className="w-5 h-5" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${post.contact.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default RoommatesFeed;