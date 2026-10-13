import React from 'react';
import { motion } from 'framer-motion';

interface HeapVisualizerProps {
  state: any;
  highlight?: {
    indices?: number[];
    swapping?: [number, number];
    pointers?: Record<string, number | string>;
  };
  isMaxHeap?: boolean;
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({
  state,
  highlight,
  isMaxHeap = false,
}) => {
  const heap: number[] = Array.isArray(state) ? state : [10, 20, 30, 40, 50];
  const highlightedIndices = highlight?.indices || [];
  const swappingIndices: number[] = highlight?.swapping || [];

  // Compute tree coordinates for up to 7 nodes
  const nodePositions = [
    { x: 190, y: 35 },  // index 0: root
    { x: 110, y: 95 },  // index 1: left
    { x: 270, y: 95 },  // index 2: right
    { x: 70, y: 155 },  // index 3: left-left
    { x: 145, y: 155 }, // index 4: left-right
    { x: 235, y: 155 }, // index 5: right-left
    { x: 310, y: 155 }, // index 6: right-right
  ];

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-4 select-none">
      {/* Heap Tree SVG */}
      <div className="relative w-full max-w-[380px] h-[190px] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 380 190">
          {/* Edges from child to parent */}
          {heap.slice(0, 7).map((_, i) => {
            if (i === 0) return null;
            const parent = Math.floor((i - 1) / 2);
            const pCoord = nodePositions[parent];
            const cCoord = nodePositions[i];
            if (!pCoord || !cCoord) return null;
            return (
              <line
                key={`hedge-${parent}-${i}`}
                x1={pCoord.x}
                y1={pCoord.y}
                x2={cCoord.x}
                y2={cCoord.y}
                stroke="#24344A"
                strokeWidth="2.5"
              />
            );
          })}

          {/* Tree Nodes */}
          {heap.slice(0, 7).map((val, i) => {
            const coord = nodePositions[i];
            if (!coord) return null;
            const isSwapping = swappingIndices.includes(i);
            const isHighlighted = highlightedIndices.includes(i);

            let fill = '#151F2E';
            let stroke = '#24344A';
            if (isSwapping) {
              fill = '#581c87';
              stroke = '#c084fc';
            } else if (isHighlighted) {
              fill = '#164e63';
              stroke = '#22d3ee';
            }

            return (
              <g key={`hnode-${i}`}>
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="17"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                />
                <text
                  x={coord.x}
                  y={coord.y + 4}
                  fill="#F8FAFC"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {val}
                </text>
                {/* Index label next to node */}
                <text
                  x={coord.x + 22}
                  y={coord.y + 3}
                  fill="#64748B"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  [{i}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Array Representation of Heap (Section 13 requirement) */}
      <div className="w-full max-w-[380px] bg-[#101827]/80 border border-[#24344A] rounded-xl p-3 flex flex-col items-center">
        <span className="text-[10px] text-[#64748B] font-mono mb-2 uppercase">
          UNDERLYING ARRAY REPRESENTATION
        </span>
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          {heap.map((val, idx) => {
            const isSwapping = swappingIndices.includes(idx);
            const isHighlighted = highlightedIndices.includes(idx);
            return (
              <div key={`harr-${idx}`} className="flex flex-col items-center">
                <motion.div
                  layout
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm ${
                    isSwapping
                      ? 'border-purple-400 bg-purple-950/80 text-purple-200'
                      : isHighlighted
                      ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200'
                      : 'border-[#24344A] bg-[#151F2E] text-[#F8FAFC]'
                  }`}
                >
                  {val}
                </motion.div>
                <span className="text-[9px] text-[#64748B] font-mono mt-0.5">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heap index formula footer */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] font-mono text-[#94A3B8]">
        <div>Parent(i): <strong className="text-cyan-400">⌊(i-1)/2⌋</strong></div>
        <div>Left(i): <strong className="text-indigo-400">2i + 1</strong></div>
        <div>Right(i): <strong className="text-indigo-400">2i + 2</strong></div>
      </div>
    </div>
  );
};

export default HeapVisualizer;
