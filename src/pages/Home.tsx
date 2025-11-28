import { useState } from "react";

const Home = () => {
const [openFAQ, setOpenFAQ] = useState<number | null>(null);

const toggleFAQ = (id: number) => {
  setOpenFAQ(openFAQ === id ? null : id);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 text-gray-900 flex flex-col">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
            Campus Hub
          </h1>

          <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
            <a href="#features" className="hover:text-blue-700 transition">Features</a>
            <a href="#community" className="hover:text-blue-700 transition">Community</a>
            <a href="#testimonials" className="hover:text-blue-700 transition">Testimonials</a>
            <a href="#faq" className="hover:text-blue-700 transition">FAQ</a>
          </nav>

          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:shadow-xl hover:bg-blue-700 transition-all">
            Sign In
          </button>
        </div>
      </header>

      {/* FLOATING SHAPES */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-72 h-72 bg-blue-300/40 rounded-full blur-3xl animate-pulse top-10 left-10"></div>
        <div className="absolute w-80 h-80 bg-indigo-300/40 rounded-full blur-3xl animate-ping bottom-20 right-10"></div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-36 pb-24 text-center px-6 relative">
        <h2 className="text-5xl md:text-6xl font-extrabold text-blue-700 tracking-tight max-w-4xl mx-auto leading-tight drop-shadow-sm">
          The all-in-one platform for <span className="text-indigo-700">real campus life.</span>
        </h2>

        <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Confessions. Events. Marketplace. Clubs. Community.  
          Everything you love about campus — now in one beautiful, modern app.
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <button className="px-10 py-4 text-lg bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-2xl transition-all font-semibold">
            Join the Movement
          </button>

          <button className="px-10 py-4 text-lg bg-white border border-gray-300 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
            Take a Tour
          </button>
        </div>

        {/* Mockup / Hero Image */}
        <div className="mt-20 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
          <img
            src="https://images.unsplash.com/photo-1584697964190-081df67a33c3?q=80&w=2000"
            alt="Campus Hub mockup"
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-white">
        <h3 className="text-4xl font-bold text-blue-700 text-center mb-14">
          Your campus toolkit — reimagined
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {/* Feature */}
          <div className="p-8 rounded-2xl shadow-md hover:shadow-2xl transition bg-white border border-gray-200">
            <div className="text-4xl mb-4">🔥</div>
            <h4 className="text-xl font-semibold mb-3">Anonymous Confessions</h4>
            <p className="text-gray-600">Spill the tea. Hear the drama. Stay anonymous.</p>
          </div>

          <div className="p-8 rounded-2xl shadow-md hover:shadow-2xl transition bg-white border border-gray-200">
            <div className="text-4xl mb-4">🛍️</div>
            <h4 className="text-xl font-semibold mb-3">Campus Marketplace</h4>
            <p className="text-gray-600">Buy, sell, and trade student essentials safely.</p>
          </div>

          <div className="p-8 rounded-2xl shadow-md hover:shadow-2xl transition bg-white border border-gray-200">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-xl font-semibold mb-3">Events & Clubs</h4>
            <p className="text-gray-600">Never miss a party, workshop, or meeting again.</p>
          </div>

        </div>
      </section>

      {/* SOCIAL PROOF / COMMUNITY */}
      <section id="community" className="py-24 text-center bg-gradient-to-br from-blue-100 to-indigo-200 px-6">
        <h3 className="text-4xl font-bold text-blue-700 max-w-3xl mx-auto">
          Over <span className="text-indigo-700">15,000+</span> students are already using Campus Hub.
        </h3>

        <p className="mt-4 text-gray-700">Join the fastest-growing student community.</p>

        <button className="mt-10 px-10 py-4 text-lg bg-blue-700 text-white rounded-xl shadow-2xl hover:shadow-blue-500/70 hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] transition-all font-semibold">
          Create Your Account
        </button>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6 bg-white">
        <h3 className="text-4xl font-bold text-blue-700 text-center mb-14">
          What students are saying
        </h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <div className="p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
            <p className="text-gray-700 italic">
              “Campus Hub made my first year so much easier. I found friends, sold my books, and discovered events I would’ve missed.”
            </p>
            <h4 className="mt-4 font-semibold text-blue-700">— Sarah, Freshman</h4>
          </div>

          <div className="p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
            <p className="text-gray-700 italic">
              “The confessions section alone is legendary. This app is our entire campus in one place.”
            </p>
            <h4 className="mt-4 font-semibold text-blue-700">— Daniel, Senior</h4>
          </div>

          <div className="p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
            <p className="text-gray-700 italic">
              “It’s actually useful. Marketplace saved me so much money compared to buying new stuff.”
            </p>
            <h4 className="mt-4 font-semibold text-blue-700">— Priya, 2nd Year</h4>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-indigo-50">
        <h3 className="text-4xl font-bold text-blue-700 text-center mb-12">
          Frequently Asked Questions
        </h3>

        <div className="max-w-4xl mx-auto space-y-6">

          {[
            {
              q: "Is Campus Hub free?",
              a: "Yes! Campus Hub is completely free for students."
            },
            {
              q: "Do I need a university email?",
              a: "Yes. This ensures everyone is a verified student."
            },
            {
              q: "Is the confession section really anonymous?",
              a: "Absolutely. We do not track identity for confessions."
            },
            {
              q: "Can clubs post events?",
              a: "Yes, student clubs can create verified profiles and post updates."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md border border-gray-200">
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">{item.q}</span>
                <span>{openFAQ === i ? "—" : "+"}</span>
              </button>

              {openFAQ === i && (
                <div className="px-6 pb-4 text-gray-600">{item.a}</div>
              )}
            </div>
          ))}

        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="py-24 text-center bg-white px-6">
        <h3 className="text-3xl font-bold text-blue-700">
          Stay in the loop
        </h3>
        <p className="mt-2 text-gray-600">Get updates about new features and campus trends.</p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 rounded-lg border border-gray-300 w-80"
          />
          <button className="px-8 py-3 rounded-lg bg-blue-700 text-white shadow hover:bg-blue-800 transition">
            Subscribe
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white py-6 text-center">
        <p className="text-sm opacity-75">&copy; {new Date().getFullYear()} Campus Hub. All rights reserved.</p>
        <div className="mt-3 flex justify-center gap-5 text-sm opacity-90">
          <a href="#" className="hover:opacity-100">Facebook</a>
          <a href="#" className="hover:opacity-100">Instagram</a>
          <a href="#" className="hover:opacity-100">TikTok</a>
          <a href="#" className="hover:opacity-100">X / Twitter</a>
        </div>
      </footer>

    </div>
  );
};

export default Home;
