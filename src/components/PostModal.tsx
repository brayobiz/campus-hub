import { AnimatePresence, motion } from "framer-motion";
import useModalStore from "../store/useModalStore";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import featureFeed from "../data/featureFeed";

const PostModal = () => {
  const open = useModalStore((s: any) => s.postOpen);
  const close = useModalStore((s: any) => s.closePost);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Accessibility: focus trap and Escape to close
  useEffect(() => {
    if (!open) return;
    const node = modalRef.current;
    const focusable = node
      ? Array.from(node.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter((el) => !el.hasAttribute("disabled"))
      : [];

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 overflow-y-auto"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-full max-w-2xl shadow-2xl p-6 sm:p-8 mx-auto my-auto sm:my-0 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto"
            ref={modalRef}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">What's on your mind?</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Share with your campus community</p>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {featureFeed.map((f: any, i: number) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    close();
                    const routes: Record<string, string> = {
                      Confessions: "/confessions/post",
                      Marketplace: "/marketplace/new",
                      Events: "/events/new",
                      Roommates: "/roommates/new",
                      "Food Delivery": "/food/new",
                      "Notes & Past Papers": "/notes/new",
                    };
                    navigate(routes[f.title] || "/");
                  }}
                  className={`relative group overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl text-white font-bold shadow-lg transition h-24 sm:h-28 bg-gradient-to-br ${f.color} hover:shadow-xl`}
                >
                  <div className="relative z-10 text-center">
                    <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition transform">{f.icon}</div>
                    <p className="font-bold text-xs sm:text-sm break-words">{f.title}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={close}
              className="w-full py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-200 transition"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
