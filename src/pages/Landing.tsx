import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Colors for placeholder campuses / icons
const campusColors = ["#F97316", "#1E3A8A", "#10B981", "#F59E0B"];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full bg-[#F9FAFB]">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 
        min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] bg-gradient-to-r from-[#F97316] via-[#1E3A8A] to-[#10B981] text-white overflow-hidden">
        
        {/* Animated blobs / abstract shapes */}
        <motion.div
          className="absolute w-64 h-64 bg-[#F97316] rounded-full top-[-10%] left-[-10%] opacity-30"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-[#10B981] rounded-full bottom-[-15%] right-[-10%] opacity-25"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 max-w-4xl relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Campus, Your Hub
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg md:text-xl max-w-3xl mb-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Connect with classmates, explore campus events, share anonymously, and discover the best deals across Kenyan universities—all in one place.
        </motion.p>
        <button
          onClick={() => navigate("/auth/login")}
          className="bg-white text-[#F97316] font-semibold px-10 py-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition relative z-10"
        >
          Join Free
        </button>
      </section>

      {/* Trusted By / Campus Placeholder Section */}
      <section className="py-16 px-6 flex flex-col items-center gap-8">
        <h2 className="text-3xl font-semibold text-[#1E3A8A]">Trusted by students from:</h2>
        <div className="flex flex-wrap gap-6 justify-center mt-6">
          {["KU", "UoN", "JKUAT", "Strathmore"].map((campus, idx) => (
            <div
              key={campus}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg`}
              style={{ backgroundColor: campusColors[idx % campusColors.length] }}
            >
              {campus}
            </div>
          ))}
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gray-400">
            100+
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 flex flex-col items-center gap-12 bg-gray-50">
        <h2 className="text-3xl font-semibold text-[#1E3A8A] mb-8">What you can do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { title: "Confessions", desc: "Share your thoughts anonymously and get instant support from your peers.", color: "#F97316" },
            { title: "Marketplace", desc: "Buy, sell, or trade anything safely on your campus.", color: "#1E3A8A" },
            { title: "Events & Tickets", desc: "Never miss a campus event with easy discovery and RSVP.", color: "#10B981" },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col items-center text-center">
              <h3 className="text-xl font-bold mb-2" style={{ color: feature.color }}>
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-6 bg-[#1E3A8A] text-white flex flex-col items-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
        <button
          onClick={() => navigate("/auth/login")}
          className="bg-[#F97316] text-white font-semibold px-10 py-3 rounded-lg shadow hover:shadow-lg hover:bg-orange-600 transition"
        >
          Join Now
        </button>
      </section>
    </div>
  );
};

export default Landing;