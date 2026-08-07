import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import Metric from "../primitives/Metric.jsx";
import Progress from "../primitives/Progress.jsx";
import { RiBarChartBoxLine, RiFireLine } from "react-icons/ri";

/**
 * Expected shape (codeQuality is the most likely home for this,
 * since the old UI already read entryPointHealth/sampling from there):
 * codeQuality: {
 *   maintainabilityScore,
 *   complexityLevel,
 *   averages: { lines, functions, imports, nesting },
 *   commentRatio,
 *   largeFiles: [],
 *   hotspots: [{ file, score, reason }]
 * }
 */
const ComplexityCard = ({ codeQuality = {} }) => {
  const averages = codeQuality.averages || {};
  const largeFiles = codeQuality.largeFiles || [];
  const hotspots = codeQuality.hotspots || codeQuality.complexityHotspots || [];

  return (
    <div className="space-y-8">
      <SectionHeader icon={<RiBarChartBoxLine className="w-5 h-5 text-amber-600" />} title="Complexity" />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 space-y-8">
          <Metric label="Maintainability Score" value={codeQuality.maintainabilityScore ?? "N/A"} />
          <Metric label="Complexity Level" value={codeQuality.complexityLevel ?? "N/A"} />
          <Progress value={codeQuality.commentRatio ? codeQuality.commentRatio * (codeQuality.commentRatio <= 1 ? 100 : 1) : 0} label="Comment Ratio" tone="success" />
        </Card>

        <Card className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Metric label="Avg Lines" value={averages.lines ?? "—"} />
          <Metric label="Avg Functions" value={averages.functions ?? "—"} />
          <Metric label="Avg Imports" value={averages.imports ?? "—"} />
          <Metric label="Avg Nesting" value={averages.nesting ?? "—"} />
        </Card>

        {largeFiles.length > 0 && (
          <Card className="lg:col-span-3">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
              Large Files
            </p>
            <div className="flex flex-wrap gap-2">
              {largeFiles.map((f) => (
                <span
                  key={typeof f === "string" ? f : f.path}
                  className="px-3 py-1.5 rounded-lg bg-black/40 border border-amber-900/20 text-xs font-mono text-stone-400"
                >
                  {typeof f === "string" ? f : `${f.path} (${f.lines} ln)`}
                </span>
              ))}
            </div>
          </Card>
        )}

        {hotspots.length > 0 && (
          <Card className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <RiFireLine className="w-4 h-4 text-amber-600" />
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em]">
                Top Complexity Hotspots
              </p>
            </div>
            <div className="space-y-4">
              {hotspots.slice(0, 8).map((h, i) => (
                <div key={h.file || i} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0">
                  <span className="text-sm font-mono text-stone-300 truncate">{h.file}</span>
                  <span className="text-xs font-bold text-amber-600 shrink-0">{h.score ?? h.reason}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ComplexityCard;