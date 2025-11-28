// src/App.tsx — Full-Bleed Campus Hub Kenya Landing (2025 V2)
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// INIT SUPABASE
const supabase = createClient(
  "https://YOUR-PROJECT.supabase.co",
  "your-anon-public-key-here"
);

export default function App() {
  const [mobileNav, setMobileNav] = useState(false);
  const [email, setEmail] = useState("");

  const sendMagicLink = async () => {
    if (!email.includes("@")) return alert("Enter a valid institutional email");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    error ? alert(error.message) : alert("Magic link sent! Check spam too");
  };

  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10 w-full">
        <div className="flex items-center justify-between px-6 py-4 w-full">

          <h1 className="text-3xl font-black bg-gradient-to-r from-green-400 via-yellow-400 to-red-600 bg-clip-text text-transparent select-none">
            Campus<span className="text-white">Hub</span>
          </h1>

          <nav className="hidden md:flex items-center gap-10 font-medium">
            {["Features", "Confessions", "Marketplace", "Events"].map((nav) => (
              <a key={nav} href={`#${nav.toLowerCase()}`} className="hover:text-green-400 transition">
                {nav}
              </a>
            ))}
            <button
              onClick={sendMagicLink}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 font-bold hover:scale-105 transition"
            >
              Join Free
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE NAV */}
        {mobileNav && (
          <div className="absolute inset-0 top-16 h-screen bg-black/95 flex flex-col pt-10 gap-6 text-2xl">
            {["Features", "Confessions", "Marketplace", "Events"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-8 py-3" onClick={() => setMobileNav(false)}>
                {item}
              </a>
            ))}
            <button
              onClick={sendMagicLink}
              className="mx-8 mt-10 py-4 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 font-bold text-xl"
            >
              Join Free
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center w-full px-6 pt-32">

        {/* FULL BLEED ORBS */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-green-500/40 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-yellow-500/40 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-red-600/20 blur-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-tight">
          Kenya’s #1 <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-600 bg-clip-text text-transparent">Campus App</span>
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-[75ch]">
          Confessions • Marketplace • Events • Rides • Lost & Found.
          Everything students need in one app.
        </p>

        <div className="mt-12 w-full max-w-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="you@ku.ac.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:border-green-400 outline-none"
            />
            <button
              onClick={sendMagicLink}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 font-bold hover:scale-105 transition flex items-center gap-2"
            >
              Join Free <ArrowRight size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">No password required</p>
        </div>

        {/* BADGES */}
        <div className="mt-16 flex flex-wrap gap-3 justify-center px-6">
          {["UoN","KU","JKUAT","Strathmore","USIU","MKU","Moi","Egerton","KCA","Daystar","TU-K","Zetech","Multimedia","Riara","Kabarak"].map((u) => (
            <span key={u} className="px-5 py-2 border border-white/10 text-sm rounded-full bg-white/5 hover:border-green-400 transition">
              {u}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="w-full py-32 bg-gradient-to-b from-black via-zinc-900 to-black px-6">
        <h2 className="text-5xl md:text-7xl font-black text-center mb-20">Everything on Campus</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {[
            { title: "Anonymous Confessions", desc: "Speak freely. No names, no judgement." },
            { title: "Campus Marketplace", desc: "Sell anything. Buy everything. Fast, local deals." },
            { title: "Events & Parties", desc: "Never miss a bash, festival, or free food drop." },
          ].map((f, i) => (
            <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-green-400/50 hover:bg-white/10 transition">
              <h3 className="text-3xl font-bold text-green-400 mb-4">{f.title}</h3>
              <p className="text-gray-300 text-lg">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-36 text-center bg-gradient-to-r from-green-900/50 via-black to-yellow-900/40 px-6">
        <h2 className="text-6xl md:text-8xl font-black">
          Join <span className="text-green-400">50,000+</span> Students
        </h2>
        <p className="text-2xl text-gray-300 mt-4">Live on every major campus in Kenya</p>

        <button
          onClick={sendMagicLink}
          className="mt-12 px-16 py-6 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full text-3xl font-black hover:scale-110 transition"
        >
          Get Started
        </button>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-16 text-center border-t border-white/10">
        <p className="text-gray-500">
          © {new Date().getFullYear()} Campus Hub Kenya — Built for Students
        </p>
      </footer>
    </div>
  );
}