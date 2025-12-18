import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import BottomNav from "../../components/BottomNav";
import { supabase } from "../../lib/supabaseClient";
import { useCampusStore } from "../../store/useCampusStore";

type MarketplacePost = {
  id: string;
  title: string;
  description: string;
  category: string;
  images?: string[];
  price?: number;
  contact?: string;
  created_at: string;
  campus_id: string;
  user_id: string;
};

const popularCategories = ["Electronics", "Fashion", "Books", "Furniture", "Vehicles", "Sports"];

const MarketplaceFeed = () => {
  const [posts, setPosts] = useState<MarketplacePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const campus = useCampusStore((s) => s.campus);

  useEffect(() => {
    fetchMarketplacePosts();

    // Set up realtime subscription
    const channel = supabase
      .channel('marketplace_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'marketplace',
        filter: campus?.id ? `campus_id=eq.${campus.id}` : undefined,
      }, (payload: any) => {
        console.log('Marketplace realtime update:', payload);
        fetchMarketplacePosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campus?.id]);

  const fetchMarketplacePosts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!campus?.id) {
        setError("Please select a campus first");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("marketplace")
        .select("*")
        .eq("campus_id", campus.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err) {
      console.error("Error fetching marketplace posts:", err);
      setError("Failed to load marketplace items");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  });

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

      {/* Search */}
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
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-6">⚠️</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchMarketplacePosts} className="px-8 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition">
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && posts.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!filteredPosts.length ? (
              <div className="col-span-full text-center py-24">
                <div className="text-4xl mb-4">😔</div>
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
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm">
                    Ksh {(post.price || 0).toLocaleString()}
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
                      href={`tel:${post.contact || ""}`}
                      className="flex-1 py-3.5 text-center rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${(post.contact || "").replace(/\D/g, "")}`}
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
        )}
      </div>

      <BottomNav openPostModal={() => {}} />
    </div>
  );
};

export default MarketplaceFeed;