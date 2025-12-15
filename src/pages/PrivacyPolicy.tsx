import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronLeft, FaShieldAlt } from "react-icons/fa";
import BottomNav from "../components/BottomNav";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-32">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="px-6 py-5 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaChevronLeft className="text-gray-900" />
            </button>
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-2xl text-blue-600" />
              <h1 className="text-2xl font-black text-gray-900">Privacy Policy</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
          >
            <p className="text-sm text-blue-900">
              <strong>Last Updated:</strong> December 2024
            </p>
            <p className="text-sm text-blue-800 mt-2">
              Your privacy is important to us. This policy explains how Campus Hub collects, uses, and protects your data.
            </p>
          </motion.div>

          {/* Sections */}
          {[
            {
              title: "1. Information We Collect",
              content: [
                "Account Information: Email, full name, campus, year of study, and academic major",
                "Profile Information: Bio, profile picture, interests, and preferences",
                "Content You Create: Posts, confessions, marketplace listings, and comments",
                "Usage Data: How you interact with the app, features you use, and time spent",
                "Device Information: Device type, OS, app version, and crash reports",
                "Location Data: Campus location (with your permission)",
              ],
            },
            {
              title: "2. How We Use Your Information",
              content: [
                "Provide and improve our services",
                "Personalize your experience based on campus and interests",
                "Send notifications and updates about features you care about",
                "Prevent fraud and ensure platform safety",
                "Analyze usage patterns to improve functionality",
                "Comply with legal obligations",
              ],
            },
            {
              title: "3. Data Security",
              content: [
                "All data is encrypted in transit using SSL/TLS",
                "Passwords are hashed using industry-standard algorithms",
                "Regular security audits and penetration testing",
                "Access controls limit employee access to personal data",
                "We comply with GDPR and data protection standards",
              ],
            },
            {
              title: "4. Anonymous Posting",
              content: [
                "Confessions are posted anonymously to the community",
                "Campus Hub staff can only see metadata (timestamp, campus, post ID)",
                "We cannot identify who made a confession unless required by law",
                "Anonymous posts are still subject to our community guidelines",
              ],
            },
            {
              title: "5. Data Sharing",
              content: [
                "We NEVER sell your personal data to third parties",
                "We may share data with service providers under strict contracts",
                "Legal authorities may request data if required by law",
                "Aggregated, anonymized data may be used for analytics",
                "Your campus information helps show relevant content",
              ],
            },
            {
              title: "6. Your Rights",
              content: [
                "Right to Access: Request a copy of your data anytime",
                "Right to Deletion: Delete your account and associated data",
                "Right to Correction: Update your profile information",
                "Right to Opt-Out: Disable notifications and marketing emails",
                "Right to Export: Download your data in a portable format",
              ],
            },
            {
              title: "7. Cookies & Tracking",
              content: [
                "We use session cookies to keep you logged in",
                "Analytics help us understand app usage patterns",
                "No third-party tracking or advertising networks",
                "You can disable cookies in your browser settings",
              ],
            },
            {
              title: "8. Children's Privacy",
              content: [
                "Campus Hub is intended for users 18 and older",
                "We do not knowingly collect data from users under 13",
                "If we learn we've collected data from a minor, we delete it immediately",
                "Parents/guardians can request data deletion for minors",
              ],
            },
            {
              title: "9. Contact Us",
              content: [
                "Questions about your privacy? Contact us at:",
                "Email: privacy@campushub.ke",
                "In-App: Use the Help & Support feature",
                "We aim to respond to privacy inquiries within 7 days",
              ],
            },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-black text-gray-900">{section.title}</h2>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-700">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Footer Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-100 border border-gray-300 rounded-2xl p-6 text-center"
          >
            <p className="text-sm text-gray-700">
              By using Campus Hub, you agree to this Privacy Policy. We may update this policy from time to time.
              We'll notify you of significant changes via email or in-app notification.
            </p>
          </motion.div>
        </main>
      </div>
      <BottomNav openPostModal={() => {}} />
    </>
  );
};

export default PrivacyPolicy;
