import React from 'react';
import { motion } from 'framer-motion';

interface SortingVisualizerProps {
  state: any;
  highlight?: {
    compareIndices?: [number, number];
    swapping?: [number, number];
    sortedIndex?: number;
    pivotIndex?: number;
    partitionRange?: [number, number];
  };
  variables?: Record<string, any>;
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  state,
  highlight,
  variables = {},
}) => {
  const items: number[] = Array.isArray(state) ? state : [64, 34, 25, 12, 22, 11, 90];
  const compareIndices: number[] = highlight?.compareIndices || [];
  const swappingIndices: number[] = highlight?.swapping || [];
  const sortedIndex = highlight?.sortedIndex ?? variables.sortedTailIndex;
  const pivotIndex = highlight?.pivotIndex;

  const maxVal = Math.max(...items, 1);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-4 select-none">
      {/* Bars Chart Canvas */}
      <div className="flex items-end justify-center gap-3 w-full max-w-[480px] h-[220px] p-4 bg-[#101827]/80 rounded-2xl border border-[#24344A] shadow-2xl backdrop-blur-md">
        {items.map((val, idx) => {
          const isComparing = compareIndices.includes(idx);
          const isSwapping = swappingIndices.includes(idx);
          const isSorted = sortedIndex !== undefined && idx >= sortedIndex;
          const isPivot = idx === pivotIndex;

          const heightPercent = Math.max((val / maxVal) * 100, 16);

          let barColor = 'bg-[#1e293b] border-[#334155] text-[#94a3b8]';
          if (isSwapping) {
            barColor = 'bg-purple-600 border-purple-400 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.5)]';
          } else if (isComparing) {
            barColor = 'bg-cyan-500 border-cyan-300 text-cyan-950 shadow-[0_0_15px_rgba(34,211,238,0.5)]';
          } else if (isPivot) {
            barColor = 'bg-amber-500 border-amber-300 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
          } else if (isSorted) {
            barColor = 'bg-emerald-600 border-emerald-400 text-emerald-100';
          }

          return (
            <div key={`sort-col-${idx}`} className="flex-1 flex flex-col items-center justify-end h-full">
              {/* Value label above bar */}
              <span className="text-[11px] font-mono font-bold text-[#F8FAFC] mb-1">
                {val}
              </span>

              {/* Animated Bar */}
              <motion.div
                layout
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg border-t-2 border-x-2 transition-colors ${barColor}`}
              />

              {/* Index label below */}
              <span className="text-[9px] font-mono text-[#64748B] mt-1">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Sorting Color Legend */}
      <div className="flex items-center gap-5 mt-3 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cyan-400" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-500" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500" />
          <span>Sorted Region</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400" />
          <span>Pivot</span>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
