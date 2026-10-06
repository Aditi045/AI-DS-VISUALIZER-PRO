import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecursionVisualizerProps {
  state: any;
  callStack?: string[];
  variables?: Record<string, any>;
}

export const RecursionVisualizer: React.FC<RecursionVisualizerProps> = ({
  state,
  callStack,
  variables = {},
}) => {
  const frames: string[] = callStack || (Array.isArray(state) ? state : ['main()', 'factorial(4)', 'factorial(3)']);
  const depth = variables.depth || frames.length;
  const isBaseCase = variables.baseCase;
  const returnValue = variables.returnValue;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-4 select-none">
      {/* Return / Base case HUD */}
      <div className="flex items-center gap-4 mb-2">
        {isBaseCase && (
          <span className="bg-emerald-950 border border-emerald-400 text-emerald-200 px-3 py-1 rounded-full text-xs font-mono font-bold">
            🎯 BASE CASE HIT! Unwinding will begin.
          </span>
        )}
        {returnValue !== undefined && (
          <span className="bg-indigo-950 border border-indigo-400 text-indigo-200 px-3 py-1 rounded-full text-xs font-mono font-bold">
            ↩️ RETURN VALUE: {returnValue}
          </span>
        )}
      </div>

      {/* Vertical Call Stack Ladder */}
      <div className="w-full max-w-[360px] h-[220px] bg-[#101827]/80 rounded-2xl border border-[#24344A] p-4 flex flex-col-reverse justify-start overflow-y-auto shadow-2xl">
        <AnimatePresence>
          {frames.map((frame, idx) => {
            const isTop = idx === frames.length - 1;

            return (
              <motion.div
                key={`call-frame-${idx}-${frame}`}
                layout
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`w-full py-2.5 px-4 mb-2 rounded-xl flex items-center justify-between font-mono text-xs font-bold border ${
                  isTop
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                    : 'bg-[#151F2E] border-[#24344A] text-[#94A3B8]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#64748B]">#{idx + 1}</span>
                  <span className="text-sm font-semibold">{frame}</span>
                </div>
                <span className="text-[10px] text-cyan-400">
                  {isTop ? 'ACTIVE FRAME' : 'WAITING'}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Call Stack Details */}
      <div className="mt-3 flex items-center gap-6 text-xs font-mono text-[#94A3B8]">
        <div>Call Stack Depth: <strong className="text-cyan-400">{depth}</strong></div>
        <div>Direction: <strong className="text-indigo-400">{returnValue ? 'Unwinding ↑' : 'Drilling Down ↓'}</strong></div>
      </div>
    </div>
  );
};

export default RecursionVisualizer;
