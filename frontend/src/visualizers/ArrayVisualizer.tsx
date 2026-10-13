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
    operationType?: 'current' | 'accessed' | 'modified' | 'compared';
  };
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ state, highlight }) => {
  const items: any[] = Array.isArray(state) && state.length > 0 ? state : [10, 20, 30, 40, 50];
  const highlightedIndices = highlight?.indices || (items.length > 2 ? [2] : [0]);
  const compareIndices: number[] = highlight?.compareIndices || [];
  const swappingIndices: number[] = highlight?.swapping || [];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-4 px-2 select-none">
      <div className="flex flex-col items-center w-full max-w-2xl overflow-x-auto py-2">
        {/* Index row header */}
        <div className="flex items-center justify-center gap-2 mb-2 w-full">
          <div className="w-12 text-right pr-2 text-xs font-mono font-bold text-[#64748B]">
            Index
          </div>
          <div className="flex items-center gap-2">
            {items.map((_, idx) => {
              const isCurrent = highlightedIndices.includes(idx);
              return (
                <div
                  key={`idx-${idx}`}
                  className={`w-16 text-center text-xs font-mono transition-colors ${
                    isCurrent ? 'text-[#22D3EE] font-bold scale-110' : 'text-[#64748B]'
                  }`}
                >
                  {idx}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Contiguous Array Blocks row */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-12" /> {/* alignment spacer */}
          <div className="flex items-center gap-2 p-1.5 bg-[#0A1120]/80 rounded-2xl border border-[#24344A]/60 shadow-xl">
            {items.map((val, idx) => {
              const isComparing = compareIndices.includes(idx);
              const isSwapping = swappingIndices.includes(idx);
              const isCurrent = highlightedIndices.includes(idx);
              const isNull = val === null || val === undefined;

              // Border and glow style matching reference
              let blockStyle = 'bg-[#101827] border-[#24344A] text-[#F8FAFC]';
              if (isCurrent) {
                blockStyle = 'bg-[#101827] border-2 border-[#22D3EE] text-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.45)] ring-1 ring-[#22D3EE]/50';
              } else if (isSwapping) {
                blockStyle = 'bg-[#101827] border-2 border-[#22C55E] text-[#22C55E] shadow-[0_0_20px_rgba(34,197,94,0.45)]';
              } else if (isComparing) {
                blockStyle = 'bg-[#101827] border-2 border-[#F59E0B] text-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.45)]';
              }

              return (
                <motion.div
                  key={`cell-${idx}`}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`w-16 h-18 rounded-xl border flex items-center justify-center font-mono font-extrabold text-xl transition-all duration-200 ${blockStyle}`}
                >
                  <span>{isNull ? '—' : val}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Pointers row with upward arrows directly beneath boxes */}
        <div className="flex items-start justify-center gap-2 w-full mb-4">
          <div className="w-12" /> {/* alignment spacer */}
          <div className="flex items-start gap-2">
            {items.map((_, idx) => {
              const isCurrent = highlightedIndices.includes(idx);
              return (
                <div
                  key={`ptr-${idx}`}
                  className={`w-16 flex flex-col items-center justify-center font-mono text-xs transition-colors ${
                    isCurrent ? 'text-[#22D3EE] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  <span className="text-sm leading-none mb-0.5">↑</span>
                  <span className="text-[11px] tracking-tight">{`arr[${idx}]`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend matching Reference 2 bottom */}
      <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#24344A]/60 w-full max-w-lg text-xs font-mono text-[#CBD5E1]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
          <span>Accessed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          <span>Modified</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span>Compared</span>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualizer;
