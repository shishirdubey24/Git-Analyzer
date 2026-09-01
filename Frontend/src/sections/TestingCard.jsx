import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import Metric from "../primitives/Metric.jsx";
import StatusBadge from "../primitives/StatusBadge.jsx";
import Chip from "../primitives/Chip.jsx";
import { RiFlaskLine } from "react-icons/ri";

/**
 * Expected shape:
 * testing: {
 *   hasTests,
 *   coverageStatus,
 *   testFrameworks: [],
 *   docker,        // boolean or status string
 *   ciCd,          // boolean or status string
 *   pipeline: { provider, stages: [] }
 * }
 */
const TestingCard = ({ testing = {} }) => {
  const frameworks = testing.testFrameworks || testing.detectedTestFrameworks || [];
  const pipeline = testing.pipeline || {};
  const hasAnyData = testing.hasTests !== undefined || frameworks.length || testing.docker !== undefined || testing.ciCd !== undefined;

  return (
    <div className="space-y-8">
      <SectionHeader icon={<RiFlaskLine className="w-5 h-5 text-amber-600" />} title="Testing & CI/CD" />

      {!hasAnyData ? (
        <Card>
          <p className="text-stone-500 italic">No testing or pipeline signals were found in this repository.</p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 space-y-6">
            <div>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2">Has Tests</p>
              <StatusBadge status={testing.hasTests ? "Present" : "Missing"} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2">Coverage</p>
              <StatusBadge status={testing.coverageStatus || "Unknown"} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2">Docker</p>
                <StatusBadge status={testing.docker ? "Configured" : "Absent"} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2">CI/CD</p>
                <StatusBadge status={testing.ciCd ? "Configured" : "Absent"} />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
                Detected Test Frameworks
              </p>
              {frameworks.length ? (
                <div className="flex flex-wrap gap-2">
                  {frameworks.map((f) => (
                    <Chip key={f} tone="amber">{f}</Chip>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 italic text-sm">No test frameworks detected.</p>
              )}
            </div>

            {(pipeline.provider || (pipeline.stages || []).length > 0) && (
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-3">
                  Pipeline
                </p>
                {pipeline.provider && (
                  <Metric label="Provider" value={pipeline.provider} />
                )}
                {(pipeline.stages || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {pipeline.stages.map((s) => (
                      <Chip key={s} tone="muted">{s}</Chip>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default TestingCard;