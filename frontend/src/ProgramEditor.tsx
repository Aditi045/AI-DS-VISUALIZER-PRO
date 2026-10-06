import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { chapterById, type ChapterId } from './programCatalog';
import { getProgram } from './data/allPrograms';
import type { Language, Speed, ExecutionEvent } from './types/dsa';
import { BottomDock } from './components/BottomDock';

// Visualizer imports
import ArrayVisualizer from './visualizers/ArrayVisualizer';
import StackVisualizer from './visualizers/StackVisualizer';
import QueueVisualizer from './visualizers/QueueVisualizer';
import { CircularQueueVisualizer } from './visualizers/CircularQueueVisualizer';
import LinkedListVisualizer from './visualizers/LinkedListVisualizer';
import { DoublyLinkedListVisualizer } from './visualizers/DoublyLinkedListVisualizer';
import { BinaryTreeVisualizer } from './visualizers/BinaryTreeVisualizer';
import { BSTVisualizer } from './visualizers/BSTVisualizer';
import { HeapVisualizer } from './visualizers/HeapVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';
import { SearchingVisualizer } from './visualizers/SearchingVisualizer';
import SortingVisualizer from './visualizers/SortingVisualizer';
import { HashTableVisualizer } from './visualizers/HashTableVisualizer';
import { RecursionVisualizer } from './visualizers/RecursionVisualizer';

type Props = {
  api: string;
  chapter?: ChapterId;
  selectedProgram?: string;
  onProgramChange?: (program: string) => void;
};

const speedMap: Record<Speed, number> = {
  'very-slow': 2000,
  slow: 1200,
  normal: 700,
  fast: 350,
  'very-fast': 125,
};

