import { motion } from "motion/react";
import { RiGithubFill, RiScan2Line } from "react-icons/ri";

const Footer = ({ totalFiles, sampledFiles }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="p-12 rounded-[3rem] bg-stone-900/10 border-t border-amber-900/10 flex flex-col md:flex-row items-center justify-between gap-12"
  >
    <div className="flex items-center gap-8 max-w-2xl text-center md:text-left">
      <div className="shrink-0 w-12 h-12 bg-stone-900/50 rounded-2xl flex items-center justify-center text-stone-700">
        <RiScan2Line className="w-6 h-6" />
      </div>
      <p className="text-sm text-stone-500 font-medium leading-relaxed">
        Architectural audit completed via <span className="text-amber-800 font-bold">deterministic signal extraction</span>.
        Found {totalFiles ?? "—"} entities. Samples: {sampledFiles ?? "—"}.
        Methodology: Heuristic pattern matching and structural induction.
      </p>
    </div>
    <div className="flex items-center gap-4 text-stone-800 opacity-30 hover:opacity-100 transition-opacity">
      <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Verifier</span>
      <RiGithubFill className="w-6 h-6" />
    </div>
  </motion.div>
);

export default Footer;
