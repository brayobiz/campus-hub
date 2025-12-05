import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

interface Campus {
  id: string;
  name: string;
  short_name?: string;
}

const CampusPicker = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [filtered, setFiltered] = useState<Campus[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch campuses from DB
  const fetchCampuses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("campuses").select("*");

    if (!error && data) {
      setCampuses(data);
      setFiltered(data);
    } else {
      setError("Failed to load campuses");
    }
    setLoading(false);
  };

  // Fetch current user profile and redirect if campus exists
  const checkUserCampus = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) return;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("campus_id")
      .eq("id", userId)
      .single();

    if (!error && profile?.campus_id) {
      navigate("/home"); // Redirect if campus already selected
    }
  };

  useEffect(() => {
    fetchCampuses();
    checkUserCampus();
  }, []);

  // Search filter
  const handleSearch = (value: string) => {
    setSearch(value);
    const query = value.toLowerCase();
    const results = campuses.filter((c) =>
      c.name.toLowerCase().includes(query)
    );
    setFiltered(results);
  };

  // Set campus for current user
  const setCampus = async (campusId: string) => {
    setUpdating(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) return;

    // Ensure a profile exists, create one if not
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!profile && !profileError) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ id: userId, campus_id: campusId });
      if (insertError) {
        setError("Error creating profile");
        setUpdating(false);
        return;
      }
    } else if (!profileError) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ campus_id: campusId })
        .eq("id", userId);

      if (updateError) {
        setError("Error updating campus");
        setUpdating(false);
        return;
      }
    }

    setUpdating(false);
    navigate("/home"); // Redirect after setting campus
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* HEADER */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-8 shadow-xl mb-6">
          <h1 className="text-2xl font-bold">Choose Your Campus</h1>
          <p className="text-sm opacity-90 mt-2">
            Select the campus you belong to.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3 gap-3 mb-4">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            className="outline-none flex-1 text-sm"
            placeholder="Search campus..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-rose-100 text-rose-600 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        {/* CAMPUS LIST */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading campuses...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center">No campuses found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCampus(c.id)}
                disabled={updating}
                className="w-full text-left bg-white border border-gray-100 shadow-md p-4 rounded-2xl flex items-center gap-4 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="bg-orange-100 text-orange-600 px-4 py-3 rounded-xl font-bold">
                  {c.short_name ?? c.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{c.name}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CampusPicker;
