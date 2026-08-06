import { motion } from "motion/react";
import { RiPulseFill } from "react-icons/ri";

const getScoreColorClass = (score) => {
  if (score >= 90) return "from-amber-200 via-amber-400 to-amber-600";
  if (score >= 70) return "from-amber-400 to-amber-700";
  return "from-amber-600 to-amber-900";
};

/**
 * Expected shape (v2 payload):
 * summary: { score, headline, overview, executiveSummary, maintainabilityScore, securityRisk }
 * context: { projectType, repositoryType, detectedFrameworks: [] }
 * architecture: { primaryPattern }
 * meta: { analyzedAt }
 */
const HeroSection = ({ summary = {}, context = {}, architecture = {}, meta = {} }) => {
  const score = summary.score ?? 0;
  const scoreGradient = getScoreColorClass(score);
  const frameworks = context.detectedFrameworks || context.frameworks || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-[3rem] bg-stone-900/40 backdrop-blur-sm border border-amber-900/20 p-12 md:p-16 shadow-2xl shadow-black"
    >
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-center gap-16">
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 -m-8 border border-amber-900/10 rounded-full" />
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-48 h-48 rounded-full bg-black border-2 border-amber-900/30 flex flex-col items-center justify-center relative z-10 shadow-[0_0_60px_rgba(217,119,6,0.05)] shadow-amber-900/10"
          >
            <span className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${scoreGradient} transform -rotate-1`}>
              {score}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500 mt-2">Score</span>
          </motion.div>
        </div>

        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
            <span className="px-5 py-2 rounded-full bg-amber-900/30 border border-amber-800/40 text-amber-200 text-xs font-bold uppercase tracking-widest shadow-inner">
              {context.projectType || context.repositoryType || "Audit"}
            </span>
            {architecture.primaryPattern && (
              <span className="px-5 py-2 rounded-full bg-stone-900/60 border border-amber-900/10 text-stone-400 text-xs font-bold uppercase tracking-widest">
                {architecture.primaryPattern}
              </span>
            )}
            {(summary.maintainabilityScore !== undefined) && (
              <span className="px-5 py-2 rounded-full bg-stone-900/60 border border-amber-900/10 text-stone-400 text-xs font-bold uppercase tracking-widest">
                Maintainability {summary.maintainabilityScore}
              </span>
            )}
            {summary.securityRisk && (
              <span className="px-5 py-2 rounded-full bg-stone-900/60 border border-amber-900/10 text-stone-400 text-xs font-bold uppercase tracking-widest">
                Security {summary.securityRisk}
              </span>
            )}
            <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900/60 border border-amber-900/10 text-stone-400 text-xs font-bold uppercase tracking-widest">
              <RiPulseFill className="w-4 h-4 text-amber-600 animate-pulse" />
              {meta.analyzedAt ? new Date(meta.analyzedAt).toLocaleDateString() : "Present"}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tighter text-stone-100 leading-tight">
            {summary.headline || "Analysis Complete"}
          </h2>

          <p className="text-lg text-stone-400 leading-relaxed max-w-3xl font-medium antialiased">
            {summary.executiveSummary || summary.overview || "Static analysis finished with limited signals."}
          </p>

          {frameworks.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 justify-center lg:justify-start">
              {frameworks.slice(0, 8).map((fw) => (
                <span
                  key={fw}
                  className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-900/20 text-[11px] font-bold text-stone-400 uppercase tracking-wide"
                >
                  {fw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
