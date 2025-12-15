import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronLeft, FaFileContract } from "react-icons/fa";
import BottomNav from "../components/BottomNav";

const TermsAndConditions = () => {
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
              <FaFileContract className="text-2xl text-purple-600" />
              <h1 className="text-2xl font-black text-gray-900">Terms & Conditions</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          {/* Effective Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 border border-purple-200 rounded-2xl p-6"
          >
            <p className="text-sm text-purple-900">
              <strong>Effective Date:</strong> December 2024
            </p>
            <p className="text-sm text-purple-800 mt-2">
              Welcome to Campus Hub. By accessing or using our platform, you agree to these Terms & Conditions.
              If you disagree with any part, please discontinue use immediately.
            </p>
          </motion.div>

          {/* Sections */}
          {[
            {
              title: "1. Acceptance of Terms",
              content: [
                "You acknowledge that you have read, understood, and agree to be bound by these Terms",
                "These Terms apply to all users, including those who browse without account creation",
                "Campus Hub reserves the right to modify these Terms at any time",
                "Continued use after changes constitutes acceptance of the modified Terms",
              ],
            },
            {
              title: "2. Eligibility & Account Registration",
              content: [
                "You must be at least 18 years old to use Campus Hub",
                "You must be a registered student, staff, or alumnus of a supported campus",
                "You are responsible for maintaining the confidentiality of your login credentials",
                "You agree not to share your account with others",
                "Campus Hub is not responsible for unauthorized account access",
              ],
            },
            {
              title: "3. User Conduct & Content Policy",
              content: [
                "You agree NOT to post content that is illegal, defamatory, or harassing",
                "NO sexual or exploitative content, including minors",
                "NO spam, phishing, malware, or unauthorized system access",
                "NO posting of others' private information without consent",
                "NO intellectual property infringement or plagiarism",
                "NO impersonation, false identities, or misleading information",
                "Violations may result in immediate account suspension or deletion",
              ],
            },
            {
              title: "4. Anonymous Confessions",
              content: [
                "Confessions are visible to all campus users (by default)",
                "You retain legal responsibility for anonymous posts",
                "Campus Hub can be compelled to disclose anonymous posters by law enforcement",
                "Anonymous posts are NOT completely anonymous to Campus Hub administrators",
                "You may not use anonymity to harass, threaten, or defame others",
              ],
            },
            {
              title: "5. Marketplace Conduct",
              content: [
                "Buyers and sellers must conduct transactions responsibly",
                "Campus Hub does NOT vet products or handle payment disputes",
                "Report scams or dangerous items immediately to our support team",
                "NO sales of illegal items, weapons, or controlled substances",
                "Disputes between buyers/sellers are NOT the responsibility of Campus Hub",
                "Users conduct transactions at their own risk",
              ],
            },
            {
              title: "6. Intellectual Property Rights",
              content: [
                "All Campus Hub content, design, and features are owned by Campus Hub or licensors",
                "Your user-generated content remains your intellectual property",
                "By posting, you grant Campus Hub a license to display your content",
                "You may not reproduce, modify, or distribute Campus Hub content without permission",
              ],
            },
            {
              title: "7. Limitation of Liability",
              content: [
                "Campus Hub is provided AS-IS without warranties of any kind",
                "We are not liable for indirect, consequential, or incidental damages",
                "Our total liability shall not exceed the amount you paid (if applicable)",
                "Some jurisdictions limit liability disclaimers - local laws may apply",
              ],
            },
            {
              title: "8. Indemnification",
              content: [
                "You agree to indemnify Campus Hub against claims arising from:",
                "  • Your violation of these Terms",
                "  • Your use of the platform",
                "  • Your user-generated content",
                "  • Violation of others' rights",
              ],
            },
            {
              title: "9. Suspension & Termination",
              content: [
                "Campus Hub may suspend or terminate your account for:",
                "  • Violation of these Terms",
                "  • Posting prohibited content",
                "  • Abusive behavior toward other users",
                "  • Breach of legal or ethical standards",
                "Termination may be immediate, with or without notice",
                "You may request your data before account deletion (30-day window)",
              ],
            },
            {
              title: "10. Dispute Resolution",
              content: [
                "Any disputes shall be governed by Kenyan law",
                "Disputes will be resolved through negotiation or arbitration",
                "You agree not to pursue class action lawsuits",
                "Arbitration shall be conducted in English",
              ],
            },
            {
              title: "11. Third-Party Links & Content",
              content: [
                "Campus Hub may contain links to third-party websites",
                "We are NOT responsible for third-party content or practices",
                "Your use of third-party services is at your own risk",
                "Please read their Terms & Privacy Policies independently",
              ],
            },
            {
              title: "12. Contact & Support",
              content: [
                "For questions about these Terms, contact:",
                "Email: legal@campushub.ke",
                "In-App: Use Help & Support",
                "We'll respond to inquiries within 7-10 business days",
              ],
            },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-black text-gray-900">{section.title}</h2>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li
                    key={i}
                    className={`flex gap-3 text-gray-700 ${
                      item.startsWith("  •") ? "ml-4" : ""
                    }`}
                  >
                    <span className="text-purple-600 font-bold mt-1">•</span>
                    <span className="leading-relaxed">{item.replace(/^\s+•\s/, "")}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Acknowledgment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6"
          >
            <p className="text-sm text-red-900 font-semibold">
              ⚠️ <strong>Important:</strong> By creating an account or using Campus Hub, you acknowledge that you have
              read and fully agree to these Terms & Conditions. If you do not agree, you must not use this platform.
            </p>
          </motion.div>
        </main>
      </div>
      <BottomNav openPostModal={() => {}} />
    </>
  );
};

export default TermsAndConditions;
