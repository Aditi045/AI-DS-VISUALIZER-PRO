import React, { useState } from 'react';
import type { ComplexityInfo, ExecutionEvent } from '../types/dsa';

interface BottomDockProps {
  logs: Array<{ type: 'INFO' | 'STEP' | 'SUCCESS' | 'WARN' | 'ERROR'; message: string; timestamp?: string }>;
  rawOutput?: string;
  error?: { type: string; message: string; line?: number | null; tool_output?: string } | null;
  variables?: Record<string, any>;
  callStack?: string[];
  complexity?: ComplexityInfo;
  history?: ExecutionEvent[];
  currentStepIndex: number;
  onSelectStep?: (index: number) => void;
  onClearConsole?: () => void;
  language?: string;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  logs = [],
  rawOutput = '',
  error = null,
  variables = {},
  callStack = [],
  complexity,
  history = [],
  currentStepIndex,
  onSelectStep,
  onClearConsole,
  language = 'python',
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'variables' | 'stack' | 'complexity' | 'history'>('console');
  const [consoleView, setConsoleView] = useState<'structured' | 'raw'>('structured');

  const variableEntries = Object.entries(variables || {}).filter(
    ([k]) => !['queue', 'callStack', 'visited', 'visitedSoFar', 'result'].includes(k)
  );

