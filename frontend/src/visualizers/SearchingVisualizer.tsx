import React from 'react';
import { motion } from 'framer-motion';

interface SearchingVisualizerProps {
  state: any;
  highlight?: {
    indices?: number[];
    range?: [number, number];
    pointers?: Record<string, number | string>;
  };
  variables?: Record<string, any>;
}

export const SearchingVisualizer: React.FC<SearchingVisualizerProps> = ({
  state,
  highlight,
  variables = {},
}) => {
  const arr: number[] = Array.isArray(state) ? state : [10, 20, 30, 40, 50, 60, 70];
  const low = variables.low !== undefined ? Number(variables.low) : highlight?.pointers?.low !== undefined ? Number(highlight.pointers.low) : undefined;
  const mid = variables.mid !== undefined ? Number(variables.mid) : highlight?.pointers?.mid !== undefined ? Number(highlight.pointers.mid) : undefined;
  const high = variables.high !== undefined ? Number(variables.high) : highlight?.pointers?.high !== undefined ? Number(highlight.pointers.high) : undefined;
  const target = variables.target;
  const found = variables.found;

  const isBinary = low !== undefined || high !== undefined || mid !== undefined;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-5 select-none">
      {/* Target and Range HUD */}
      <div className="flex items-center gap-6 bg-[#101827]/80 border border-[#24344A] px-5 py-2.5 rounded-xl font-mono text-xs shadow-lg">
        {target !== undefined && (
          <div>
            Target: <strong className="text-cyan-400 text-sm">{target}</strong>
          </div>
        )}
        {isBinary && (
          <>
            <div className="w-px h-4 bg-[#24344A]" />
            <div>LOW: <strong className="text-emerald-400">{low}</strong></div>
            <div>MID: <strong className="text-cyan-400 text-sm font-bold">[{mid}] = {arr[mid ?? 0]}</strong></div>
            <div>HIGH: <strong className="text-indigo-400">{high}</strong></div>
          </>
        )}
      </div>

      {/* Pointers Row */}
      <div className="flex items-end justify-center gap-3 w-full h-8 overflow-x-auto">
        {arr.map((_, idx) => {
          const isLow = idx === low;
          const isMid = idx === mid;
          const isHigh = idx === high;

          return (
            <div key={`ptr-${idx}`} className="w-14 flex flex-col items-center justify-end font-mono text-xs font-bold">
              {isMid ? (
                <span className="text-cyan-400">MID ↓</span>
              ) : isLow ? (
                <span className="text-emerald-400">LOW ↓</span>
              ) : isHigh ? (
                <span className="text-indigo-400">HIGH ↓</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Array Elements */}
      <div className="flex items-center justify-center gap-3 p-4 bg-[#101827]/80 rounded-xl border border-[#24344A] shadow-2xl overflow-x-auto max-w-full">
        {arr.map((val, idx) => {
          const inRange = isBinary ? (low !== undefined && high !== undefined ? idx >= low && idx <= high : true) : true;
          const isMid = idx === mid;
          const isTargetMatch = val === target && (isMid || highlight?.indices?.includes(idx));

          let cellClass = 'bg-[#151F2E] border-[#24344A] text-[#F8FAFC]';
          if (isTargetMatch) {
            cellClass = 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)]';
          } else if (isMid) {
            cellClass = 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.4)]';
          } else if (!inRange) {
            cellClass = 'bg-[#090e17] border-[#182333] text-[#334155] opacity-40';
          }

          return (
            <motion.div
              key={`search-cell-${idx}`}
              layout
              className={`w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold transition-all ${cellClass}`}
            >
              <span className="text-lg">{val}</span>
              <span className="text-[10px] text-[#64748B]">[{idx}]</span>
            </motion.div>
          );
        })}
      </div>

      {/* Subtitle helper */}
      <div className="text-xs font-mono text-[#94A3B8]">
        {isBinary
          ? 'Binary search eliminates half the remaining range after each mid comparison.'
          : 'Linear search inspects elements sequentially one by one.'}
      </div>
    </div>
  );
};

export default SearchingVisualizer;
