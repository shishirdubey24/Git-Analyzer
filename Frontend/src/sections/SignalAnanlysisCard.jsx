import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import Metric from "../primitives/Metric.jsx";
import Progress from "../primitives/Progress.jsx";
import Chip from "../primitives/Chip.jsx";
import { RiRadarLine } from "react-icons/ri";

/**
 * Expected shape, likely under context.signals or a dedicated `signals` key.
 * We accept either — pass whichever object your backend actually nests this
 * under as the `signals` prop.
 *
 * signals: {
 *   totalSignals,
 *   filesWithSignals,
 *   categories: [{ name, count, confidence }],
 *   mostCommonSignals: [{ name, count }],
 *   primaryCategories: []
 * }
 */
const SignalAnalysisCard = ({ signals = {} }) => {
  const categories = signals.categories || [];
  const mostCommon = signals.mostCommonSignals || signals.topSignals || [];
  const primaryCategories = signals.primaryCategories || [];

  const hasData = signals.totalSignals || categories.length || mostCommon.length;

  return (
    <div className="space-y-8">
      <SectionHeader icon={<RiRadarLine className="w-5 h-5 text-amber-600" />} title="Signal Analysis" />

      {!hasData ? (
        <Card>
          <p className="text-stone-500 italic">No signal data available for this repository.</p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 grid grid-cols-2 gap-8">
            <Metric label="Total Signals" value={signals.totalSignals ?? "—"} />
            <Metric label="Files w/ Signals" value={signals.filesWithSignals ?? "—"} />
          </Card>

          {categories.length > 0 && (
            <Card className="lg:col-span-2">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-6">
                Signal Categories
              </p>
              <div className="space-y-5">
                {categories.map((cat, i) => (
                  <div key={cat.name || i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-stone-300">{cat.name}</span>
                      <span className="text-stone-500">{cat.count ?? ""}</span>
                    </div>
                    <Progress
                      value={(cat.confidence ?? 0) * (cat.confidence <= 1 ? 100 : 1)}
                      showValue
                      delay={i * 0.05}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {mostCommon.length > 0 && (
            <Card className="lg:col-span-2">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
                Most Common Signals
              </p>
              <div className="flex flex-wrap gap-2">
                {mostCommon.map((sig, i) => (
                  <Chip key={sig.name || i}>
                    {sig.name} {sig.count !== undefined && <span className="text-amber-600 ml-1">×{sig.count}</span>}
                  </Chip>
                ))}
              </div>
            </Card>
          )}

          {primaryCategories.length > 0 && (
            <Card className="lg:col-span-1">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
                Primary Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {primaryCategories.map((cat) => (
                  <Chip key={cat} tone="amber">{cat}</Chip>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SignalAnalysisCard;