  return (
    <div className="flex flex-col w-full bg-[#101827] border border-[#24344A] rounded-2xl overflow-hidden shadow-2xl mt-4">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#24344A] bg-[#0d1420]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <span>CONSOLE</span>
            {error && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          </button>

          <button
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'variables'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <span>VARIABLES</span>
            <span className="text-[10px] bg-[#151F2E] px-1.5 py-0.2 rounded text-[#64748B]">
              {variableEntries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'stack'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <span>CALL STACK</span>
            <span className="text-[10px] bg-[#151F2E] px-1.5 py-0.2 rounded text-[#64748B]">
              {callStack.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('complexity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'complexity'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <span>COMPLEXITY</span>
            <span className="text-[10px] text-cyan-400 font-bold">O(...)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <span>OPERATION HISTORY</span>
            <span className="text-[10px] bg-[#151F2E] px-1.5 py-0.2 rounded text-[#64748B]">
              {history.length}
            </span>
          </button>
        </div>

        {/* Console view toggle & clear */}
        {activeTab === 'console' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConsoleView(consoleView === 'structured' ? 'raw' : 'structured')}
              className="text-[11px] font-mono text-[#94A3B8] hover:text-cyan-400 bg-[#151F2E] border border-[#24344A] px-2 py-0.5 rounded transition-colors"
            >
              View: {consoleView === 'structured' ? 'Logs' : 'Stdout'}
            </button>
            <button
              onClick={onClearConsole}
              className="text-[11px] font-mono text-[#64748B] hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Tab Panels Body */}
      <div className="p-4 min-h-[160px] max-h-[220px] overflow-y-auto font-mono text-xs">
        {/* 1. CONSOLE TAB */}
        {activeTab === 'console' && (
          <div className="flex flex-col gap-1.5">
            {error && (
              <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-red-200 mb-2">
                <div className="font-bold flex items-center gap-2">
                  <span>❌ {error.type}</span>
                  {error.line && <span className="text-xs bg-red-900 px-1.5 py-0.2 rounded">Line {error.line}</span>}
                </div>
                <div className="mt-1 text-xs">{error.message}</div>
                {error.tool_output && (
                  <pre className="mt-2 text-[11px] text-red-300 bg-black/40 p-2 rounded overflow-x-auto">
                    {error.tool_output}
                  </pre>
                )}
              </div>
            )}

            {consoleView === 'raw' ? (
              <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">
                {rawOutput ? rawOutput : '$ Program executed without standard stdout.'}
              </pre>
            ) : logs.length > 0 ? (
              logs.map((log, i) => {
                let badgeClass = 'text-cyan-400 bg-cyan-950/80 border-cyan-500/50';
                if (log.type === 'ERROR') badgeClass = 'text-red-400 bg-red-950/80 border-red-500/50';
                else if (log.type === 'WARN') badgeClass = 'text-amber-400 bg-amber-950/80 border-amber-500/50';
                else if (log.type === 'SUCCESS') badgeClass = 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50';

                return (
                  <div key={`log-${i}`} className="flex items-start gap-2.5 leading-relaxed">
                    <span className={`px-1.5 py-0.2 rounded border text-[10px] font-bold tracking-tight ${badgeClass}`}>
                      [{log.type}]
                    </span>
                    <span className="text-[#CBD5E1]">{log.message}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-[#64748B] italic">
                $ Ready. Click '▶ Run Program' or '⏭ Step' to execute and inspect real events.
              </div>
            )}
          </div>
        )}

        {/* 2. VARIABLES TAB */}
        {activeTab === 'variables' && (
          <div className="w-full">
            {variableEntries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {variableEntries.map(([key, val]) => (
                  <div
                    key={`var-${key}`}
                    className="p-2.5 bg-[#151F2E] border border-[#24344A] rounded-xl flex flex-col"
                  >
                    <span className="text-[10px] text-[#64748B] font-bold uppercase">{key}</span>
                    <strong className="text-sm text-cyan-300 font-bold mt-0.5 truncate">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#64748B] italic">
                No active runtime variables for this step.
              </div>
            )}
          </div>
        )}

        {/* 3. CALL STACK TAB */}
        {activeTab === 'stack' && (
          <div className="flex flex-col gap-2">
            {callStack.length > 0 ? (
              callStack.map((frame, i) => (
                <div
                  key={`frame-${i}`}
                  className="flex items-center justify-between p-2.5 bg-[#151F2E] border border-[#24344A] rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">#{callStack.length - i}</span>
                    <strong className="text-[#F8FAFC]">{frame}</strong>
                  </div>
                  <span className="text-[10px] text-[#64748B]">
                    {i === callStack.length - 1 ? 'TOP FRAME' : 'CALLER'}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-[#151F2E] border border-[#24344A] rounded-xl text-xs text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">#1</span>
                  <span>main() [global frame]</span>
                </div>
                <span className="text-[10px] text-[#64748B]">ENTRY</span>
              </div>
            )}
          </div>
        )}

        {/* 4. COMPLEXITY TAB */}
        {activeTab === 'complexity' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#151F2E] border border-[#24344A] rounded-xl flex flex-col">
                <span className="text-[10px] text-[#64748B] font-bold uppercase">TIME (BEST)</span>
                <strong className="text-base text-emerald-400 font-bold mt-1">
                  {complexity?.timeBest || 'O(1)'}
                </strong>
              </div>
              <div className="p-3 bg-[#151F2E] border border-[#24344A] rounded-xl flex flex-col">
                <span className="text-[10px] text-[#64748B] font-bold uppercase">TIME (AVERAGE)</span>
                <strong className="text-base text-cyan-400 font-bold mt-1">
                  {complexity?.timeAverage || 'O(n)'}
                </strong>
              </div>
              <div className="p-3 bg-[#151F2E] border border-[#24344A] rounded-xl flex flex-col">
                <span className="text-[10px] text-[#64748B] font-bold uppercase">TIME (WORST)</span>
                <strong className="text-base text-amber-400 font-bold mt-1">
                  {complexity?.timeWorst || 'O(n)'}
                </strong>
              </div>
              <div className="p-3 bg-[#151F2E] border border-[#24344A] rounded-xl flex flex-col">
                <span className="text-[10px] text-[#64748B] font-bold uppercase">SPACE COMPLEXITY</span>
                <strong className="text-base text-indigo-400 font-bold mt-1">
                  {complexity?.space || 'O(1)'}
                </strong>
              </div>
            </div>
            {complexity?.notes && (
              <div className="p-3 bg-[#151F2E]/60 border border-[#24344A] rounded-xl text-xs text-[#CBD5E1]">
                💡 <span className="font-semibold text-cyan-300">Explanation:</span> {complexity.notes}
              </div>
            )}
          </div>
        )}

        {/* 5. OPERATION HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-2">
            {history.length > 0 ? (
              history.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <button
                    key={`hist-step-${idx}`}
                    onClick={() => onSelectStep?.(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-colors ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200'
                        : isPassed
                        ? 'border-[#24344A] bg-[#151F2E] text-[#94A3B8] hover:border-cyan-500/40'
                        : 'border-[#1b2636] bg-[#0c131e] text-[#64748B] hover:border-[#24344A]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? 'bg-cyan-400 text-black' : isPassed ? 'bg-emerald-600 text-white' : 'bg-[#24344A] text-[#94A3B8]'
                      }`}>
                        {isPassed ? '✓' : idx + 1}
                      </span>
                      <div>
                        <strong className="font-bold text-xs">{step.description}</strong>
                        <div className="text-[10px] text-[#64748B]">Operation: {step.operation} · Line {step.line}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold">
                      {isActive ? 'CURRENT' : 'JUMP ➔'}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="text-[#64748B] italic">
                Execution history will populate step-by-step as operations execute.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomDock;