export default function ProgramEditor({ api, chapter = 'array', selectedProgram = 'create', onProgramChange }: Props) {
  const [language, setLanguage] = useState<Language>('python');
  const [speed, setSpeed] = useState<Speed>('normal');
  const [code, setCode] = useState<string>('');
  const [programInput, setProgramInput] = useState('');
  const [status, setStatus] = useState('Ready to run your program.');
  const [rawOutput, setRawOutput] = useState('');
  const [error, setError] = useState<{ type: string; message: string; line?: number | null; tool_output?: string } | null>(null);
  const [steps, setSteps] = useState<ExecutionEvent[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [useMonaco, setUseMonaco] = useState(true);

  const controllerRef = useRef<AbortController | null>(null);

  const activeChapter = chapterById(chapter);
  const activeCatalogProgram = activeChapter.programs.find((item) => item.id === selectedProgram) ?? activeChapter.programs[0];

  // Retrieve full program item details from catalog
  const fullProgramItem = useMemo(() => {
    return getProgram(chapter, selectedProgram) || getProgram(chapter, activeCatalogProgram.id);
  }, [chapter, selectedProgram, activeCatalogProgram.id]);

  // Pseudocode lines for current algorithm
  const pseudocodeLines = useMemo(() => {
    if (chapter === 'array') {
      return [
        '1. Initialize contiguous array memory buffer',
        '2. Read size N and elements',
        '3. Traverse index i from 0 to N-1',
        '4. Access arr[i] and perform target operation',
        '5. Complete traversal and return success',
      ];
    } else if (chapter === 'stack') {
      return [
        '1. Check top index against capacity boundary',
        '2. Push: Increment top pointer and store value',
        '3. Pop: Read top value and decrement pointer',
        '4. Return active top element',
      ];
    } else if (chapter === 'queue') {
      return [
        '1. Enqueue: Insert at rear index, increment rear',
        '2. Dequeue: Read front value, increment front',
        '3. Display active queue elements from front to rear',
      ];
    } else if (chapter === 'sorting') {
      return [
        '1. Loop i from 0 to N-1',
        '2. Loop j from 0 to N-i-2',
        '3. Compare arr[j] and arr[j+1]',
        '4. If arr[j] > arr[j+1], swap elements',
        '5. Mark sorted boundary',
      ];
    } else if (chapter === 'searching') {
      return [
        '1. Set low = 0, high = N-1',
        '2. Calculate mid = (low + high) / 2',
        '3. Compare arr[mid] with target value',
        '4. If equal, return mid index',
        '5. Else adjust search range low or high',
      ];
    }
    return [
      `1. Initialize ${chapter.toUpperCase()} structure`,
      '2. Perform target algorithmic step',
      '3. Update pointers and node links',
      '4. Return resulting state',
    ];
  }, [chapter]);

  // Sync initial code & input when chapter/program changes
  useEffect(() => {
    if (fullProgramItem && fullProgramItem.code[language]) {
      setCode(fullProgramItem.code[language]);
    } else {
      setCode(`# Example code for ${activeCatalogProgram.name}\nprint("Executing ${activeCatalogProgram.name}")`);
    }

    if (fullProgramItem?.defaultInput) {
      setProgramInput(fullProgramItem.defaultInput);
    } else {
      setProgramInput('');
    }

    setRawOutput('');
    setError(null);
    setErrorLine(null);
    setSteps([]);
    setCurrentStepIndex(-1);
    setPlaying(false);
    setStatus('Ready to run your program.');
  }, [chapter, selectedProgram, language, fullProgramItem, activeCatalogProgram.name]);

  // Speed timer loop for execution playback
  useEffect(() => {
    if (!playing || !steps.length) return;

    const timer = window.setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex >= steps.length - 1) {
          setPlaying(false);
          setStatus('Execution completed.');
          return prevIndex;
        }

        const nextIndex = prevIndex + 1;
        const currentLine = steps[nextIndex]?.line;

        if (currentLine && breakpoints.includes(currentLine)) {
          setPlaying(false);
          setStatus(`Breakpoint hit at line ${currentLine}.`);
        }

        return nextIndex;
      });
    }, speedMap[speed]);

    return () => window.clearInterval(timer);
  }, [playing, steps, speed, breakpoints]);

  const activeStep = steps[Math.max(currentStepIndex, 0)];

  // Actions
  const runProgram = async () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    setPlaying(false);
    setRawOutput('');
    setError(null);
    setErrorLine(null);
    setSteps([]);
    setCurrentStepIndex(-1);

    if (!code.trim()) {
      setError({ type: 'VALIDATION_ERROR', message: 'Program code cannot be empty.' });
      return;
    }

    setStatus('Generating execution trace...');

    // First try internal client-side trace generator from dataset for instant, high-fidelity visual events
    if (fullProgramItem?.generateTrace) {
      try {
        const traceEvents = fullProgramItem.generateTrace();
        setSteps(traceEvents);
        setCurrentStepIndex(0);
        setPlaying(true);
        setStatus('Completed — visualization steps active.');
        setRawOutput(`[INFO] Program started\n[SUCCESS] ${traceEvents.length} execution steps generated.`);
        return;
      } catch (err) {
        console.warn('Trace generation failed, falling back to execution endpoint', err);
      }
    }

    // Fallback to backend API run endpoint
    try {
      const result = await axios.post(
        `${api}/api/program/run`,
        { language, code, input_data: programInput },
        { signal: controllerRef.current.signal }
      );

      if (!result.data.success) {
        setStatus(result.data.status ?? 'Execution failed');
        setError(result.data.error);
        setErrorLine(result.data.error?.line ?? null);
        return;
      }

      setStatus(result.data.visualization_supported ? 'Completed — visualization steps ready.' : 'Completed — output ready.');
      setRawOutput(result.data.output || '(Program produced no output.)');

      if (result.data.steps && result.data.steps.length > 0) {
        setSteps(result.data.steps);
        setCurrentStepIndex(0);
        setPlaying(true);
      }
    } catch (requestError) {
      if (axios.isCancel(requestError)) {
        setStatus('Execution stopped');
        return;
      }
      setStatus('Local trace mode active');
      // Construct fallback step if backend endpoint unavailable
      const fallbackEvent: ExecutionEvent = {
        step: 1,
        type: `${chapter.toUpperCase()}_ACCESS`,
        operation: 'EXECUTE',
        data_structure: chapter,
        line: 1,
        description: `Running ${activeCatalogProgram.name}`,
        state: [10, 20, 30, 40, 50],
        variables: { status: 'OK' },
        log: { type: 'INFO', message: 'Executed local demonstration step.' },
      };
      setSteps([fallbackEvent]);
      setCurrentStepIndex(0);
    }
  };

  const stepOnce = () => {
    setPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, Math.max(steps.length - 1, 0)));
  };

  const pauseExecution = () => {
    setPlaying(false);
    setStatus('Paused');
  };

  const stopExecution = () => {
    controllerRef.current?.abort();
    setPlaying(false);
    setStatus('Stopped');
  };

  const resetExecution = () => {
    controllerRef.current?.abort();
    setPlaying(false);
    setRawOutput('');
    setError(null);
    setErrorLine(null);
    setSteps([]);
    setCurrentStepIndex(-1);
    setStatus('Ready to run your program.');
  };

  const copyCodeToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setStatus('Code copied to clipboard.');
  };

  const formatCode = () => {
    const formatted = code
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
    setCode(formatted);
    setStatus('Code formatted.');
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        void runProgram();
      } else if (e.key === 'F10') {
        e.preventDefault();
        stepOnce();
      } else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetExecution();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Render correct visualizer component for current chapter
  const renderVisualizer = () => {
    const stateVal = activeStep?.state;
    const highlightVal = activeStep?.highlight as any;
    const varsVal = activeStep?.variables;

    switch (chapter) {
      case 'array':
        return <ArrayVisualizer state={stateVal} highlight={highlightVal} />;
      case 'stack':
        return <StackVisualizer items={Array.isArray(stateVal) ? stateVal : [10, 20, 30]} />;
      case 'queue':
        return <QueueVisualizer items={Array.isArray(stateVal) ? stateVal : [10, 20, 30]} />;
      case 'circular_queue':
        return <CircularQueueVisualizer items={Array.isArray(stateVal) ? stateVal : [10, 20, 30]} variables={varsVal} highlight={highlightVal} />;
      case 'linked_list':
        return <LinkedListVisualizer items={Array.isArray(stateVal) ? stateVal : [10, 20, 30]} />;
      case 'doubly_linked_list':
        return <DoublyLinkedListVisualizer items={Array.isArray(stateVal) ? stateVal : [10, 20, 30]} highlight={highlightVal} />;
      case 'binary_tree':
        return <BinaryTreeVisualizer state={stateVal} highlight={highlightVal} variables={varsVal} />;
      case 'bst':
        return <BSTVisualizer state={stateVal} highlight={highlightVal} variables={varsVal} />;
      case 'heap':
        return <HeapVisualizer state={stateVal} highlight={highlightVal} isMaxHeap={selectedProgram === 'max'} />;
      case 'graph':
        return <GraphVisualizer state={stateVal || { vertices: ['A', 'B', 'C', 'D'], edges: [['A', 'B'], ['B', 'C']] }} />;
      case 'searching':
        return <SearchingVisualizer state={stateVal} highlight={highlightVal} variables={varsVal} />;
      case 'sorting':
        return <SortingVisualizer state={stateVal} highlight={highlightVal} variables={varsVal} />;
      case 'hash_table':
        return <HashTableVisualizer state={stateVal} highlight={highlightVal} variables={varsVal} />;
      case 'recursion':
        return <RecursionVisualizer state={stateVal} callStack={activeStep?.call_stack} variables={varsVal} />;
      default:
        return <ArrayVisualizer state={stateVal} highlight={highlightVal} />;
    }
  };

  const lines = code.split('\n');
  const currentLineNumber = activeStep?.line;

  const logsList = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => s.log)
    .map((s) => ({
      type: s.log!.type,
      message: s.log!.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }));

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 bg-[#050914] min-h-screen text-[#F8FAFC]">
      {/* BREADCRUMB & PROGRAM HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A1120] border border-[#24344A] rounded-2xl p-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#CBD5E1]">
            <span>PLAYGROUND</span>
            <span>/</span>
            <span className="text-[#22D3EE] font-bold uppercase">{activeChapter.label}</span>
            <span>/</span>
            <span className="text-white font-bold">{activeCatalogProgram.name}</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#F8FAFC] mt-1 flex items-center gap-2">
            <span>{activeChapter.icon}</span>
            <span>{activeCatalogProgram.name}</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">{activeCatalogProgram.description}</p>
        </div>

        {/* Runtime Status Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131D2D] border border-[#24344A] text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${playing ? 'bg-[#22C55E] animate-pulse' : steps.length ? 'bg-[#22D3EE]' : 'bg-[#64748B]'}`} />
            <span className="font-mono font-bold text-[#CBD5E1] uppercase">
              {playing ? 'RUNNING' : steps.length ? 'COMPLETE' : 'READY'}
            </span>
          </div>
        </div>
      </div>

      {/* TOOLBAR CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0A1120] border border-[#24344A] rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-[#131D2D] border border-[#24344A] rounded-lg py-1.5 px-3 text-xs text-[#F8FAFC] font-bold focus:outline-none focus:border-[#22D3EE]"
            >
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          {/* Program Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => onProgramChange?.(e.target.value)}
              className="bg-[#131D2D] border border-[#24344A] rounded-lg py-1.5 px-3 text-xs text-[#F8FAFC] font-bold focus:outline-none focus:border-[#22D3EE]"
            >
              {activeChapter.programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Execution Speed Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Speed</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value as Speed)}
              className="bg-[#131D2D] border border-[#24344A] rounded-lg py-1.5 px-3 text-xs text-[#F8FAFC] font-bold focus:outline-none focus:border-[#22D3EE]"
            >
              <option value="very-slow">0.5x (Very Slow)</option>
              <option value="slow">1x (Slow)</option>
              <option value="normal">2x (Normal)</option>
              <option value="fast">4x (Fast)</option>
              <option value="very-fast">8x (Very Fast)</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => void runProgram()}
            className="px-4 py-2 bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-1.5"
          >
            <span>▶</span>
            <span>RUN</span>
          </button>

          <button
            onClick={stepOnce}
            disabled={!steps.length}
            className="px-3 py-2 bg-[#131D2D] hover:bg-[#24344A] disabled:opacity-40 border border-[#24344A] text-xs font-bold text-[#CBD5E1] rounded-xl transition-colors flex items-center gap-1"
            title="Execute 1 step (F10)"
          >
            <span>⏭</span>
            <span>STEP</span>
          </button>

          <button
            onClick={pauseExecution}
            disabled={!playing}
            className="px-3 py-2 bg-[#131D2D] hover:bg-[#24344A] disabled:opacity-40 border border-[#24344A] text-xs font-bold text-[#CBD5E1] rounded-xl transition-colors flex items-center gap-1"
            title="Pause execution"
          >
            <span>⏸</span>
            <span>PAUSE</span>
          </button>

          <button
            onClick={stopExecution}
            disabled={!playing}
            className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 disabled:opacity-40 text-xs font-bold text-red-400 rounded-xl transition-colors flex items-center gap-1"
            title="Stop execution"
          >
            <span>■</span>
            <span>STOP</span>
          </button>

          <button
            onClick={resetExecution}
            className="px-3 py-2 bg-[#131D2D] hover:bg-[#24344A] border border-[#24344A] text-xs font-bold text-[#CBD5E1] rounded-xl transition-colors flex items-center gap-1"
            title="Reset state (Ctrl+Shift+R)"
          >
            <span>↻</span>
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE GRID: CODE EDITOR & LIVE VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[480px]">
        {/* CODE EDITOR PANEL */}
        <div className="flex flex-col bg-[#101827] border border-[#24344A] rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1420] border-b border-[#24344A]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language}
              </span>
              <span className="text-[10px] font-mono text-[#64748B] uppercase">({language})</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button onClick={copyCodeToClipboard} className="text-[#CBD5E1] hover:text-white px-2 py-1 rounded bg-[#131D2D]">
                Copy
              </button>
              <button onClick={formatCode} className="text-[#CBD5E1] hover:text-white px-2 py-1 rounded bg-[#131D2D]">
                Format
              </button>
              <button onClick={() => setCode(fullProgramItem?.code[language] || '')} className="text-[#CBD5E1] hover:text-white px-2 py-1 rounded bg-[#131D2D]">
                Reset Code
              </button>
            </div>
          </div>

          {/* Editor Container */}
          <div className="flex-1 relative bg-[#050914] min-h-[380px]">
            {useMonaco ? (
              <Editor
                height="100%"
                language={language === 'c' ? 'cpp' : language}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: 'Fira Code, DM Mono, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  automaticLayout: true,
                }}
              />
            ) : (
              <div className="flex h-full font-mono text-xs">
                {/* Fallback Line Numbers */}
                <div className="w-10 bg-[#0A1120] text-[#64748B] py-3 text-right pr-2 select-none border-r border-[#24344A]">
                  {lines.map((_, i) => (
                    <div
                      key={i}
                      className={`h-5 leading-5 cursor-pointer ${
                        currentLineNumber === i + 1 ? 'text-[#22D3EE] font-bold bg-[#22D3EE]/20' : ''
                      }`}
                      onClick={() =>
                        setBreakpoints((prev) =>
                          prev.includes(i + 1) ? prev.filter((l) => l !== i + 1) : [...prev, i + 1]
                        )
                      }
                    >
                      {breakpoints.includes(i + 1) ? '●' : i + 1}
                    </div>
                  ))}
                </div>
                {/* Fallback Textarea */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 bg-[#050914] text-[#F8FAFC] p-3 focus:outline-none resize-none font-mono leading-5"
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* LIVE VISUALIZATION PANEL */}
        <div className="flex flex-col bg-[#101827] border border-[#24344A] rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1420] border-b border-[#24344A]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">LIVE VISUALIZATION</span>
            </div>
            <div className="text-xs font-mono text-[#22D3EE] font-bold">
              {steps.length ? `STEP ${currentStepIndex + 1} / ${steps.length}` : 'NO EXECUTION YET'}
            </div>
          </div>

          {/* Visualizer Canvas Area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-[#050914]/60 p-4 min-h-[380px] overflow-hidden">
            {renderVisualizer()}
          </div>

          {/* Active Operation HUD */}
          <div className="px-4 py-3 bg-[#0d1420] border-t border-[#24344A] flex items-center justify-between text-xs font-mono">
            <span className="text-[#64748B]">Active Step:</span>
            <span className="text-[#22D3EE] font-bold truncate max-w-xs">
              {activeStep?.description || 'Waiting to run program...'}
            </span>
          </div>
        </div>
      </div>

      {/* INPUT PANEL FOR PARAMETERS */}
      <div className="bg-[#101827] border border-[#24344A] rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-mono font-bold text-[#CBD5E1] mb-1">
            INPUT PARAMETERS / STDIN
          </label>
          <input
            type="text"
            value={programInput}
            onChange={(e) => setProgramInput(e.target.value)}
            placeholder="Enter custom array elements or search target..."
            className="w-full bg-[#050914] border border-[#24344A] rounded-xl py-2 px-3 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:border-[#22D3EE]"
          />
        </div>
        <button
          onClick={() => void runProgram()}
          className="px-4 py-2.5 bg-[#131D2D] hover:bg-[#24344A] border border-[#22D3EE]/40 text-[#22D3EE] font-bold text-xs rounded-xl transition-colors shrink-0"
        >
          Apply Input & Re-run
        </button>
      </div>

      {/* PSEUDOCODE PANEL */}
      <div className="bg-[#101827] border border-[#24344A] rounded-2xl p-4 shadow-xl">
        <div className="text-xs font-mono font-bold text-[#CBD5E1] uppercase mb-3 flex items-center gap-2">
          <span>📜</span>
          <span>ALGORITHMIC PSEUDOCODE</span>
        </div>
        <div className="space-y-1 font-mono text-xs">
          {pseudocodeLines.map((line, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded-lg transition-colors ${
                currentStepIndex >= 0 && idx === currentStepIndex % pseudocodeLines.length
                  ? 'bg-[#22D3EE]/20 border border-[#22D3EE]/50 text-[#22D3EE] font-bold'
                  : 'text-[#94A3B8]'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM DOCK (CONSOLE, VARIABLES, CALL STACK, COMPLEXITY, HISTORY) */}
      <BottomDock
        logs={logsList}
        rawOutput={rawOutput}
        error={error}
        variables={activeStep?.variables}
        callStack={activeStep?.call_stack || ['main()']}
        complexity={fullProgramItem?.complexity}
        history={steps}
        currentStepIndex={currentStepIndex}
        onSelectStep={(idx) => {
          setPlaying(false);
          setCurrentStepIndex(idx);
        }}
        onClearConsole={() => setRawOutput('')}
        language={language}
      />
    </div>
  );
}
