import { motion } from "motion/react";
import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import Metric from "../primitives/Metric.jsx";
import StatusBadge from "../primitives/StatusBadge.jsx";
import List from "../primitives/List.jsx";
import { RiBookReadLine, RiFlaskLine } from "react-icons/ri";

/**
 * Expected shape:
 * documentation: {
 *   readmeStatus,
 *   coverage,          // 0-100 or 0-1
 *   missing: [],
 *   findings: []
 * }
 * codeQuality.entryPointHealth is reused for "Entry Point Hygiene"
 * (this is the same data the old UI called "Boot Sequence Hygiene").
 */
const DocumentationCard = ({ documentation = {}, entryPointHealth = {} }) => {
  const missing = documentation.missing || [];
  const findings = documentation.findings || [];
  const entries = Object.entries(entryPointHealth || {});

  return (
    <div className="space-y-8">
      <SectionHeader icon={<RiBookReadLine className="w-5 h-5 text-amber-600" />} title="Documentation" />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 space-y-6">
          <div>
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-2">README Status</p>
            <StatusBadge status={documentation.readmeStatus || "Unknown"} />
          </div>
          <Metric
            label="Documentation Coverage"
            value={
              documentation.coverage !== undefined
                ? `${Math.round(documentation.coverage <= 1 ? documentation.coverage * 100 : documentation.coverage)}%`
                : "N/A"
            }
          />
        </Card>

        <Card className="lg:col-span-2">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
            Missing Documentation
          </p>
          <List items={missing} empty="Nothing flagged as missing." />
        </Card>

        {findings.length > 0 && (
          <Card className="lg:col-span-3">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
              Documentation Findings
            </p>
            <List items={findings} />
          </Card>
        )}

        {entries.length > 0 && (
          <div className="lg:col-span-3 space-y-6">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em]">
              Entry Point Hygiene
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {entries.map(([file, health], i) => (
                <motion.div
                  key={file}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 rounded-[2rem] border ${
                    health.status === "Clean" ? "bg-stone-900/20 border-green-900/20" : "bg-red-950/10 border-red-900/20"
                  } shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <RiFlaskLine className={health.status === "Clean" ? "text-green-500" : "text-amber-500"} />
                    <span className="font-mono text-sm font-bold text-stone-200">{file}</span>
                    <span className="ml-auto">
                      <StatusBadge status={health.status} />
                    </span>
                  </div>
                  {health.issues?.length > 0 ? (
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
        )}
      </div>
    </div>
  );
};

export default DocumentationCard;