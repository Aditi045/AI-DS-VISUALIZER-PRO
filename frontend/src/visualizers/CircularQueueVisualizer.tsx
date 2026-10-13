import React from 'react';
import { motion } from 'framer-motion';

interface CircularQueueVisualizerProps {
  items: any[];
  variables?: Record<string, any>;
  highlight?: {
    pointers?: Record<string, number | string>;
    indices?: number[];
  };
}

export const CircularQueueVisualizer: React.FC<CircularQueueVisualizerProps> = ({
  items = [],
  variables = {},
  highlight,
}) => {
  const capacity = variables.capacity || variables.MAX || variables.MAX_SIZE || 5;
  const rawSlots = Array.isArray(items) ? items : [10, 20, 30, null, null];
  const slots = rawSlots.length < capacity 
    ? [...rawSlots, ...Array(capacity - rawSlots.length).fill(null)]
    : rawSlots.slice(0, capacity);

  const front = variables.front ?? 0;
  const rear = variables.rear ?? (items.filter(x => x !== null).length - 1);
  const count = variables.count ?? items.filter(x => x !== null).length;
  const isWrap = rear < front && count > 0;

  // Render slots radially in a circle
  const radius = 110;
  const centerX = 160;
  const centerY = 160;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 select-none">
      {/* Wrap banner */}
      {isWrap && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-indigo-950/80 border border-indigo-400 text-indigo-200 px-4 py-1 rounded-full text-xs font-mono font-bold mb-2 shadow-lg"
        >
          🔄 CIRCULAR WRAP-AROUND ACTIVE (REAR has looped to index 0)
        </motion.div>
      )}

      {/* Radial SVG Track Container with touch pan support */}
      <div className="w-full flex justify-center overflow-x-auto touch-pan-x py-2">
        <div className="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] shrink-0 flex items-center justify-center">
          {/* Background circular guide ring */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#24344A"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
          </svg>

          {/* Center HUD info */}
          <div className="absolute flex flex-col items-center justify-center text-center font-mono pointer-events-none">
            <span className="text-[10px] text-[#64748B] tracking-wider uppercase">CIRCULAR QUEUE</span>
            <span className="text-xl font-bold text-cyan-400">{count} / {capacity}</span>
            <span className="text-[11px] text-[#94A3B8]">
              rear = (rear + 1) % {capacity}
            </span>
          </div>

          {/* Circular Slots */}
          {slots.map((val, idx) => {
            const angle = (idx / capacity) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            const isFront = idx === front && count > 0;
            const isRear = idx === rear && count > 0;
            const isEmpty = val === null || val === undefined;

            let slotClass = 'bg-[#151F2E] border-[#24344A] text-[#F8FAFC]';
            if (isFront && isRear) {
              slotClass = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.4)]';
            } else if (isFront) {
              slotClass = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
            } else if (isRear) {
              slotClass = 'bg-indigo-950/80 border-indigo-400 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.4)]';
            }

            return (
              <motion.div
                key={`cslot-${idx}`}
                layout
                style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
                className={`absolute w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center font-mono font-bold transition-colors ${slotClass}`}
              >
                <span className="text-sm">{isEmpty ? '—' : val}</span>
                <span className="text-[9px] text-[#64748B]">[{idx}]</span>

                {/* Tag labels */}
                {isFront && (
                  <span className="absolute -top-3.5 bg-emerald-950 border border-emerald-500/60 px-1 py-0.2 rounded text-[8px] text-emerald-300">
                    FRONT
                  </span>
                )}
                {isRear && (
                  <span className="absolute -bottom-3.5 bg-indigo-950 border border-indigo-500/60 px-1 py-0.2 rounded text-[8px] text-indigo-300">
                    REAR
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Metrics footer */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-[#94A3B8]">
        <div>Front Index: <strong className="text-emerald-400">{front}</strong></div>
        <div>Rear Index: <strong className="text-indigo-400">{rear}</strong></div>
        <div>Capacity: <strong className="text-cyan-400">{capacity}</strong></div>
        <div>Used: <strong className="text-cyan-400">{count}</strong></div>
      </div>
    </div>
  );
};

export default CircularQueueVisualizer;
