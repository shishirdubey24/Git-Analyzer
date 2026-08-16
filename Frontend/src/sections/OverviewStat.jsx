import { motion } from "motion/react";
import {
  RiFileCodeLine,
  RiStackLine,
  RiArchiveDrawerLine,
  RiScan2Line,
  RiShieldCheckLine,
  RiBookReadLine,
  RiFlaskLine,
  RiBarChartBoxLine,
} from "react-icons/ri";

const StatItem = ({ icon, label, value, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + index * 0.08 }}
    whileHover={{ y: -4 }}
    className="bg-stone-900/40 border border-amber-900/15 rounded-[2rem] p-8 flex items-center gap-6 group hover:bg-stone-900/60 shadow-xl transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-black border border-amber-900/30 flex items-center justify-center text-amber-700 shadow-inner group-hover:text-amber-500 transition-colors shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="text-2xl font-bold text-stone-100 tracking-tighter group-hover:text-amber-500 transition-colors truncate">
        {value ?? "—"}
      </div>
    </div>
  </motion.div>
);

/**
 * Expected shape:
 * context: { languages: [], detectedFrameworks: [], sampledFiles }
 * summary: { maintainabilityScore, complexityLevel, securityRisk }
 * documentation: { status }
 * testing: { status }
 */
const OverviewStats = ({ context = {}, summary = {}, documentation = {}, testing = {} }) => {
  const languages = context.languages || [];
  const frameworks = context.detectedFrameworks || context.frameworks || [];

  const stats = [
    {
      icon: <RiStackLine className="w-5 h-5" />,
      label: "Languages",
      value: languages.length ? languages.slice(0, 2).join(", ") + (languages.length > 2 ? ` +${languages.length - 2}` : "") : "—",
    },
    {
      icon: <RiFileCodeLine className="w-5 h-5" />,
      label: "Detected Frameworks",
      value: frameworks.length || 0,
    },
    {
      icon: <RiScan2Line className="w-5 h-5" />,
      label: "Sampled Files",
      value: context.sampledFiles ?? context.totalFiles ?? "0",
    },
    {
      icon: <RiArchiveDrawerLine className="w-5 h-5" />,
      label: "Maintainability",
      value: summary.maintainabilityScore ?? "N/A",
    },
    {
      icon: <RiBarChartBoxLine className="w-5 h-5" />,
      label: "Complexity",
      value: summary.complexityLevel ?? "N/A",
    },
    {
      icon: <RiShieldCheckLine className="w-5 h-5" />,
      label: "Security Risk",
      value: summary.securityRisk ?? "N/A",
    },
    {
      icon: <RiBookReadLine className="w-5 h-5" />,
      label: "Documentation",
      value: documentation.status ?? "N/A",
    },
    {
      icon: <RiFlaskLine className="w-5 h-5" />,
      label: "Testing",
      value: testing.status ?? (testing.hasTests ? "Present" : "N/A"),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <StatItem key={s.label} index={i} {...s} />
      ))}
    </div>
  );
};

export default OverviewStats;
