import React from 'react';
import { motion } from 'framer-motion';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

interface BinaryTreeVisualizerProps {
  state: any;
  highlight?: {
    nodes?: (number | string)[];
  };
  variables?: Record<string, any>;
}

export const BinaryTreeVisualizer: React.FC<BinaryTreeVisualizerProps> = ({
  state,
  highlight,
  variables = {},
}) => {
  const tree: TreeNode = state?.value !== undefined ? state : {
    value: 50,
    left: { value: 30, left: { value: 20 }, right: { value: 40 } },
    right: { value: 70, left: { value: 60 }, right: { value: 80 } },
  };

  const highlightedNodes = highlight?.nodes?.map(String) || [];
  const visitedSeq = variables.visitedSoFar || variables.result || [];

  type FlatNode = { val: number; x: number; y: number; px?: number; py?: number };
  const flatNodes: FlatNode[] = [];

  const layoutTree = (node?: TreeNode, depth = 0, x = 200, offset = 90, px?: number, py?: number) => {
    if (!node) return;
    const y = 35 + depth * 65;
    flatNodes.push({ val: node.value, x, y, px, py });
    if (node.left) layoutTree(node.left, depth + 1, x - offset, offset * 0.55, x, y);
    if (node.right) layoutTree(node.right, depth + 1, x + offset, offset * 0.55, x, y);
  };

  layoutTree(tree);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-4 select-none">
      {/* SVG Tree */}
      <div className="relative w-full max-w-[420px] h-[220px] flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 230">
          {/* Connecting Branches */}
          {flatNodes.map((n, i) => {
            if (n.px === undefined || n.py === undefined) return null;
            return (
              <line
                key={`tree-branch-${i}`}
                x1={n.px}
                y1={n.py}
                x2={n.x}
                y2={n.y}
                stroke="#24344A"
                strokeWidth="2.5"
              />
            );
          })}

          {/* Tree Nodes */}
          {flatNodes.map((n, i) => {
            const isHighlighted = highlightedNodes.includes(String(n.val));
            const isVisited = visitedSeq.includes(n.val);

            let fill = '#151F2E';
            let stroke = '#24344A';
            if (isHighlighted) {
              fill = '#164e63';
              stroke = '#22D3EE';
            } else if (isVisited) {
              fill = '#064e3b';
              stroke = '#10B981';
            }

            return (
              <g key={`tree-node-${i}`}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="18"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                  className={isHighlighted ? 'filter drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]' : ''}
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  fill="#F8FAFC"
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

      {/* Traversal sequence visited list */}
      <div className="w-full max-w-[420px] bg-[#101827]/80 border border-[#24344A] rounded-xl p-3 flex items-center gap-3">
        <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase whitespace-nowrap">
          VISITED SEQUENCE:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
          {visitedSeq.length > 0 ? (
            visitedSeq.map((val: number, idx: number) => (
              <span
                key={`visited-${idx}`}
                className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/50 rounded text-emerald-300 font-mono text-xs font-bold"
              >
                {val}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#64748B] font-mono">(Ready to traverse)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;
