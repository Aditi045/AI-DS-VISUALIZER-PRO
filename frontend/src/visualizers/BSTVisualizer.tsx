import React from 'react';
import { motion } from 'framer-motion';

interface BSTNode {
  value: number;
  left?: BSTNode;
  right?: BSTNode;
}

interface BSTVisualizerProps {
  state: any;
  highlight?: {
    nodes?: (number | string)[];
    decisionPath?: string;
  };
  variables?: Record<string, any>;
}

export const BSTVisualizer: React.FC<BSTVisualizerProps> = ({
  state,
  highlight,
  variables = {},
}) => {
  // Normalize tree
  const tree: BSTNode = state?.value !== undefined ? state : {
    value: 50,
    left: { value: 30, left: { value: 20 }, right: { value: 40 } },
    right: { value: 70, left: { value: 65 }, right: { value: 80 } },
  };

  const highlightedNodes = highlight?.nodes?.map(String) || [];
  const decisionPath = highlight?.decisionPath || variables.decision;

  // Flatten tree for clean SVG rendering
  type FlatNode = { val: number; x: number; y: number; px?: number; py?: number; isLeft?: boolean };
  const flatNodes: FlatNode[] = [];

  const layoutTree = (node?: BSTNode, depth = 0, x = 200, offset = 90, px?: number, py?: number, isLeft?: boolean) => {
    if (!node) return;
    const y = 40 + depth * 65;
    flatNodes.push({ val: node.value, x, y, px, py, isLeft });
    if (node.left) layoutTree(node.left, depth + 1, x - offset, offset * 0.55, x, y, true);
    if (node.right) layoutTree(node.right, depth + 1, x + offset, offset * 0.55, x, y, false);
  };

  layoutTree(tree);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-4 select-none">
      {/* Decision Path HUD Banner */}
      {decisionPath && (
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-indigo-950/90 border border-indigo-400 text-indigo-100 px-4 py-1.5 rounded-xl text-xs font-mono font-bold shadow-xl flex items-center gap-2 mb-2"
        >
          <span className="text-cyan-400">⚖️ BST DECISION:</span>
          <span>{decisionPath}</span>
        </motion.div>
      )}

      {/* SVG Tree View */}
      <div className="relative w-full max-w-[420px] h-[240px] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 240">
          {/* Edges */}
          {flatNodes.map((n, i) => {
            if (n.px === undefined || n.py === undefined) return null;
            return (
              <g key={`edge-${i}`}>
                <line
                  x1={n.px}
                  y1={n.py}
                  x2={n.x}
                  y2={n.y}
                  stroke="#24344A"
                  strokeWidth="2.5"
                />
                {/* L / R Branch labels */}
                <text
                  x={(n.px + n.x) / 2 + (n.isLeft ? -10 : 10)}
                  y={(n.py + n.y) / 2 - 2}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {n.isLeft ? 'L' : 'R'}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {flatNodes.map((n, i) => {
            const isHighlighted = highlightedNodes.includes(String(n.val));
            return (
              <g key={`node-${i}`}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="18"
                  className={
                    isHighlighted
                      ? 'fill-cyan-950 stroke-cyan-400 stroke-2 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]'
                      : 'fill-[#151F2E] stroke-[#24344A] stroke-2'
                  }
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  fill={isHighlighted ? '#22D3EE' : '#F8FAFC'}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {n.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Educational Decision Flow Diagram */}
      <div className="flex items-center gap-4 bg-[#101827]/80 border border-[#24344A] rounded-xl px-5 py-2.5 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="text-cyan-400">target &lt; node</span>
          <span className="text-cyan-300 font-bold">➔ Go LEFT</span>
        </div>
        <div className="w-px h-4 bg-[#24344A]" />
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400">target == node</span>
          <span className="text-emerald-300 font-bold">➔ MATCH</span>
        </div>
        <div className="w-px h-4 bg-[#24344A]" />
        <div className="flex items-center gap-1.5">
          <span className="text-indigo-400">target &gt; node</span>
          <span className="text-indigo-300 font-bold">➔ Go RIGHT</span>
        </div>
      </div>
    </div>
  );
};

export default BSTVisualizer;
