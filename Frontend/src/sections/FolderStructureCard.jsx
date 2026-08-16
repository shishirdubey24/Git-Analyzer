import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeader from "../primitives/SectionHeader.jsx";
import { RiShieldStarLine, RiFolderLine, RiFileTextLine, RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";

const FileTreeNode = ({ node, depth = 0, entryPoints = [] }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isFolder = node.type === "folder";
  const isEntryPoint = entryPoints.includes(node.path);

  return (
    <div className="select-none">
      <motion.div
        whileHover={{ x: 4 }}
        className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors text-sm hover:bg-stone-900/40 group ${isEntryPoint ? "bg-amber-900/10" : ""}`}
        onClick={() => isFolder && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        <span className="mr-2 text-stone-600 group-hover:text-amber-600 transition-colors">
          {isFolder ? (
            isOpen ? <RiArrowDownSLine className="w-4 h-4" /> : <RiArrowRightSLine className="w-4 h-4" />
          ) : (
            <div className="w-4 h-4" />
          )}
        </span>

        <span className="mr-3">
          {isFolder ? (
            <RiFolderLine className={`w-4 h-4 ${isOpen ? "text-amber-600" : "text-stone-500"}`} />
          ) : (
            <RiFileTextLine className={`w-4 h-4 ${isEntryPoint ? "text-amber-400" : "text-stone-600"}`} />
          )}
        </span>

        <span className={`font-mono text-[13px] ${isFolder ? "text-stone-300 font-bold" : "text-stone-500"} group-hover:text-stone-100 transition-colors`}>
          {node.name}
        </span>

        {isEntryPoint && (
          <span className="ml-4 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-widest">
            Entry
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {isFolder && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-l border-stone-800/50 ml-[1.15rem]"
          >
            {(node.children || []).map((child, i) => (
              <FileTreeNode key={i} node={child} depth={depth + 1} entryPoints={entryPoints} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Expected shape: structure: { tree: [], entryPoints: [] }
 */
const FolderStructureCard = ({ structure = {} }) => (
  <div className="space-y-8">
    <SectionHeader icon={<RiShieldStarLine className="w-5 h-5 text-amber-600" />} title="Structural Blueprint" />
    <div className="bg-stone-900/30 rounded-[3rem] border border-amber-900/10 p-12 overflow-hidden shadow-2xl">
      <div className="max-h-150 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-amber-900/20">
        {(structure.tree || []).length > 0 ? (
          structure.tree.map((node, i) => (
            <FileTreeNode key={i} node={node} entryPoints={structure.entryPoints || []} />
          ))
        ) : (
          <p className="text-stone-600 italic">No files detected in the root directory.</p>
        )}
      </div>
    </div>
  </div>
);

export default FolderStructureCard;
