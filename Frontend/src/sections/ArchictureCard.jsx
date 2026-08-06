import { motion } from "motion/react";
import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import Metric from "../primitives/Metric.jsx";
import Progress from "../primitives/Progress.jsx";
import { RiShieldStarLine, RiFolderOpenLine } from "react-icons/ri";

/**
 * Expected shape:
 * architecture: {
 *   primaryPattern,
 *   confidence,        // 0-1 or 0-100
 *   evidenceScore,      // 0-1 or 0-100
 *   layerDistribution: { layerName: count } | [{ name, value }],
 *   folderStructureIntent: { folder: { dominantType, coherence } },
 *   patternRationale,
 *   summary
 * }
 */
const toPercent = (n) => (n === undefined || n === null ? 0 : n <= 1 ? n * 100 : n);

const ArchitectureCard = ({ architecture = {} }) => {
  const layers = Array.isArray(architecture.layerDistribution)
    ? architecture.layerDistribution
    : Object.entries(architecture.layerDistribution || {}).map(([name, value]) => ({ name, value }));

  const folders = Object.entries(architecture.folderStructureIntent || {});

  return (
    <div className="space-y-8">
      <SectionHeader icon={<RiShieldStarLine className="w-5 h-5 text-amber-600" />} title="Architecture" />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 space-y-8">
          <Metric label="Primary Pattern" value={architecture.primaryPattern || "Unclassified"} />
          <div>
            <Progress value={toPercent(architecture.confidence)} label="Confidence" />
          </div>
          <div>
            <Progress value={toPercent(architecture.evidenceScore)} label="Evidence Score" tone="success" />
          </div>
        </Card>

        {layers.length > 0 && (
          <Card className="lg:col-span-2">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-6">
              Layer Distribution
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {layers.map((layer, i) => (
                <div key={layer.name || i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-stone-300">{layer.name}</span>
                    <span className="text-stone-500">{layer.value}</span>
                  </div>
                  <Progress
                    value={typeof layer.value === "number" && layer.value <= 1 ? layer.value * 100 : Math.min(layer.value, 100)}
                    showValue={false}
                    delay={i * 0.05}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {architecture.patternRationale && (
          <Card className="lg:col-span-3" tone="warning">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-3">
              Pattern Rationale
            </p>
            <p className="text-stone-300 leading-relaxed">{architecture.patternRationale}</p>
          </Card>
        )}

        {architecture.summary && (
          <Card className="lg:col-span-3">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-3">
              Repository Architecture Summary
            </p>
            <p className="text-stone-300 leading-relaxed">{architecture.summary}</p>
          </Card>
        )}

        {folders.length > 0 && (
          <Card className="lg:col-span-3">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-6">
              Folder Intent
            </p>
            <div className="space-y-6">
              {folders.slice(0, 10).map(([folder, stats], i) => (
                <div key={folder} className="flex flex-col gap-3 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-900/10 rounded-lg group-hover:bg-amber-900/20 transition-colors">
                        <RiFolderOpenLine className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-stone-200 font-mono text-sm md:text-base font-bold tracking-tight lowercase">
                        {folder}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-stone-900 border border-white/5 text-amber-400">
                      {stats.dominantType}
                    </span>
                  </div>
                  <Progress value={toPercent(stats.coherence ?? 0.5)} showValue={false} delay={0.05 * i} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ArchitectureCard;