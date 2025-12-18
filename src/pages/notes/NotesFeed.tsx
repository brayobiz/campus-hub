// src/pages/notes/NotesFeed.tsx
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Download, MessageCircle, RefreshCw, BookOpen, FileDown } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useCampusStore } from "../../store/useCampusStore";
import BottomNav from "../../components/BottomNav";

type Note = {
  id: string;
  title: string;
  course: string;
  year?: string;
  file: string;        // URL to file
  filename?: string;   // Original filename
  description?: string;
  contact?: string;
  created_at: string;
  campus_id: string;
  user_id: string;
};

const NotesFeed = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const campus = useCampusStore((s) => s.campus);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!campus?.id) {
        setError("Please select a campus first");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("notes")
        .select("*")
        .eq("campus_id", campus.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setNotes(data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Could not load notes & past papers.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();

    // Set up realtime subscription
    const channel = supabase
      .channel('notes_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: campus?.id ? `campus_id=eq.${campus.id}` : undefined,
      }, (payload: any) => {
        console.log('Notes realtime update:', payload);
        fetchNotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campus?.id]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.course.toLowerCase().includes(q) ||
        n.year?.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  // Smart file type detection
  const getFileType = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || "")) return "PDF";
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) return "Image";
    if (["doc", "docx"].includes(ext || "")) return "Word";
    if (["ppt", "pptx"].includes(ext || "")) return "PowerPoint";
    return "File";
  };

  // Force download with clean filename
  const handleDownload = async (fileUrl: string, filename?: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `note-${Date.now()}.${fileUrl.split(".").pop()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Download failed. Try opening the file first.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Notes & Past Papers
            </h1>
            <p className="text-sm text-gray-600 mt-1">Download and share study materials</p>
          </div>
          <button onClick={fetchNotes} className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="sticky top-[88px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-5 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes, courses, year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-300 bg-gray-50/70 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 font-medium placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Empty State */}
        {!loading && filteredNotes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <FileText className="w-32 h-32 text-gray-200 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {searchQuery ? "No notes found" : "No notes uploaded yet"}
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Be the first to help your classmates!
            </p>
          </motion.div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredNotes.map((note, i) => {
              const fileType = getFileType(note.file);

              return (
                <motion.article
                  key={note.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* File Preview */}
                  <div className="relative h-56 bg-gray-100 cursor-pointer" onClick={() => window.open(note.file, "_blank")}>
                    {fileType === "Image" ? (
                      <img src={note.file} alt={note.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                        <FileText className="w-20 h-20 text-indigo-500 mb-4" />
                        <span className="text-2xl font-bold text-indigo-700">{fileType}</span>
                        <span className="text-sm text-gray-600 mt-2">Click to view</span>
                      </div>
                    )}

                    {/* Course + Year Badges */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{note.course}</p>
                    </div>
                    {note.year && (
                      <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                        {note.year}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
                    {note.description && (
                      <p className="text-gray-700 text-sm line-clamp-2 mb-5 leading-relaxed">{note.description}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {/* DOWNLOAD BUTTON */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(note.file, note.filename || `${note.course}_${note.title}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <FileDown className="w-5 h-5" />
                        Download
                      </button>

                      {/* WhatsApp if contact exists */}
                      {note.contact && (
                        <a
                          href={`https://wa.me/${note.contact.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Ask
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default NotesFeed;