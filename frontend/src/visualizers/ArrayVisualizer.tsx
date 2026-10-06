import React from 'react';
import { motion } from 'framer-motion';

interface ArrayVisualizerProps {
  state: any;
  highlight?: {
    indices?: number[];
    range?: [number, number];
    pointers?: Record<string, number | string>;
    compareIndices?: [number, number];
    swapping?: [number, number];
    sortedIndex?: number;
  };
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ state, highlight }) => {
  const items: any[] = Array.isArray(state) ? state : [10, 20, 30, 40, 50];
  const highlightedIndices = highlight?.indices || [];
  const compareIndices: number[] = highlight?.compareIndices || [];
  const swappingIndices: number[] = highlight?.swapping || [];
  const pointers = highlight?.pointers || {};

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 select-none">
      {/* Pointers row above array */}
      <div className="flex items-end justify-center gap-3 mb-2 h-10 w-full overflow-x-auto">
        {items.map((_, idx) => {
          const activePointerKeys = Object.entries(pointers)
            .filter(([_, pos]) => pos === idx)
            .map(([k]) => k.toUpperCase());
          return (
            <div key={`ptr-${idx}`} className="w-16 flex flex-col items-center justify-end text-xs font-mono font-bold text-cyan-400">
              {activePointerKeys.length > 0 && (
                <motion.div
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <span className="bg-cyan-950/80 border border-cyan-500/50 px-1.5 py-0.5 rounded text-[10px] tracking-tight">
                    {activePointerKeys.join(', ')}
                  </span>
                  <span className="text-cyan-400 text-sm">↓</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Array Cells */}
      <div className="flex items-center justify-center gap-3 p-4 bg-[#101827]/80 rounded-xl border border-[#24344A] shadow-2xl backdrop-blur-md overflow-x-auto max-w-full">
        {items.map((val, idx) => {
          const isComparing = compareIndices.includes(idx);
          const isSwapping = swappingIndices.includes(idx);
          const isHighlighted = highlightedIndices.includes(idx);
          const isNull = val === null || val === undefined;

          let bgClass = 'bg-[#151F2E] border-[#24344A] text-[#F8FAFC]';
          if (isSwapping) {
            bgClass = 'bg-purple-900/60 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)]';
          } else if (isComparing) {
            bgClass = 'bg-indigo-900/60 border-indigo-400 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.4)]';
          } else if (isHighlighted) {
            bgClass = 'bg-cyan-900/60 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.4)]';
          }

          return (
            <motion.div
              key={`cell-${idx}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`w-16 h-18 rounded-lg border-2 flex flex-col items-center justify-center font-mono font-bold transition-colors ${bgClass}`}
            >
              <span className="text-xl">{isNull ? '—' : val}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Index row below array */}
      <div className="flex items-start justify-center gap-3 mt-2 w-full overflow-x-auto">
        {items.map((_, idx) => (
          <div key={`idx-${idx}`} className="w-16 flex flex-col items-center text-xs font-mono text-[#64748B]">
            <span>[{idx}]</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-6 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cyan-500/80 border border-cyan-300" />
          <span>Active / Targeted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-indigo-500/80 border border-indigo-300" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-500/80 border border-purple-300" />
          <span>Swapping / Modifying</span>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualizer;
