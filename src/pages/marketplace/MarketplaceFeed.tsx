import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import BottomNav from "../../components/BottomNav";
import { marketplacePosts } from "../../data/marketplace";

const popularCategories = ["Electronics", "Fashion", "Books", "Furniture", "Vehicles", "Sports"];

const MarketplaceFeed = () => {
  const [posts] = useState(marketplacePosts);
  const [searchQuery, setSearchQuery] = useState("");

  // Single filter: search in title, description, OR category
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  });

  // Extract unique categories from data (or use static list above)
  const allCategories = Array.from(new Set(posts.map(p => p.category))).sort();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-gray-50/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            Marketplace
          </h1>
          <span className="text-sm text-gray-500 bg-gray-200/70 px-3 py-1 rounded-full">
            {filteredPosts.length} items
          </span>
        </div>
      </header>

      {/* Unified Search Bar - Now Fixed & Beautiful */}
      <div className="sticky top-16 z-40 bg-gray-50/95 backdrop-blur-xl px-4 py-5 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none z-10" />
            
            <input
              type="text"
              placeholder="Search by product, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4.5 text-base rounded-2xl border border-gray-300 bg-white shadow-inner focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900 font-medium"
            />

            {/* Filter icon (visual only - or make it open modal later) */}
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Optional: Quick category chips below search */}
          {searchQuery === "" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {popularCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchQuery(cat)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-rose-50 hover:border-rose-400 hover:text-rose-600 transition"
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-24">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-xl text-gray-600">No items found</p>
              <p className="text-gray-500 mt-2">Try searching for something else</p>
            </div>
          ) : (
            filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full group"
              >
                <div className="relative overflow-hidden bg-gray-100">
                  {post.images?.[0] ? (
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-56 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm">
                    Ksh {post.price.toLocaleString()}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-rose-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{post.category}</p>
                  <p className="text-gray-700 text-sm mt-3 line-clamp-3 flex-1">
                    {post.description}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <a
                      href={`tel:${post.contact}`}
                      className="flex-1 py-3.5 text-center rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${post.contact.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 text-center rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MarketplaceFeed;