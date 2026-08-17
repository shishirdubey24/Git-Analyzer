import { motion } from "motion/react";
import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import { RiSpam2Line, RiAlertLine } from "react-icons/ri";

const CATEGORY_LABELS = {
  security: "Security Issues",
  architecture: "Architecture Problems",
  documentation: "Documentation Problems",
  complexity: "Complexity Problems",
  testing: "Testing Issues",
  general: "General Critique",
};

/**
 * Primary source: critique.redFlags -> [{ message, severity, category? }]
 * If a flag has no `category`, it's bucketed under "General Critique".
 */
const RedFlagsCard = ({ critique = {} }) => {
  const flags = critique.redFlags || [];

  if (flags.length === 0) return null;

  const grouped = flags.reduce((acc, flag) => {
    const key = flag.category || "general";
    acc[key] = acc[key] || [];
    acc[key].push(flag);
    return acc;
  }, {});

  const order = ["security", "architecture", "documentation", "complexity", "testing", "general"];
  const groups = order.filter((k) => grouped[k]?.length).map((k) => [k, grouped[k]]);

  return (
    <div className="space-y-10">
      <SectionHeader icon={<RiSpam2Line className="w-5 h-5 text-red-500 animate-pulse" />} title="Logic Perimeter" />

      {groups.map(([category, items], gi) => (
        <div key={category} className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500 pl-2">
            {CATEGORY_LABELS[category] || category}
          </p>
          <div className="grid gap-6">
            {items.map((flag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-10 p-10 bg-black border border-amber-900/30 rounded-[3rem] relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-800/40" />
                <div className="shrink-0 w-16 h-16 bg-stone-900 border border-amber-900/40 rounded-2xl flex items-center justify-center text-amber-700 shadow-inner group-hover:scale-105 transition-transform">
                  <RiAlertLine className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-900 mb-3 block">
                    {flag.severity || "NOTICE"} AUDIT SIGNAL
                  </span>
                  <p className="text-xl text-stone-200 font-bold tracking-tight leading-relaxed">{flag.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RedFlagsCard;