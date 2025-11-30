// src/components/post/PostForm.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "../BottomNav"; // ADDED

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "file";
  required?: boolean;
  multiple?: boolean;
}

interface PostFormProps {
  title: string;
  fields: Field[];
  submitUrl: string;
}

const PostForm = ({ title, fields, submitUrl }: PostFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const res = await fetch(submitUrl, { method: "POST", body: payload });
      if (!res.ok) throw new Error("Failed to submit");

      alert("Submitted successfully!");
      setFormData({});
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 pb-20">
      <div className="px-4 py-10">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {title}
          </h1>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-gray-700 font-semibold">{field.label}</label>

                {field.type === "textarea" ? (
                  <textarea
                    className="w-full p-4 rounded-xl border border-gray-200 outline-none bg-gray-50 text-gray-800 placeholder-gray-500 resize-none"
                    placeholder={field.label}
                    value={formData[field.name] || ""}
                    required={field.required}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    rows={7}
                  />
                ) : field.type === "file" ? (
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
                    className="text-gray-800"
                  />
                ) : (
                  <input
                    type={field.type}
                    className="w-full p-4 rounded-xl border border-gray-200 outline-none bg-gray-50 text-gray-800 placeholder-gray-500"
                    placeholder={field.label}
                    value={formData[field.name] || ""}
                    required={field.required}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.04 }}
              disabled={loading}
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold shadow-md disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </form>
        </div>
      </div>

      {/* BOTTOM NAV ADDED */}
      <BottomNav />
    </div>
  );
};

export default PostForm;