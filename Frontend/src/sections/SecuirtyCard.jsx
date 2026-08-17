import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import Metric from "../primitives/Metric.jsx";
import StatusBadge from "../primitives/StatusBadge.jsx";
import List from "../primitives/List.jsx";
import { RiShieldCheckLine, RiAlertLine } from "react-icons/ri";

/**
 * Expected shape:
 * security: {
 *   riskLevel,
 *   sensitiveFiles: [],
 *   hardcodedSecrets: [],
 *   findings: [{ message, severity }],
 *   recommendations: []
 * }
 */
const SecurityCard = ({ security = {} }) => {
  const findings = security.findings || security.securityFindings || [];
  const sensitiveFiles = security.sensitiveFiles || [];
  const secrets = security.hardcodedSecrets || [];
  const recommendations = security.recommendations || [];

  const isHealthy = (security.riskLevel || "").toLowerCase() === "low" && findings.length === 0 && secrets.length === 0;

  return (
    <div className="space-y-8">
      <SectionHeader icon={<RiShieldCheckLine className="w-5 h-5 text-amber-600" />} title="Security" />

      {isHealthy ? (
        <Card tone="success">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
              <RiShieldCheckLine className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-stone-100">No security risks detected</p>
              <p className="text-sm text-stone-500">No hardcoded secrets or sensitive-file exposure found in this scan.</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-3">Risk Level</p>
            <StatusBadge status={security.riskLevel || "Unknown"} />
            <div className="grid grid-cols-2 gap-6 mt-8">
              <Metric label="Sensitive Files" value={sensitiveFiles.length} />
              <Metric label="Hardcoded Secrets" value={secrets.length} />
            </div>
          </Card>

          <Card className="lg:col-span-2" tone={findings.length ? "danger" : "default"}>
            <div className="flex items-center gap-2 mb-4">
              <RiAlertLine className="w-4 h-4 text-red-500" />
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em]">Findings</p>
            </div>
            {findings.length === 0 ? (
              <p className="text-stone-500 italic text-sm">No findings reported.</p>
            ) : (
              <div className="space-y-4">
                {findings.map((f, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0">
                    <p className="text-sm text-stone-300">{f.message || f}</p>
                    {f.severity && <StatusBadge status={f.severity} />}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {(sensitiveFiles.length > 0 || secrets.length > 0) && (
            <Card className="lg:col-span-3 grid sm:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-3">Sensitive Files</p>
                <List items={sensitiveFiles} empty="None detected." />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-3">Hardcoded Secrets</p>
                <List items={secrets} empty="None detected." />
              </div>
            </Card>
          )}

          {recommendations.length > 0 && (
            <Card className="lg:col-span-3">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-3">Recommendations</p>
              <List items={recommendations} />
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityCard;