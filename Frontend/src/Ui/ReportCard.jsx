import { useState } from "react";
import {
  RiGithubFill,
  RiFileCodeLine,
  RiPulseFill,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiFolderOpenLine,
  RiInformationLine,
  RiStackLine,
  RiTrelloLine,
  RiSpam2Line,
  RiListCheck,
  RiArchiveDrawerLine,
  RiScan2Line,
  RiFolderLine,
  RiFileTextLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiShieldStarLine,
  RiHistoryLine,
  RiFlaskLine,
  RiLayoutMasonryLine,
  RiServerLine,
  RiDatabase2Line
} from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react";

const ReportCard = ({ data }) => {
  if (!data) return <div className="text-center py-20 text-stone-500">No analysis data available.</div>;

  const { summary: summaryData, architecture: architectureData, critique: critiqueData,
    codeQuality: codeQualityData, context: contextData, dependencies: dependenciesData,
    structure: structureData } = data;
  const summary = summaryData || {};
  const architecture = architectureData || {};
  const critique = critiqueData || {};
  const codeQuality = codeQualityData || {};
  const context = contextData || {};
  const dependencies = dependenciesData || {};
  const structure = structureData || {};
  const sampling = codeQuality.sampling || {};
  const entryPointHealth = codeQuality.entryPointHealth || {};
  const redFlags = critique.redFlags || [];
  const summaryStats = summary.stats || {};
  const strengths = summary.strengths || summary.whatStandsOut || [];
  const analysisLimits = summary.whatWasNotAnalyzed || [];
  const folderStructureIntent = architecture.folderStructureIntent || {};
  const fileResponsibilities = architecture.fileResponsibilities || {};
  const entryPoints = structure.entryPoints || [];
  const tree = structure.tree || [];
  const dependenciesList = dependencies.dependenciesList || context.dependencies || [];
  const codeSignals = codeQuality.signals || {};
  const sourceRoot = context.sourceRoot;
  const totalFiles = context.totalFiles ?? summaryStats.totalFiles ?? summaryStats.fileCount ?? 0;
  const scanCoverage = getScanCoverage(sampling.totalFilesScanned, totalFiles);
  const averageCoherence = summaryStats.avgCoherence || getAverageCoherence(folderStructureIntent);
  const framework = dependencies.detectedFrameworks?.join(", ")
    || summaryStats.frameworks?.join(", ")
    || summaryStats.framework;

  const getScoreColorClass = (score) => {
    if (score >= 90) return "from-amber-200 via-amber-400 to-amber-600";
    if (score >= 70) return "from-amber-400 to-amber-700";
    return "from-amber-600 to-amber-900";
  };

  const scoreGradient = getScoreColorClass(summary?.score || 0);

  const frontendFiles = [];
  const backendFiles = [];
  const dbFiles = [];
  const otherFiles = [];

  Object.entries(codeQuality.signalDetails?.fileLevelSummary || {}).forEach(([file, summary]) => {
    const cat = summary.primaryCategory;
    const lfile = file.toLowerCase();
    
    if (["UI", "State Management"].includes(cat) || lfile.includes('frontend') || lfile.includes('components') || lfile.includes('ui') || lfile.includes('pages')) {
      frontendFiles.push([file, summary]);
    } else if (["Database"].includes(cat) || lfile.includes('db') || lfile.includes('database') || lfile.includes('schema') || lfile.includes('model') || lfile.includes('entity')) {
      dbFiles.push([file, summary]);
    } else if (["API Logic", "Security", "Risk"].includes(cat) || lfile.includes('backend') || lfile.includes('api') || lfile.includes('route') || lfile.includes('controller') || lfile.includes('service')) {
      backendFiles.push([file, summary]);
    } else {
      otherFiles.push([file, summary]);
    }
  });

  const renderSignalGroup = (title, icon, files) => {
    if (files.length === 0) return null;
    return (
      <div className="space-y-6 mt-8">
        <h3 className="text-sm font-bold text-stone-300 uppercase tracking-widest flex items-center gap-3 border-b border-amber-900/30 pb-3">
          {icon} {title}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {files.map(([file, summary], i) => (
            <motion.div
              key={file}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-stone-900/30 border border-amber-900/10 shadow-lg flex flex-col justify-between"
            >
              <div className="mb-6">
                <p className="font-mono text-sm font-bold text-stone-200 mb-3 truncate" title={file}>{file}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Primary: {summary.primaryCategory}
                  </span>
                  <span className="text-xs font-bold text-stone-500 bg-black/40 px-2 py-1 rounded-lg">
                    {summary.totalHits} occurrences
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${summary.confidence > 0.8 ? 'bg-green-900/20 text-green-500' : 'bg-amber-900/20 text-amber-500'}`}>
                    {Math.round((summary.confidence || 0) * 100)}% Conf
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(summary.details || []).map((detail, idx) => (
                  <div key={idx} className="group relative">
                    <span className="px-3 py-1.5 rounded-xl bg-black border border-amber-900/20 text-[11px] font-bold text-stone-300 tracking-wide cursor-default flex items-center gap-2 hover:border-amber-600/50 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600/50" />
                      {detail.signal.replace(/([A-Z])/g, ' $1').trim()}
                      <span className="text-stone-600 font-mono">({detail.count})</span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

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
                {dependencies.projectType || context.projectType || "Audit"}
              </span>
              <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900/60 border border-amber-900/10 text-stone-400 text-xs font-bold uppercase tracking-widest">
                <RiPulseFill className="w-4 h-4 text-amber-600 animate-pulse" />
                {data.meta?.analyzedAt ? new Date(data.meta.analyzedAt).toLocaleDateString() : "Present"}
              </span>
              {framework && (
                <span className="px-5 py-2 rounded-full bg-stone-900/60 border border-amber-900/10 text-stone-400 text-xs font-bold uppercase tracking-widest">
                  {framework}
                </span>
              )}
              {sourceRoot && (
                <span className="px-5 py-2 rounded-full bg-stone-900/60 border border-amber-900/10 text-stone-400 text-xs font-bold uppercase tracking-widest">
                  Source: {sourceRoot}
                </span>
              )}
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
          value={totalFiles}
        />
        <StatItem
          index={1}
          icon={<RiScan2Line className="w-5 h-5" />}
          label="Deep Samples"
          value={sampling.totalFilesScanned || "0"}
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
          value={averageCoherence}
        />
      </div>

      {/* 3. CORE ANALYTICS GRID */}
      <div className="grid lg:grid-cols-3 gap-16">

        <div className="lg:col-span-2 space-y-12">
          {/* A. ARCHITECTURAL STRENGTHS */}
          <div className="space-y-8">
            <SectionHeader icon={<RiCheckboxCircleLine className="w-5 h-5 text-amber-600" />} title="Architectural Capabilities & Stack" />
            <p className="text-sm text-stone-400 max-w-4xl font-medium leading-relaxed mt-[-1rem]">
              This section provides a holistic breakdown of the repository's capabilities. It evaluates the project across four dimensions: overall repository infrastructure, frontend rendering patterns, backend logic architecture, and data layer presence, providing a comprehensive technical summary.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {strengths.length > 0 ? (
                strengths.map((item, i) => {
                  const category = typeof item === 'string' ? 'General Insights' : item.category;
                  const points = typeof item === 'string' ? [item] : item.points;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 rounded-[2rem] bg-stone-900/40 border border-amber-900/20 shadow-lg flex flex-col gap-4"
                    >
                      <h4 className="text-sm font-bold text-stone-300 uppercase tracking-widest border-b border-amber-900/30 pb-3 mb-2">{category}</h4>
                      <ul className="space-y-4">
                        {points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-4">
                            <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.6)] shrink-0" />
                            <p className="text-stone-400 text-sm leading-relaxed">{point}</p>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-stone-500 italic p-4">Limited structural insights detected for this repository.</p>
              )}
            </div>
          </div>

          {codeSignals && Object.keys(codeSignals).length > 0 && (
            <div className="space-y-8">
              <SectionHeader icon={<RiScan2Line className="w-5 h-5 text-amber-600" />} title="Architectural Logic Signals" />
              <p className="text-sm text-stone-400 max-w-4xl font-medium leading-relaxed mt-[-1rem]">
                This section decodes the core intent and structural patterns of the application. 
                By highlighting major paradigms like State Management, API Logic, or Security, it allows non-technical stakeholders to quickly understand the primary responsibilities and logic flow of the codebase.
              </p>
              
              {/* Overall Repo Signals Summary */}
              {codeQuality.signalDetails?.repoLevelSummary && (
                <div className="flex flex-wrap gap-6 p-8 bg-stone-900/40 border border-amber-900/20 rounded-[2rem] shadow-lg mb-6 items-center">
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Total Signals Detected</p>
                    <p className="text-3xl font-black text-stone-200">{codeQuality.signalDetails.repoLevelSummary.totalHits || 0}</p>
                  </div>
                  <div className="h-12 w-px bg-amber-900/20 hidden md:block" />
                  <div className="flex flex-col flex-1">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Dominant Characteristics</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(codeQuality.signalDetails.repoLevelSummary.categoryTotals || {}).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([cat, cnt]) => (
                        <span key={cat} className="px-3 py-1.5 rounded-xl bg-black border border-stone-800 text-xs font-bold text-stone-300 flex items-center gap-2 shadow-sm">
                          {cat} <span className="text-amber-600 bg-amber-900/20 px-1.5 py-0.5 rounded-md">{cnt}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* File Level Signals Grouped */}
              {renderSignalGroup("Frontend UI & State", <RiLayoutMasonryLine className="w-5 h-5 text-amber-500" />, frontendFiles)}
              {renderSignalGroup("Backend Logic & API", <RiServerLine className="w-5 h-5 text-amber-500" />, backendFiles)}
              {renderSignalGroup("Database & Data Models", <RiDatabase2Line className="w-5 h-5 text-amber-500" />, dbFiles)}
              {renderSignalGroup("Other Core Signals", <RiFileCodeLine className="w-5 h-5 text-amber-500" />, otherFiles)}  
                {/* Fallback if signalDetails is missing */}
                {!codeQuality.signalDetails && (
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {Object.entries(codeSignals).map(([file, signals], i) => (
                      <motion.div
                        key={file}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[2rem] bg-stone-900/30 border border-amber-900/10 shadow-lg"
                      >
                        <p className="font-mono text-sm font-bold text-stone-200 mb-4">{file}</p>
                        <div className="flex flex-wrap gap-2">
                          {toSignalLabels(signals).map((signal) => (
                            <span key={signal} className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-900/20 text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                              {signal}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {sampling.details && sampling.details.length > 0 && (
            <div className="space-y-8">
              <SectionHeader icon={<RiFolderLine className="w-5 h-5 text-amber-600" />} title="Sampled Files Details" />
              <div className="grid md:grid-cols-2 gap-6">
                {sampling.details.map((file, i) => (
                  <motion.div
                    key={file.path}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2rem] bg-stone-900/30 border border-amber-900/10 shadow-lg"
                  >
                    <p className="font-mono text-sm font-bold text-stone-200 mb-4 truncate" title={file.path}>{file.path}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-900/20 text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                        Score: {file.score}
                      </span>
                      {file.size !== undefined && (
                        <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-900/20 text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                          Size: {Math.max(1, Math.round(file.size / 1024))} KB
                        </span>
                      )}
                      {file.isCritical && (
                        <span className="px-3 py-1.5 rounded-lg bg-red-950 border border-red-900/40 text-[11px] font-bold text-red-400 uppercase tracking-wide">
                          Critical
                        </span>
                      )}
                      {file.isEntry && (
                        <span className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-900/40 text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                          Entry Point
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(fileResponsibilities).length > 0 && (
            <div className="space-y-8">
              <SectionHeader icon={<RiFileCodeLine className="w-5 h-5 text-amber-600" />} title="File Responsibilities" />
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(fileResponsibilities).map(([file, responsibility], i) => (
                  <motion.div
                    key={file}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2rem] bg-stone-900/30 border border-amber-900/10 shadow-lg"
                  >
                    <p className="font-mono text-sm font-bold text-stone-200 mb-3">{file}</p>
                    <p className="text-sm text-stone-400 font-medium">{responsibility}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {analysisLimits.length > 0 && (
            <div className="space-y-8">
              <SectionHeader icon={<RiInformationLine className="w-5 h-5 text-amber-600" />} title="Analysis Scope" />
              <div className="grid md:grid-cols-1 gap-6">
                {analysisLimits.map((item, i) => (
                  <div key={i} className="group p-8 rounded-2xl bg-stone-900/30 border border-amber-900/10 shadow-lg">
                    <div className="flex items-start gap-6">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.6)] shrink-0" />
                      <p className="text-stone-400 leading-relaxed font-medium text-base">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B. BOOT HYGIENE (NEW REFINED SECTION) */}
          <div className="space-y-8">
            <SectionHeader icon={<RiHistoryLine className="w-5 h-5 text-amber-600" />} title="Boot Sequence Hygiene" />
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(entryPointHealth).map(([file, health], i) => (
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
                  {(health.issues || []).length > 0 ? (
                    <ul className="space-y-2">
                      {(health.issues || []).map((issue, j) => (
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
              {Object.entries(folderStructureIntent).length > 0 ? Object.entries(folderStructureIntent).slice(0, 8).map(([folder, stats], i) => (
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
                  <p className="text-xs text-stone-600 font-medium">{stats.filesAnalyzed || 0} files analyzed</p>
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
          {(dependenciesList.length > 0 || dependencies.totalDependencies > 0) && (
            <div className="space-y-8 pt-4">
              <SectionHeader icon={<RiListCheck className="w-5 h-5 text-amber-600" />} title="Infrastructure & Stack" />
              <div className="bg-stone-900/40 rounded-[2rem] border border-amber-900/20 p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Total Packages</p>
                    <p className="text-2xl font-black text-stone-200">{dependencies.totalDependencies || dependenciesList.length}</p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col justify-center gap-2">
                    {dependencies.hasDatabaseDeps && (
                      <span className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-900/20 px-3 py-1.5 rounded-lg w-fit">
                        <RiFolderOpenLine className="w-4 h-4" /> Database/ORM Detected
                      </span>
                    )}
                    {dependencies.hasSecurityDeps && (
                      <span className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-900/20 px-3 py-1.5 rounded-lg w-fit">
                        <RiShieldStarLine className="w-4 h-4" /> Auth/Security Detected
                      </span>
                    )}
                  </div>
                </div>

                {dependencies.detectedFrameworks && dependencies.detectedFrameworks.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Core Frameworks</p>
                    <div className="flex flex-wrap gap-2">
                      {dependencies.detectedFrameworks.map((fw) => (
                        <span key={fw} className="px-4 py-2 rounded-xl bg-amber-900/20 border border-amber-900/40 text-sm font-bold text-amber-400 shadow-sm">
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Key Dependencies</p>
                  <div className="flex flex-wrap gap-2">
                    {dependenciesList.slice(0, 24).map((dep) => (
                      <span key={dep} className="px-3 py-1.5 rounded-lg bg-stone-900/80 border border-stone-800 text-xs font-bold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-default">
                        {dep.split('/').pop()}
                      </span>
                    ))}
                    {dependenciesList.length > 24 && (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-stone-600 flex items-center">
                        +{dependenciesList.length - 24} more
                      </span>
                    )}
                  </div>
                </div>
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
            {tree.length > 0 ? tree.map((node, i) => (
              <FileTreeNode key={i} node={node} entryPoints={entryPoints} />
            )) : (
              <p className="text-stone-600 italic">No files detected in the root directory.</p>
            )}
          </div>
        </div>
      </div>

      {/* 5. CRITICAL SIGNALS */}
      {redFlags.length > 0 && (
        <div className="space-y-10">
          <SectionHeader icon={<RiSpam2Line className="w-5 h-5 text-red-500 animate-pulse" />} title="Logic Perimeter" />
          <div className="grid gap-6">
            {redFlags.map((flag, i) => (
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
            Found {totalFiles} entities. Samples: {sampling.totalFilesScanned || 0}{scanCoverage ? ` (${scanCoverage} coverage)` : ""}. Entry points: {entryPoints.length}.
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
            {(node.children || []).map((child, i) => (
              <FileTreeNode key={i} node={child} depth={depth + 1} entryPoints={entryPoints} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getAverageCoherence = (folders) => {
  const values = Object.values(folders || {})
    .map(({ coherence }) => Number.parseFloat(coherence))
    .filter(Number.isFinite);

  return values.length
    ? `${Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 100)}%`
    : "N/A";
};

const getScanCoverage = (scannedFiles, totalFiles) => {
  const scanned = Number(scannedFiles);
  const total = Number(totalFiles);

  return Number.isFinite(scanned) && Number.isFinite(total) && total > 0
    ? `${Math.round((scanned / total) * 100)}%`
    : "";
};

const toSignalLabels = (signals) => {
  if (Array.isArray(signals)) return signals;
  if (signals && typeof signals === "object") return Object.keys(signals);
  return [];
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
