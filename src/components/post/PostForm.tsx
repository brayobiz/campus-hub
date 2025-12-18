// src/components/post/PostForm.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "../BottomNav"; // ADDED

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  multiple?: boolean;
  render?: () => React.ReactNode;
}

interface PostFormProps {
  title: string;
  fields: Field[];
  submitUrl?: string;
  onBeforeSubmit?: (formData: FormData) => boolean | Promise<boolean>;
  onSuccess?: () => void;
}

const PostForm = ({ title, fields, submitUrl, onBeforeSubmit, onSuccess }: PostFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      fields.forEach((field) => {
        const value = formData[field.name];
        if (field.type === "file" && value) {
          if (field.multiple && Array.isArray(value)) {
            value.forEach((file: File) => payload.append(field.name, file));
          } else {
            payload.append(field.name, value);
          }
        } else {
          payload.append(field.name, value || "");
        }
      });

      if (onBeforeSubmit) {
        const ok = await onBeforeSubmit(payload);
        if (!ok) {
          setLoading(false);
          return;
        }
      }

      if (onSuccess) onSuccess();

      setSuccess("Submitted successfully!");
      setFormData({});
      setTimeout(() => setSuccess(null), 3000); // Auto-hide after 3 seconds
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-50 via-white to-orange-50 pb-24">
      <div className="px-4 sm:px-6 pt-8 pb-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Share your thoughts with the campus community</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-orange-100">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
              >
                <p className="text-red-700 font-semibold text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl"
              >
                <p className="text-green-700 font-semibold text-sm">{success}</p>
              </motion.div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {fields.map((field, idx) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col gap-3"
                >
                  <label className="text-gray-800 font-bold text-sm sm:text-base">
                    {field.label}
                    {field.required && <span className="text-orange-500 ml-1">*</span>}
                  </label>

                  {field.render ? (
                    <div>{field.render()}</div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:outline-none bg-white text-gray-800 placeholder-gray-400 resize-none transition-colors"
                      placeholder={field.label}
                      value={formData[field.name] || ""}
                      required={field.required}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      rows={6}
                    />
                  ) : field.type === "file" ? (
                    <label className="relative cursor-pointer">
                      <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 sm:p-8 text-center hover:bg-orange-50 transition-colors">
                        <div className="text-2xl mb-2">📸</div>
                        <p className="text-gray-700 font-semibold text-sm">
                          Click to upload {field.multiple ? "images" : "an image"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple={field.multiple}
                        onChange={(e) =>
                          handleChange(
                            field.name,
                            field.multiple ? Array.from(e.target.files || []) : e.target.files?.[0]
                          )
                        }
                        required={field.required}
                        className="hidden"
                      />
                      {formData[field.name] && (
                        <p className="text-xs text-orange-600 font-semibold mt-2">
                          {field.multiple
                            ? `${Array.isArray(formData[field.name]) ? formData[field.name].length : 1} file(s) selected`
                            : "1 file selected"}
                        </p>
                      )}
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:outline-none bg-white text-gray-800 placeholder-gray-400 transition-colors"
                      placeholder={field.label}
                      value={formData[field.name] || ""}
                      required={field.required}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  )}
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(249, 115, 22, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block animate-spin">⏳</span>
                    Submitting...
                  </span>
                ) : (
                  "Submit Post"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
};

export default PostForm;