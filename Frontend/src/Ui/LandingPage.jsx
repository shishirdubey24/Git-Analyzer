import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiSearchLine,
  RiGithubFill,
  RiFlashlightLine,
  RiShieldCheckLine,
  RiDashboardLine,
  RiArrowRightLine,
  RiLoader4Line,
  RiCodeSSlashLine,
  RiFocus3Line,
  RiGitRepositoryLine,
  RiTwitterXFill,
  RiDiscordFill,
  RiGlobalLine,
  RiCpuLine,
  RiBarChartGroupedLine,
  RiShieldLine,
  RiSparklingFill
} from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react";

const ParticleLayer = ({ count = 20 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-amber-600 rounded-full"
          initial={{ opacity: 0 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
          style={{
            left: p.left,
            top: p.top,
          }}
        />
      ))}
    </div>
  );
};

const LandingPage = () => {
  const [urlInput, setUrlInput] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnalyze = () => {
    if (!urlInput.trim()) return;
    // Navigate to report page with the url as a query param
    const encodedUrl = encodeURIComponent(urlInput.trim());
    navigate(`/report?url=${encodedUrl}`);
  };

  return (
    <div className="min-h-screen bg-black text-stone-400 font-sans selection:bg-amber-600/30 relative">
      {/* Dynamic Background Bubbles - Enlarged and intensified */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-15%] w-[1000px] h-[1000px] bg-amber-600/15 blur-[160px] rounded-full opacity-60" />
        <div className="absolute top-[20%] right-[-10%] w-[1100px] h-[1100px] bg-amber-900/30 blur-[200px] rounded-full opacity-70" />
        <div className="absolute bottom-[-15%] left-[5%] w-[900px] h-[900px] bg-amber-600/20 blur-[130px] rounded-full opacity-50" />
      </div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-xl py-3 border-none' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RiFlashlightLine className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold tracking-tighter text-stone-100">RepoLens</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-semibold text-stone-300">
            <a href="#features" className="hover:text-amber-600 transition-colors">Analyzer</a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com"
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900/50 hover:bg-stone-900 rounded-full border border-amber-900/30 transition-all text-stone-100"
            >
              <RiGithubFill className="w-5 h-5" />
              <span>GitHub</span>
            </motion.a>
          </nav>
        </div>
      </motion.header>

      <main className="relative z-10">
        <section className="max-w-4xl mx-auto px-6 pt-40 pb-24 text-center relative">
          <ParticleLayer count={20} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/20 border border-amber-800/40 text-amber-200 text-sm font-bold uppercase tracking-widest mb-10"
          >
            <RiShieldCheckLine className="w-4 h-4" />
            <span>Audit Perimeter Secured</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-8 text-stone-100"
          >
            Understand Codebases <br />
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 inline-block"
            >
              Without the Effort.
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-xl mx-auto text-xl text-stone-400 leading-relaxed mb-16"
          >
            Enter any GitHub URL and get a professional architectural assessment in seconds.
            Deterministic audit powered by signal extraction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-xl mx-auto relative group mb-20"
          >
            <div className="flex flex-col sm:flex-row gap-2 bg-stone-900/50 backdrop-blur-sm border border-amber-900/30 p-2 rounded-xl transition-all focus-within:border-amber-600/50">
              <div className="flex-1 flex items-center px-4 gap-3">
                <RiSearchLine className="text-stone-500 w-5 h-5" />
                <input
                  type="url"
                  placeholder="github.com/username/repository"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  disabled={false}
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none py-3 text-stone-100 placeholder:text-stone-500 font-medium"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyze}
                disabled={!urlInput}
                className="px-10 py-3.5 rounded-lg font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-900/50 bg-gradient-to-r from-amber-600 to-amber-800 text-stone-50 active:scale-95"
              >
                <span>Analyze</span><RiArrowRightLine className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12"
          >
            <HeroStat value="1M+" label="Modules Parsed" />
            <HeroStat value="100%" label="Accuracy Rate" />
            <HeroStat value="90%" label="Time Saved" />
          </motion.div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-6 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-stone-100 mb-4">Technical Capabilities</h3>
            <p className="text-xl text-stone-400">Static analysis without the overhead.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              index={0}
              icon={<RiDashboardLine className="w-6 h-6" />}
              title="Architecture Map"
              description="Automated traversal of your tree to categorize UI, logic, and infrastructure components."
              gradient="from-amber-600 to-amber-800"
            />
            <FeatureCard
              index={1}
              icon={<RiFocus3Line className="w-6 h-6" />}
              title="Entry Point Scan"
              description="Traces the boot sequence of applications to identify cluttered initialization paths."
              gradient="from-amber-700 to-stone-800"
            />
            <FeatureCard
              index={2}
              icon={<RiCodeSSlashLine className="w-6 h-6" />}
              title="Dependency Audit"
              description="Deep analysis of your manifests to determine the architectural weight of your stack."
              gradient="from-amber-600 to-amber-800"
            />
            <FeatureCard
              index={3}
              icon={<RiCpuLine className="w-6 h-6" />}
              title="Semantic Extraction"
              description="Beyond regex, we extract semantic signals to determine file responsibilities with 98% accuracy."
              gradient="from-amber-700 to-stone-800"
            />
            <FeatureCard
              index={4}
              icon={<RiShieldLine className="w-6 h-6" />}
              title="Security Perimeter"
              description="Instantly identifies exposed sensitive files, missing protection, and suspicious configurations."
              gradient="from-amber-600 to-amber-800"
            />
            <FeatureCard
              index={5}
              icon={<RiBarChartGroupedLine className="w-6 h-6" />}
              title="Coherence Scoring"
              description="Deterministic scoring of folder organization and architectural modularity."
              gradient="from-amber-700 to-stone-800"
            />
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-6 rounded-[2.5rem] bg-gradient-to-r from-amber-900/20 via-stone-900/30 to-amber-900/20 border border-amber-900/30 p-12 md:p-24 my-24 text-center relative overflow-hidden group"
        >
          <ParticleLayer count={15} />
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-8"
            >
              <RiSparklingFill className="w-12 h-12 text-amber-500" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-100 tracking-tight mb-8">Ready to audit?</h2>
            <p className="text-xl text-stone-300 mb-12 max-w-lg mx-auto leading-relaxed">
              Join the elite developers who audit legacy codebases in minutes, not days.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-800 text-stone-50 font-semibold uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-amber-900/50 transition-all active:scale-95"
            >
              Start First Analysis
            </motion.button>
            <p className="mt-8 text-sm text-stone-500 font-bold uppercase tracking-widest">
              Free Analysis • No GitHub Access Required
            </p>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

const HeroStat = ({ value, label }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-10 rounded-[2rem] bg-stone-900/40 backdrop-blur-md border border-amber-900/30 hover:border-amber-600/40 transition-all duration-500 group text-center flex flex-col gap-3 relative overflow-hidden shadow-lg"
  >
    <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-200 to-amber-600 group-hover:scale-110 transition-transform">
      {value}
    </div>
    <div className="text-stone-400 font-medium">
      {label}
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description, gradient, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="p-10 rounded-2xl bg-stone-900/50 backdrop-blur-sm border border-amber-900/30 hover:border-amber-600/40 transition-all duration-500 group shadow-xl"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-8 text-stone-50 shadow-lg group-hover:scale-110 transition-transform`}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-semibold text-stone-100 mb-4 tracking-tight">{title}</h3>
    <p className="text-stone-400 leading-relaxed font-normal">{description}</p>
    <div className="mt-8 flex items-center gap-2 text-sm font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
      <span>Learn more</span>
      <RiArrowRightLine className="w-4 h-4" />
    </div>
  </motion.div>
);

const Footer = () => (
  <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-amber-900/20">
    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="flex items-center gap-2">
          <RiFlashlightLine className="w-8 h-8 text-amber-600" />
          <span className="text-2xl font-bold tracking-tighter text-stone-100">RepoLens</span>
        </div>
        <p className="text-stone-400 text-sm font-medium max-w-xs text-center md:text-left leading-relaxed">
          The professional standard for rapid architectural auditing. Engineered for clarity.
        </p>
      </div>
      <div className="flex gap-4">
        <SocialIcon icon={<RiTwitterXFill className="w-5 h-5" />} />
        <SocialIcon icon={<RiGithubFill className="w-5 h-5" />} />
        <SocialIcon icon={<RiDiscordFill className="w-5 h-5" />} />
        <SocialIcon icon={<RiGlobalLine className="w-5 h-5" />} />
      </div>
    </div>
    <div className="mt-16 pt-8 border-t border-amber-900/10 flex flex-col md:row justify-between items-center text-stone-500 gap-6">
      <span className="font-medium text-sm">© 2026 RepoLens. All rights reserved.</span>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="hover:text-stone-100 transition-colors">Privacy</a>
          <a href="#" className="hover:text-stone-100 transition-colors">Terms</a>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/50 border border-white/5 text-xs">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-stone-400 font-bold tracking-widest uppercase">Stable v1.0.2</span>
        </div>
      </div>
    </div>
  </footer>
);

const SocialIcon = ({ icon }) => (
  <motion.a
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    href="#"
    className="w-11 h-11 rounded-xl bg-stone-900/50 border border-amber-900/30 flex items-center justify-center text-stone-400 hover:text-amber-600 hover:border-amber-600/50 transition-all shadow-md"
  >
    {icon}
  </motion.a>
);

export default LandingPage;