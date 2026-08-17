import SectionHeader from "../primitives/SectionHeader.jsx";
import Card from "../primitives/Card.jsx";
import Chip from "../primitives/Chip.jsx";
import Metric from "../primitives/Metric.jsx";
import { RiListCheck } from "react-icons/ri";

/**
 * Reads exclusively from `dependencies` (per spec — not `context`).
 * Expected shape:
 * dependencies: {
 *   detectedFrameworks: [],
 *   categories: { category: [deps] } | [{ name, items }],
 *   projectType,
 *   databaseTechnologies: [],
 *   securityLibraries: [],
 *   count
 * }
 */
const TechStackCard = ({ dependencies = {} }) => {
  const frameworks = dependencies.detectedFrameworks || [];
  const databases = dependencies.databaseTechnologies || [];
  const securityLibs = dependencies.securityLibraries || [];
  const count = dependencies.count ?? dependencies.total ?? 0;

  const categories = Array.isArray(dependencies.categories)
    ? dependencies.categories
    : Object.entries(dependencies.categories || {}).map(([name, items]) => ({ name, items }));

  const hasAnyData = frameworks.length || databases.length || securityLibs.length || categories.length;

  return (
    <div className="space-y-8">
      <SectionHeader icon={<RiListCheck className="w-5 h-5 text-amber-600" />} title="Tech Stack" />

      {!hasAnyData ? (
        <Card>
          <p className="text-stone-500 italic">No dependency data was returned for this repository.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-3 grid sm:grid-cols-3 gap-8">
            <Metric label="Project Type" value={dependencies.projectType || "—"} />
            <Metric label="Dependency Count" value={count} />
            <Metric label="Categories" value={categories.length} />
          </Card>

          {frameworks.length > 0 && (
            <Card className="md:col-span-3">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
                Detected Frameworks
              </p>
              <div className="flex flex-wrap gap-3">
                {frameworks.map((fw) => (
                  <Chip key={fw} tone="amber">{fw}</Chip>
                ))}
              </div>
            </Card>
          )}

          {databases.length > 0 && (
            <Card>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
                Database Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {databases.map((db) => (
                  <Chip key={db}>{db}</Chip>
                ))}
              </div>
            </Card>
          )}

          {securityLibs.length > 0 && (
            <Card>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
                Security Libraries
              </p>
              <div className="flex flex-wrap gap-2">
                {securityLibs.map((lib) => (
                  <Chip key={lib} tone="success">{lib}</Chip>
                ))}
              </div>
            </Card>
          )}

          {categories.length > 0 && (
            <Card className={databases.length || securityLibs.length ? "" : "md:col-span-2"}>
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">
                Dependency Categories
              </p>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.name}>
                    <p className="text-xs font-bold text-stone-400 mb-2">{cat.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {(cat.items || []).map((item) => (
                        <Chip key={item} tone="muted">{item}</Chip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TechStackCard;