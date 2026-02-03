/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  RiGithubFill,
  RiCpuLine,
  RiFileCodeLine,
  RiPulseFill,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiFolderOpenLine,
  RiInformationLine,
  RiStackLine,
  RiTerminalBoxLine,
  RiTrelloLine,
  RiSpam2Line,
  RiArrowRightLine,
  RiListCheck,
  RiArchiveDrawerLine,
  RiScan2Line,
  RiFolderLine,
  RiFileTextLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiShieldStarLine,
  RiHistoryLine,
  RiMicroscopeLine,
  RiFlaskLine
} from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react";

const ReportCard = ({ data }) => {
  if (!data) return <div className="text-center py-20 text-stone-500">No analysis data available.</div>;

  const { summary = {}, architecture = {}, critique = {}, codeQuality = {}, context = {}, structure = {} } = data;

  const getScoreColorClass = (score) => {
    if (score >= 90) return "from-amber-200 via-amber-400 to-amber-600";
    if (score >= 70) return "from-amber-400 to-amber-700";
    return "from-amber-600 to-amber-900";
  };

  const scoreGradient = getScoreColorClass(summary?.score || 0);

  return (
    <div className="mx-auto max-w-6xl space-y-20 pb-32 selection:bg-amber-600/30">

      {/* 1. HERO SCOREBOARD */}
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
                {summary?.score || 0}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500 mt-2">Score</span>
            </motion.div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              <span className="px-5 py-2 rounded-full bg-amber-900/30 border border-amber-800/40 text-amber-200 text-xs font-bold uppercase tracking-widest shadow-inner">
                {context.projectType || "Audit"}
              </span>
              <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900/60 border border-amber-900/10 text-stone-400 text-xs font-bold uppercase tracking-widest">
                <RiPulseFill className="w-4 h-4 text-amber-600 animate-pulse" />
                {data.meta?.analyzedAt ? new Date(data.meta.analyzedAt).toLocaleDateString() : "Present"}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tighter text-stone-100 leading-tight">
              {summary?.headline || "Analysis Complete"}
            </h2>

            <p className="text-lg text-stone-400 leading-relaxed max-w-3xl font-medium antialiased">
              {summary?.overview || "Static analysis finished with limited signals."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. STATS RIBBON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatItem
          index={0}
          icon={<RiFileCodeLine className="w-5 h-5" />}
          label="Mapped Files"
          value={context.totalFiles || "0"}
        />
        <StatItem
          index={1}
          icon={<RiScan2Line className="w-5 h-5" />}
          label="Deep Samples"
          value={codeQuality.sampling.totalFilesScanned || "0"}
        />
        <StatItem
          index={2}
          icon={<RiStackLine className="w-5 h-5" />}
          label="Base Engine"
          value={context.primaryLanguage || "Universal"}
        />
        <StatItem
          index={3}
          icon={<RiArchiveDrawerLine className="w-5 h-5" />}
          label="Health Ratio"
          value={summary.stats?.avgCoherence || "N/A"}
        />
      </div>

      {/* 3. CORE ANALYTICS GRID */}
      <div className="grid lg:grid-cols-3 gap-16">

        <div className="lg:col-span-2 space-y-12">
          {/* A. ARCHITECTURAL STRENGTHS */}
          <div className="space-y-8">
            <SectionHeader icon={<RiCheckboxCircleLine className="w-5 h-5 text-amber-600" />} title="Verified Signals" />
            <div className="grid md:grid-cols-1 gap-6">
              {(summary?.whatStandsOut || []).length > 0 ? (summary.whatStandsOut.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-2xl bg-stone-900/30 border border-amber-900/10 hover:border-amber-700/30 hover:bg-stone-900/50 shadow-lg transition-all duration-500"
                >
                  <div className="flex items-start gap-6">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.6)] shrink-0" />
                    <p className="text-stone-300 leading-relaxed font-medium text-base">{item}</p>
                  </div>
                </motion.div>
              ))) : (
                <p className="text-stone-500 italic p-4">Limited signals detected for this repository.</p>
              )}
            </div>
          </div>

          {/* B. BOOT HYGIENE (NEW REFINED SECTION) */}
          <div className="space-y-8">
            <SectionHeader icon={<RiHistoryLine className="w-5 h-5 text-amber-600" />} title="Boot Sequence Hygiene" />
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(codeQuality.entryPointHealth || {}).map(([file, health], i) => (
                <motion.div
                  key={file}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 rounded-[2rem] border ${health.status === 'Clean' ? 'bg-stone-900/20 border-green-900/20' : 'bg-red-950/10 border-red-900/20'} shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <RiFlaskLine className={health.status === 'Clean' ? 'text-green-500' : 'text-amber-500'} />
                    <span className="font-mono text-sm font-bold text-stone-200">{file}</span>
                    <span className={`ml-auto text-[9px] font-black uppercase px-2 py-0.5 rounded ${health.status === 'Clean' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {health.status}
                    </span>
                  </div>
                  {health.issues.length > 0 ? (
                    <ul className="space-y-2">
                      {health.issues.map((issue, j) => (
                        <li key={j} className="text-xs text-stone-500 flex items-start gap-2">
                          <div className="mt-1 w-1 h-1 rounded-full bg-stone-700 shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-stone-600 italic">No initialization bloat detected in this entry point.</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: PROJECT MAP */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-8">
            <SectionHeader icon={<RiTrelloLine className="w-5 h-5 text-amber-600" />} title="Project Map" />
            <div className="bg-stone-900/50 backdrop-blur-sm rounded-[2rem] border border-amber-900/30 p-10 space-y-10 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/5 blur-2xl rounded-full" />
              {Object.entries(architecture?.folderStructureIntent || {}).length > 0 ? Object.entries(architecture.folderStructureIntent).slice(0, 8).map(([folder, stats], i) => (
                <div key={i} className="flex flex-col gap-5 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-900/10 rounded-lg group-hover:bg-amber-900/20 transition-colors">
                        <RiFolderOpenLine className="w-6 h-6 text-amber-600" />
                      </div>
                      <span className="text-stone-200 font-mono text-base md:text-lg font-bold tracking-tight lowercase">{folder}</span>
                    </div>
                    <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-stone-900 border border-white/5 ${stats.dominantType === "UI" ? "text-amber-400 border-amber-900/30" :
                      stats.dominantType === "Logic" ? "text-stone-300 border-stone-800" :
                        "text-stone-500 border-stone-900"
                      }`}>
                      {stats.dominantType}
                    </span>
                  </div>
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(stats.coherence || 0.5) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.6 + (i * 0.1) }}
                      className="h-full bg-gradient-to-r from-amber-900 to-amber-500 shadow-[0_0_12px_rgba(217,119,6,0.3)]"
                    />
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <RiFolderOpenLine className="w-12 h-12 text-stone-800 mx-auto mb-4" />
                  <p className="text-stone-500 text-sm">No structured directories mapped.</p>
                </div>
              )}
            </div>
          </div>

          {/* Infrastructure Listing */}
          {context.dependencies && context.dependencies.length > 0 && (
            <div className="space-y-10 pt-4">
              <SectionHeader icon={<RiListCheck className="w-5 h-5 text-amber-600" />} title="Infrastructure" />
              <div className="flex flex-wrap gap-3 px-2">
                {context.dependencies.slice(0, 20).map((dep) => (
                  <span key={dep} className="px-4 py-2 rounded-xl bg-stone-900/80 border border-amber-900/20 text-xs md:text-sm font-bold text-stone-400 hover:text-amber-500 hover:border-amber-600/50 hover:bg-black transition-all cursor-default shadow-sm group-hover:shadow-amber-900/10">
                    {dep.split('/').pop()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* 4. STRUCTURAL BLUEPRINT */}
      <div className="space-y-8">
        <SectionHeader icon={<RiShieldStarLine className="w-5 h-5 text-amber-600" />} title="Structural Blueprint" />
        <div className="bg-stone-900/30 rounded-[3rem] border border-amber-900/10 p-12 overflow-hidden shadow-2xl">
          <div className="max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-amber-900/20">
            {(structure?.tree || []).length > 0 ? structure.tree.map((node, i) => (
              <FileTreeNode key={i} node={node} entryPoints={structure?.entryPoints || []} />
            )) : (
              <p className="text-stone-600 italic">No files detected in the root directory.</p>
            )}
          </div>
        </div>
      </div>

      {/* 5. CRITICAL SIGNALS */}
      {critique.redFlags.length > 0 && (
        <div className="space-y-10">
          <SectionHeader icon={<RiSpam2Line className="w-5 h-5 text-red-500 animate-pulse" />} title="Logic Perimeter" />
          <div className="grid gap-6">
            {critique.redFlags.map((flag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-10 p-10 bg-black border border-amber-900/30 rounded-[3rem] relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-800/40" />
                <div className="shrink-0 w-16 h-16 bg-stone-900 border border-amber-900/40 rounded-2xl flex items-center justify-center text-amber-700 shadow-inner group-hover:scale-105 transition-transform">
                  <RiAlertLine className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-900 mb-3 block">
                    {flag.severity} AUDIT SIGNAL
                  </span>
                  <p className="text-xl text-stone-200 font-bold tracking-tight leading-relaxed">{flag.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SCOPE FOOTER */}
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
            Found {context.totalFiles} entities. Samples: {codeQuality.sampling.totalFilesScanned}.
            Methodology: Heuristic pattern matching and structural induction.
          </p>
        </div>
        <div className="flex items-center gap-4 text-stone-800 opacity-30 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Verifier</span>
          <RiGithubFill className="w-6 h-6" />
        </div>
      </motion.div>

    </div>
  );
};

const FileTreeNode = ({ node, depth = 0, entryPoints = [] }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isFolder = node.type === "folder";
  const isEntryPoint = entryPoints.includes(node.path);

  return (
    <div className="select-none">
      <motion.div
        whileHover={{ x: 4 }}
        className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors text-sm hover:bg-stone-900/40 group ${isEntryPoint ? 'bg-amber-900/10' : ''}`}
        onClick={() => isFolder && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        <span className="mr-2 text-stone-600 group-hover:text-amber-600 transition-colors">
          {isFolder ? (
            isOpen ? <RiArrowDownSLine className="w-4 h-4" /> : <RiArrowRightSLine className="w-4 h-4" />
          ) : (
            <div className="w-4 h-4" />
          )}
        </span>

        <span className="mr-3">
          {isFolder ? (
            <RiFolderLine className={`w-4 h-4 ${isOpen ? 'text-amber-600' : 'text-stone-500'}`} />
          ) : (
            <RiFileTextLine className={`w-4 h-4 ${isEntryPoint ? 'text-amber-400' : 'text-stone-600'}`} />
          )}
        </span>

        <span className={`font-mono text-[13px] ${isFolder ? 'text-stone-300 font-bold' : 'text-stone-500'} group-hover:text-stone-100 transition-colors`}>
          {node.name}
        </span>

        {isEntryPoint && (
          <span className="ml-4 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-widest">
            Entry
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {isFolder && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-l border-stone-800/50 ml-[1.15rem]"
          >
            {node.children.map((child, i) => (
              <FileTreeNode key={i} node={child} depth={depth + 1} entryPoints={entryPoints} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatItem = ({ icon, label, value, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + (index * 0.1) }}
    whileHover={{ y: -4 }}
    className="bg-stone-900/40 border border-amber-900/15 rounded-[2rem] p-10 flex items-center gap-8 group hover:bg-stone-900/60 shadow-xl transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-black border border-amber-900/30 flex items-center justify-center text-amber-700 shadow-inner group-hover:text-amber-500 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="text-3xl font-bold text-stone-100 tracking-tighter group-hover:text-amber-500 transition-colors">{value}</div>
    </div>
  </motion.div>
);

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-5">
    <div className="p-2.5 bg-stone-900 border border-amber-900/30 rounded-xl shadow-lg">
      {icon}
    </div>
    <h3 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase text-stone-100">{title}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-amber-900/10 to-transparent ml-6" />
  </div>
);

export default ReportCard;