import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoublyLinkedListVisualizerProps {
  items: any[];
  highlight?: {
    pointers?: Record<string, number | string>;
    indices?: number[];
  };
}

export const DoublyLinkedListVisualizer: React.FC<DoublyLinkedListVisualizerProps> = ({
  items = [],
  highlight,
}) => {
  const nodes = Array.isArray(items) ? items : [10, 20, 30];
  const pointers = highlight?.pointers || {};
  const highlightedIndices = highlight?.indices || [];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-3 sm:p-6 select-none overflow-x-auto touch-pan-x">
      <div className="flex items-center min-w-max bg-[#101827]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#24344A] shadow-2xl">
        {/* Left Terminal NULL */}
        <div className="flex items-center gap-2 mr-3">
          <span className="px-3 py-2 bg-[#151F2E] border border-[#24344A] rounded-lg text-xs font-mono font-bold text-[#64748B]">
            NULL
          </span>
          <span className="text-[#64748B] font-mono text-sm">◀</span>
        </div>

        {/* Nodes and Bidirectional Links */}
        <AnimatePresence>
          {nodes.map((item, idx) => {
            const isHighlighted = highlightedIndices.includes(idx);
            const activePtr = Object.entries(pointers).find(([_, p]) => p === idx)?.[0];

            return (
              <React.Fragment key={`dll-node-${idx}-${item}`}>
                {/* [ PREV | DATA | NEXT ] compartments */}
                <motion.div
                  layout
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="flex flex-col items-center relative"
                >
                  {/* Floating pointer tag */}
                  {activePtr && (
                    <motion.span
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute -top-7 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/60 px-1.5 py-0.2 rounded"
                    >
                      {activePtr.toUpperCase()} ↓
                    </motion.span>
                  )}

                  <div
                    className={`flex items-stretch rounded-xl border-2 overflow-hidden shadow-lg transition-colors ${
                      isHighlighted
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                        : 'border-[#24344A] bg-[#151F2E]'
                    }`}
                  >
                    {/* PREV compartment */}
                    <div className="px-2.5 py-3 flex flex-col items-center justify-center border-r border-[#24344A] bg-[#151F2E]">
                      <span className="text-[9px] text-indigo-400 font-mono font-bold">PREV</span>
                      <span className="text-xs text-[#64748B] font-mono">◀</span>
                    </div>

                    {/* DATA compartment */}
                    <div className="px-4 py-3 flex flex-col items-center justify-center border-r border-[#24344A] bg-[#101827]">
                      <span className="text-xs text-[#64748B] font-mono">DATA</span>
                      <strong className="text-lg font-mono text-[#F8FAFC]">{item}</strong>
                    </div>

                    {/* NEXT compartment */}
                    <div className="px-2.5 py-3 flex flex-col items-center justify-center bg-[#151F2E]">
                      <span className="text-[9px] text-cyan-400 font-mono font-bold">NEXT</span>
                      <span className="text-xs text-[#64748B] font-mono">▶</span>
                    </div>
                  </div>
                </motion.div>

                {/* Bidirectional Arrow ⇄ */}
                {idx < nodes.length - 1 && (
                  <motion.div
                    layout
                    className="flex flex-col items-center text-cyan-400 font-mono mx-3 text-base leading-none"
                  >
                    <span className="text-cyan-400">➔</span>
                    <span className="text-indigo-400">◀</span>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </AnimatePresence>

        {/* Right Terminal NULL */}
        <div className="flex items-center gap-2 ml-3">
          <span className="text-[#64748B] font-mono text-sm">▶</span>
          <span className="px-3 py-2 bg-[#151F2E] border border-[#24344A] rounded-lg text-xs font-mono font-bold text-[#64748B]">
            NULL
          </span>
        </div>
      </div>

      {/* Metrics footer */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-[#94A3B8]">
        <div>Nodes: <strong className="text-cyan-400">{nodes.length}</strong></div>
        <div>Type: <strong className="text-indigo-400">Doubly Linked List</strong></div>
        <div>Pointers: <strong className="text-cyan-400">PREV (←) & NEXT (→)</strong></div>
      </div>
    </div>
  );
};

export default DoublyLinkedListVisualizer;
