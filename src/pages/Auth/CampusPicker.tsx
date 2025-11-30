import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCampusStore } from "../../store/useCampusStore";
import {
  FaUniversity,
  FaBuilding,
  FaHome,
  FaMapMarkerAlt,
  FaSchool,
} from "react-icons/fa";

const campuses = [
  { id: "ku", name: "Kenyatta University", icon: FaSchool },
  { id: "uon", name: "University of Nairobi", icon: FaUniversity },
  { id: "strath", name: "Strathmore University", icon: FaBuilding },
  { id: "moi", name: "Moi University", icon: FaHome },
  { id: "jku", name: "Jomo Kenyatta University", icon: FaMapMarkerAlt },
];

const CampusPicker = () => {
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const setCampus = useCampusStore((state) => state.setCampus);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedCampus) return;
    const campusObj = campuses.find((c) => c.id === selectedCampus)!;
    setCampus(campusObj);
    navigate("/home"); // navigate to Home
  };

  const gridItemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, type: "spring", stiffness: 140 },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-12"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Select Your Campus
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Personalize your experience based on your institution
        </p>

        <motion.div
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10"
        >
          {campuses.map((campus, index) => {
            const Icon = campus.icon;
            return (
              <motion.button
                key={campus.id}
                custom={index}
                variants={gridItemVariants}
                whileHover={{ scale: 1.1, rotate: "-1.5deg" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCampus(campus.id)}
                className={`flex flex-col items-center gap-3 px-4 py-6 rounded-2xl font-semibold shadow-md transition-all duration-300 border
                  ${
                    selectedCampus === campus.id
                      ? "bg-[#F97316] text-white shadow-xl border-orange-500 scale-[1.04]"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }
                `}
              >
                <Icon className="text-3xl" />
                {campus.name}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.button
          onClick={handleContinue}
          disabled={!selectedCampus}
          whileHover={selectedCampus ? { scale: 1.03 } : {}}
          whileTap={selectedCampus ? { scale: 0.97 } : {}}
          className={`w-full py-4 rounded-2xl font-semibold text-white transition shadow-md
            ${
              selectedCampus
                ? "bg-[#F97316] hover:bg-orange-600 hover:shadow-lg cursor-pointer"
                : "bg-orange-200 cursor-not-allowed"
            }
          `}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CampusPicker;