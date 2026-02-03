import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { analyzeRepository } from "../Service/RepoService.js";
import ReportCard from "./ReportCard.jsx";
import {
    RiFlashlightLine,
    RiArrowRightLine,
    RiLoader4Line
} from "react-icons/ri";
import { motion } from "motion/react";

const ReportPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const url = searchParams.get("url");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!url) {
            navigate("/home");
            return;
        }

        const runAnalysis = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await analyzeRepository(url);
                console.log("Analysis Result:", data);
                if (data && data.Analysis) {
                    setResult(data);
                } else {
                    setError("The server returned an empty analysis result. The repository might be empty or unsupported.");
                }
            } catch (err) {
                console.error("Analysis Error:", err);
                setError(err.error || err.message || "Analysis failed. Please check the URL.");
            } finally {
                setLoading(false);
            }
        };

        runAnalysis();
    }, [url, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-stone-300">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-600/20 blur-3xl rounded-full" />
                        <RiLoader4Line className="w-16 h-16 text-amber-600 animate-spin relative z-10" />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-stone-100">Analyzing Repository</h2>
                        <p className="text-stone-500 font-medium">Extracting signals and mapping architecture...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-stone-300 p-6">
                <div className="max-w-md w-full bg-stone-900/50 border border-red-900/30 p-10 rounded-3xl text-center space-y-6">
                    <div className="w-16 h-16 bg-red-950/30 border border-red-900/50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                        <RiFlashlightLine className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-stone-100">Analysis Failed</h2>
                        <p className="text-stone-400">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate("/home")}
                        className="w-full py-4 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold rounded-xl transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (result && result.Analysis) {
        return (
            <div className="min-h-screen bg-black text-stone-300 selection:bg-amber-600/30">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-black/95 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-none"
                >
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/home")}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center shadow-amber-900/20 shadow-lg"
                        >
                            <RiFlashlightLine className="w-5 h-5 text-stone-50" />
                        </motion.div>
                        <h1 className="text-2xl font-bold tracking-tight text-stone-100">
                            Repo<span className="text-amber-600">Lens</span>
                        </h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/home")}
                        className="flex items-center gap-2 font-semibold uppercase tracking-wider text-stone-400 hover:text-amber-600 transition-all cursor-pointer"
                    >
                        <span>Scan New</span>
                        <RiArrowRightLine className="w-5 h-5" />
                    </motion.button>
                </motion.nav>
                <main className="p-6 md:p-10 max-w-7xl mx-auto">
                    <ReportCard data={result.Analysis} />
                </main>
                <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-amber-900/20 text-center text-stone-500 text-sm">
                    © 2026 RepoLens. All rights reserved.
                </footer>
            </div>
        );
    }

    return null;
};

export default ReportPage;
