import React from 'react';
import { motion } from 'framer-motion';

interface HashTableVisualizerProps {
  state: any;
  highlight?: {
    indices?: number[];
  };
  variables?: Record<string, any>;
}

export const HashTableVisualizer: React.FC<HashTableVisualizerProps> = ({
  state,
  highlight,
  variables = {},
}) => {
  const buckets: Array<Array<[string, any]>> = Array.isArray(state)
    ? state
    : [[], [], [['apple', 100], ['apricot', 300]], [], [['banana', 200]]];

  const highlightedIndices = highlight?.indices || [];
  const currentKey = variables.key;
  const currentBucket = variables.bucket;
  const isCollision = variables.collision;

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-4 select-none">
      {/* Hash calculation HUD */}
      {currentKey && currentBucket !== undefined && (
        <motion.div
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-indigo-950/80 border border-indigo-400 text-indigo-100 px-4 py-1.5 rounded-xl font-mono text-xs flex items-center gap-3 mb-2 shadow-lg"
        >
          <span>hash("{currentKey}") % {buckets.length} =</span>
          <strong className="text-cyan-400 text-sm font-bold">Bucket [{currentBucket}]</strong>
          {isCollision && (
            <span className="bg-amber-950 text-amber-300 border border-amber-500/60 px-2 py-0.5 rounded text-[10px] font-bold">
              COLLISION RESOLVED (Chaining)
            </span>
          )}
        </motion.div>
      )}

      {/* Bucket Slots Table */}
      <div className="w-full max-w-[460px] bg-[#101827]/80 rounded-2xl border border-[#24344A] p-4 shadow-2xl flex flex-col gap-2.5 overflow-y-auto max-h-[240px]">
        {buckets.map((chain, bucketIdx) => {
          const isHighlighted = highlightedIndices.includes(bucketIdx) || currentBucket === bucketIdx;

          return (
            <div key={`bucket-${bucketIdx}`} className="flex items-center gap-2">
              {/* Bucket Index Cell */}
              <div
                className={`w-14 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-xs ${
                  isHighlighted
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                    : 'border-[#24344A] bg-[#151F2E] text-[#94A3B8]'
                }`}
              >
                [{bucketIdx}]
              </div>

              <span className="text-[#64748B] font-mono text-sm">➔</span>

              {/* Chained Linked Nodes */}
              <div className="flex items-center gap-2 overflow-x-auto flex-1">
                {chain.length > 0 ? (
                  chain.map(([k, v], nodeIdx) => (
                    <React.Fragment key={`node-${bucketIdx}-${nodeIdx}`}>
                      <motion.div
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1.5 bg-[#151F2E] border border-cyan-500/40 rounded-lg flex items-center gap-2 font-mono text-xs text-[#F8FAFC] shadow-sm"
                      >
                        <span className="text-cyan-400 font-bold">{k}:</span>
                        <span>{v}</span>
                      </motion.div>
                      {nodeIdx < chain.length - 1 && (
                        <span className="text-cyan-400 font-mono text-xs">➔</span>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-xs font-mono text-[#64748B] italic">null (empty)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="text-xs font-mono text-[#94A3B8] mt-2">
        Hash table maps keys to bucket indices in O(1) average time via hash function.
      </div>
    </div>
  );
};

export default HashTableVisualizer;
