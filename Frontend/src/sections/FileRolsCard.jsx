import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import Progress from "../primitives/Progress.jsx";
import {
  RiLayoutLine,
  RiExchangeLine,
  RiDatabase2Line,
  RiBriefcaseLine,
  RiShieldLine,
  RiToolsLine,
  RiSettings4Line,
  RiFileCodeLine,
} from "react-icons/ri";

const ROLE_META = {
  UI: { icon: RiLayoutLine, label: "UI" },
  API: { icon: RiExchangeLine, label: "API" },
  Database: { icon: RiDatabase2Line, label: "Database" },
  "Business Logic": { icon: RiBriefcaseLine, label: "Business Logic" },
  Security: { icon: RiShieldLine, label: "Security" },
  Utility: { icon: RiToolsLine, label: "Utility" },
  Config: { icon: RiSettings4Line, label: "Config" },
};

/**
 * Expected shape: architecture.fileRoles -> either
 *   { "src/x.js": "UI", "src/y.js": "API", ... }  (map)
 * or
 *   [{ path, role }]  (list)
 * Either is normalized into role -> [files].
 */
const FileRolesCard = ({ fileRoles }) => {
  if (!fileRoles) return null;

  const entries = Array.isArray(fileRoles)
    ? fileRoles.map((f) => [f.path, f.role])
    : Object.entries(fileRoles);

  if (entries.length === 0) return null;

  const grouped = entries.reduce((acc, [path, role]) => {
    const key = role || "Other";
    acc[key] = acc[key] || [];
    acc[key].push(path);
    return acc;
  }, {});

  const total = entries.length;
  const roles = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-8">
      <SectionHeader icon={<RiFileCodeLine className="w-5 h-5 text-amber-600" />} title="File Roles" />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-6">
            Role Distribution
          </p>
          <div className="space-y-5">
            {roles.map(([role, files], i) => {
              const meta = ROLE_META[role] || { icon: RiFileCodeLine, label: role };
              const Icon = meta.icon;
              return (
                <div key={role}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-bold text-stone-300">{meta.label}</span>
                    <span className="ml-auto text-xs text-stone-500">{files.length}</span>
                  </div>
                  <Progress value={(files.length / total) * 100} showValue={false} delay={i * 0.05} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
            Top Responsibilities
          </p>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-amber-900/20">
            {roles.slice(0, 4).map(([role, files]) => (
              <div key={role}>
                <p className="text-xs font-bold text-amber-600 mb-1.5">{role}</p>
                <ul className="space-y-1">
                  {files.slice(0, 5).map((f) => (
                    <li key={f} className="text-xs font-mono text-stone-500 truncate">{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FileRolesCard;