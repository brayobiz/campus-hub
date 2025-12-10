// src/pages/food/FoodFeed.tsx
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Phone, MessageCircle, RefreshCw, Utensils } from "lucide-react";
import BottomNav from "../../components/BottomNav";

type FoodItem = {
  id: string | number;
  name: string;
  description: string;
  price: string | number;
  image: string;
  contact: string;
  createdAt?: string;
};

const mockFoods: FoodItem[] = [
  { id: 1, name: "Ugali & Sukuma Wiki", description: "Delicious traditional meal", price: "KSh 150", image: "🍲", contact: "0712345678" },
  { id: 2, name: "Samosas (5pc)", description: "Crispy golden samosas", price: "KSh 100", image: "🥟", contact: "0712345679" },
  { id: 3, name: "Chapati & Beans", description: "Hot, fresh chapati with beans", price: "KSh 120", image: "🥔", contact: "0712345680" },
];

const FoodFeed = () => {
  const [foods, setFoods] = useState<FoodItem[]>(mockFoods);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFoods = async () => {
    // TEMP: Using mock data for testing
    setFoods(mockFoods);
  };

  useEffect(() => {
    // DISABLED: fetchFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return foods;
    const q = searchQuery.toLowerCase();
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }, [foods, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-gray-100 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent">
              Campus Food
            </h1>
            <p className="text-sm text-gray-600 mt-1">Order delicious meals around campus</p>
          </div>
          <button
            onClick={fetchFoods}
            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Sticky Search */}
      <div className="sticky top-[88px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-5 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search food, snacks, meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-300 bg-gray-50/70 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-6">Something went wrong</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchFoods} className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition">
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && foods.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-7 bg-gray-200 rounded-lg w-4/5" />
                  <div className="h-5 bg-gray-200 rounded-lg w-1/2" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded" />
                    <div className="h-4 bg-gray-100 rounded w-11/12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFoods.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <Utensils className="w-32 h-32 text-gray-200 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {searchQuery ? "No food found" : "No food posted yet"}
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-10">
              {searchQuery
                ? "Try searching for something else"
                : "Be the first to share your delicious menu!"}
            </p>
            <a
              href="/food/post"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition"
            >
              <Utensils className="w-6 h-6" />
              Post Your Food
            </a>
          </motion.div>
        )}

        {/* Food Grid */}
        {!loading && filteredFoods.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredFoods.map((food, i) => (
              <motion.article
                key={food.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Food Image + Price Badge */}
                <div className="relative h-60 bg-gray-200">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-5 py-3 rounded-full font-bold text-lg shadow-lg">
                    KSh {typeof food.price === "number" ? food.price.toLocaleString() : food.price}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
                    {food.name}
                  </h3>

                  <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed mb-6">
                    {food.description}
                  </p>

                  {/* Contact Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={`tel:${food.contact}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Phone className="w-5 h-5" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${food.contact.replace(/\D/g, "")}`}
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

export default FoodFeed;