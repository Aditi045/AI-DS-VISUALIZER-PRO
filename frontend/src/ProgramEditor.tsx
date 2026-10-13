import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import {
  Play,
  FastForward,
  Pause,
  Square,
  RotateCcw,
  Copy,
  AlignLeft,
  FileCode,
  Trash2,
  Maximize2,
  Minimize2,
  Shield,
  Edit3,
  Layers,
  CheckCircle2,
  Code2,
  Check,
  Eye,
  Terminal,
  Sliders,
} from 'lucide-react';
import { chapterById, type ChapterId } from './programCatalog';
import { getProgram } from './data/allPrograms';
import type { Language, Speed, ExecutionEvent } from './types/dsa';

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
  const [arraySize, setArraySize] = useState('5');
  const [elementsInput, setElementsInput] = useState('10 20 30 40 50');
  const [programInput, setProgramInput] = useState('');
  const [status, setStatus] = useState('Ready to run your program.');
  const [rawOutput, setRawOutput] = useState('');
  const [error, setError] = useState<{ type: string; message: string; line?: number | null; tool_output?: string } | null>(null);
  const [steps, setSteps] = useState<ExecutionEvent[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedConsole, setCopiedConsole] = useState(false);
  const [isFullscreenVis, setIsFullscreenVis] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Mobile Panel View Switcher tab state for screens < 1024px
  const [mobilePanelTab, setMobilePanelTab] = useState<'visualize' | 'code' | 'console' | 'params'>('visualize');

  // Desktop Tab states
  const [activeVisTab, setActiveVisTab] = useState<'visualization' | 'memory' | 'step_details' | 'pseudocode'>('visualization');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'console' | 'variables' | 'stack' | 'complexity'>('console');

  const controllerRef = useRef<AbortController | null>(null);
  const consoleBottomRef = useRef<HTMLDivElement | null>(null);

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
        return prevIndex + 1;
      });
    }, speedMap[speed]);

    return () => window.clearInterval(timer);
  }, [playing, steps, speed]);

  const activeStep = steps[Math.max(currentStepIndex, 0)];

  // Actions
  const runProgram = async () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    setPlaying(false);
    setRawOutput('');
    setError(null);
    setSteps([]);
    setCurrentStepIndex(-1);

    if (!code.trim()) {
      setError({ type: 'VALIDATION_ERROR', message: 'Program code cannot be empty.' });
      return;
    }

    setStatus('Generating execution trace...');

    // First try internal client-side trace generator from dataset for instant visual events
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
    setSteps([]);
    setCurrentStepIndex(-1);
    setStatus('Ready to run your program.');
  };

  const copyCodeToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    setStatus('Code copied to clipboard.');
  };

  const copyConsoleToClipboard = async () => {
    const textToCopy = consoleLogs.map((l) => `[${l.type}] ${l.message}`).join('\n');
    await navigator.clipboard.writeText(textToCopy);
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2000);
  };

  const formatCode = () => {
    const formatted = code
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
    setCode(formatted);
    setStatus('Code formatted.');
  };

  const handleApplyInput = () => {
    const elts = elementsInput.trim();
    setProgramInput(elts);
    void runProgram();
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

  // Build console logs from execution trace
  const consoleLogs = useMemo(() => {
    if (!steps.length) {
      return [
        { type: 'INFO', message: 'Program started...' },
        { type: 'STEP', message: 'Declaring array of size 5' },
        { type: 'STEP', message: 'Initializing elements' },
        { type: 'STEP', message: 'arr[0] = 10' },
        { type: 'STEP', message: 'arr[1] = 20' },
        { type: 'STEP', message: 'arr[2] = 30' },
        { type: 'STEP', message: 'arr[3] = 40' },
        { type: 'STEP', message: 'arr[4] = 50' },
        { type: 'SUCCESS', message: 'Array created successfully!' },
      ];
    }
    const currentList = steps.slice(0, currentStepIndex + 1);
    const logs = [];
    logs.push({ type: 'INFO', message: 'Program started...' });
    for (const s of currentList) {
      if (s.log) {
        logs.push({ type: s.log.type || 'STEP', message: s.log.message });
      } else if (s.description) {
        logs.push({ type: 'STEP', message: s.description });
      }
    }
    if (currentStepIndex >= steps.length - 1) {
      logs.push({ type: 'SUCCESS', message: `${activeCatalogProgram.name} executed successfully!` });
    }
    return logs;
  }, [steps, currentStepIndex, activeCatalogProgram.name]);

  // Operations timeline list
  const timelineOperations = useMemo(() => {
    if (!steps.length) {
      return [
        { num: 1, text: 'Declare array of size 5', line: 'Line 4', status: 'orange' },
        { num: 2, text: 'Initialize elements [10, 20, 30, 40, 50]', line: 'Line 6', status: 'green' },
        { num: 3, text: 'arr[0] = 10', line: 'Line 8', status: 'green' },
        { num: 4, text: 'arr[1] = 20', line: 'Line 8', status: 'green' },
        { num: 5, text: 'arr[2] = 30', line: 'Line 8', status: 'current' },
        { num: 6, text: 'arr[3] = 40', line: 'Line 8', status: 'green' },
        { num: 7, text: 'arr[4] = 50', line: 'Line 8', status: 'green' },
        { num: 8, text: 'Array created successfully!', line: '', status: 'green' },
      ];
    }
    return steps.map((s, idx) => ({
      num: idx + 1,
      text: s.description || s.operation || `Step ${idx + 1}`,
      line: s.line ? `Line ${s.line}` : '',
      status: idx === currentStepIndex ? 'current' : idx < currentStepIndex ? 'green' : 'pending',
    }));
  }, [steps, currentStepIndex]);

  // Simulated Memory items
  const memoryItems = useMemo(() => {
    const raw = activeStep?.state;
    const arr = Array.isArray(raw) ? raw : [10, 20, 30, 40, 50];
    return arr.map((val, idx) => ({
      address: `0x${(0x1000 + idx * 4).toString(16).toUpperCase()}`,
      index: `arr[${idx}]`,
      value: val ?? '—',
      type: 'int (4 bytes)',
      isCurrent: (activeStep?.highlight as any)?.indices?.includes(idx) ?? idx === 2,
    }));
  }, [activeStep]);

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 lg:p-6 bg-[#050914] min-h-screen text-[#F8FAFC]">
      {/* 1. PLAYGROUND HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 sm:gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[#64748B] mb-1">
            <span className="text-[#38BDF8]">{'< >'}</span>
            <span className="hover:text-white cursor-pointer">Playground</span>
            <span>&gt;</span>
            <span className="text-[#38BDF8] font-bold">{activeChapter.label}</span>
            <span>&gt;</span>
            <span className="text-[#F8FAFC] font-bold">{activeCatalogProgram.name}</span>
          </div>

          {/* Title & Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              {activeCatalogProgram.name}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 py-1 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E] text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-sm">
                <Shield className="w-3 h-3" />
                <span>Beginner</span>
              </span>

              <span className="px-2.5 py-1 rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8] text-[11px] sm:text-xs font-bold shadow-sm">
                {activeChapter.label}
              </span>

              <span className="px-2.5 py-1 rounded-full border border-[#24344A] bg-[#0A1120] text-[#CBD5E1] text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow-sm">
                <span>🐍</span>
                <span className="capitalize">{language}</span>
              </span>

              <span className="px-2.5 py-1 rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[11px] sm:text-xs font-mono font-bold shadow-sm">
                Time: {fullProgramItem?.complexity?.timeAverage || 'O(n)'}
              </span>

              <span className="px-2.5 py-1 rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6] text-[11px] sm:text-xs font-mono font-bold shadow-sm">
                Space: {fullProgramItem?.complexity?.space || 'O(n)'}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xs text-[#CBD5E1] mt-1.5 max-w-2xl leading-relaxed">
            {activeCatalogProgram.description || 'Initialize a contiguous array with predefined elements and visualize the memory allocation.'}
          </p>
        </div>

        {/* Learning Progress Card Top-Right */}
        <div className="w-full md:w-60 bg-[#0A1120] border border-[#24344A] rounded-2xl p-3 sm:p-3.5 shadow-xl shrink-0">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-[#CBD5E1]">Learning Progress</span>
            <span className="text-[#F8FAFC] font-mono">50%</span>
          </div>
          <div className="w-full bg-[#101827] rounded-full h-2 overflow-hidden border border-[#24344A]">
            <div
              className="bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#6366F1] h-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              style={{ width: '50%' }}
            />
          </div>
        </div>
      </div>

      {/* 2. UNIFIED EXECUTION TOOLBAR CARD */}
      <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex flex-col gap-1 flex-1 sm:flex-none min-w-[100px]">
            <label className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-[#101827] border border-[#24344A] rounded-xl py-2 px-3 text-xs text-[#F8FAFC] font-bold focus:outline-none focus:border-[#22D3EE] cursor-pointer min-h-[44px]"
            >
              <option value="python">🐍 Python</option>
              <option value="c">⚙️ C</option>
              <option value="cpp">⚡ C++</option>
              <option value="java">☕ Java</option>
            </select>
          </div>

          {/* Program Selector */}
          <div className="flex flex-col gap-1 flex-1 sm:flex-none min-w-[130px]">
            <label className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => onProgramChange?.(e.target.value)}
              className="bg-[#101827] border border-[#24344A] rounded-xl py-2 px-3 text-xs text-[#F8FAFC] font-bold focus:outline-none focus:border-[#22D3EE] cursor-pointer min-h-[44px]"
            >
              {activeChapter.programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Execution Speed Selector */}
          <div className="flex flex-col gap-1 flex-1 sm:flex-none min-w-[120px]">
            <label className="text-[10px] font-mono font-bold text-[#64748B] uppercase">Execution Speed</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value as Speed)}
              className="bg-[#101827] border border-[#24344A] rounded-xl py-2 px-3 text-xs text-[#F8FAFC] font-bold focus:outline-none focus:border-[#22D3EE] cursor-pointer min-h-[44px]"
            >
              <option value="very-slow">0.5x (Slow)</option>
              <option value="normal">1x (Normal)</option>
              <option value="fast">2x (Fast)</option>
              <option value="very-fast">4x (Instant)</option>
            </select>
          </div>
        </div>

        {/* Buttons (Min touch height 44px) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
          {/* Load Example */}
          <button
            onClick={() => {
              setCode(fullProgramItem?.code[language] || '');
              setStatus('Loaded default example.');
            }}
            className="px-3.5 py-2.5 bg-[#131D2D] hover:bg-[#24344A] border border-[#24344A] text-[#CBD5E1] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px]"
            title="Load template code"
          >
            <FileCode className="w-4 h-4 text-[#38BDF8]" />
            <span>Load Example</span>
          </button>

          {/* Clear */}
          <button
            onClick={() => {
              setCode('');
              resetExecution();
            }}
            className="px-3.5 py-2.5 bg-[#131D2D] hover:bg-[#24344A] border border-[#24344A] text-[#CBD5E1] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px]"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4 text-[#64748B]" />
            <span>Clear</span>
          </button>

          {/* Run (Green accent) */}
          <button
            onClick={() => void runProgram()}
            className="px-4 py-2.5 bg-[#22C55E] hover:bg-[#16a34a] text-[#050914] font-extrabold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.35)] flex items-center gap-1.5 min-h-[44px]"
            title="Run program (Ctrl+Enter)"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run</span>
          </button>

          {/* Step (Blue accent) */}
          <button
            onClick={stepOnce}
            className="px-3.5 py-2.5 bg-[#38BDF8] hover:bg-[#0284c7] text-[#050914] font-extrabold text-xs rounded-xl transition-all shadow-[0_0_12px_rgba(56,189,248,0.35)] flex items-center gap-1.5 min-h-[44px]"
            title="Step next (F10)"
          >
            <FastForward className="w-4 h-4 fill-current" />
            <span>Step</span>
          </button>

          {/* Pause (Orange accent) */}
          <button
            onClick={pauseExecution}
            disabled={!playing}
            className="px-3.5 py-2.5 bg-[#F59E0B] hover:bg-[#d97706] disabled:opacity-40 text-[#050914] font-extrabold text-xs rounded-xl transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)] flex items-center gap-1.5 min-h-[44px]"
            title="Pause execution"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause</span>
          </button>

          {/* Stop (Red accent) */}
          <button
            onClick={stopExecution}
            disabled={!playing}
            className="px-3.5 py-2.5 bg-[#EF4444] hover:bg-[#dc2626] disabled:opacity-40 text-white font-extrabold text-xs rounded-xl transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)] flex items-center gap-1.5 min-h-[44px]"
            title="Stop execution"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Stop</span>
          </button>

          {/* Reset (Purple accent) */}
          <button
            onClick={resetExecution}
            className="px-3.5 py-2.5 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-extrabold text-xs rounded-xl transition-all shadow-[0_0_12px_rgba(139,92,246,0.35)] flex items-center gap-1.5 min-h-[44px]"
            title="Reset (Ctrl+Shift+R)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* MOBILE PANEL SWITCHER TABS (Visible on screens < 1024px) */}
      <div className="lg:hidden flex items-center gap-1 bg-[#0A1120] border border-[#24344A] p-1.5 rounded-2xl overflow-x-auto touch-pan-x">
        <button
          onClick={() => setMobilePanelTab('visualize')}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
            mobilePanelTab === 'visualize'
              ? 'bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] shadow-md'
              : 'text-[#64748B] hover:text-[#CBD5E1]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Visualize</span>
        </button>

        <button
          onClick={() => setMobilePanelTab('code')}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
            mobilePanelTab === 'code'
              ? 'bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] shadow-md'
              : 'text-[#64748B] hover:text-[#CBD5E1]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>

        <button
          onClick={() => setMobilePanelTab('console')}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
            mobilePanelTab === 'console'
              ? 'bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] shadow-md'
              : 'text-[#64748B] hover:text-[#CBD5E1]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Console</span>
        </button>

        <button
          onClick={() => setMobilePanelTab('params')}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[40px] ${
            mobilePanelTab === 'params'
              ? 'bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] shadow-md'
              : 'text-[#64748B] hover:text-[#CBD5E1]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Inputs</span>
        </button>
      </div>

      {/* 3. MID WORKSPACE GRID (CODE EDITOR & LIVE VISUALIZATION PANEL) */}
      <div className={`grid grid-cols-1 ${isFullscreenVis ? '' : 'lg:grid-cols-2'} gap-4 min-h-[420px]`}>
        {/* LEFT: CODE EDITOR (Hidden on mobile if tab is not 'code' or 'visualize' unless desktop) */}
        {(!isFullscreenVis && (mobilePanelTab === 'code' || window.innerWidth >= 1024)) && (
          <div className="flex flex-col bg-[#080D16] border border-[#24344A] rounded-2xl overflow-hidden shadow-2xl">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#0A1120] border-b border-[#24344A]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#101827] border border-[#24344A] text-xs font-mono font-bold text-[#F8FAFC]">
                  <Code2 className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] font-mono text-[10px] font-bold capitalize">
                  {language}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={copyCodeToClipboard}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#131D2D] hover:bg-[#24344A] text-[#CBD5E1] hover:text-white transition-colors min-h-[36px]"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3" />}
                  <span className="hidden sm:inline">{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={formatCode}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#131D2D] hover:bg-[#24344A] text-[#CBD5E1] hover:text-white transition-colors min-h-[36px]"
                >
                  <AlignLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Format</span>
                </button>
                <button
                  onClick={() => setCode(fullProgramItem?.code[language] || '')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#131D2D] hover:bg-[#24344A] text-[#CBD5E1] hover:text-white transition-colors min-h-[36px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset Code</span>
                </button>
              </div>
            </div>

            {/* Monaco Code Editor Container */}
            <div className="flex-1 min-h-[320px] sm:min-h-[360px] relative bg-[#080D16]">
              <Editor
                height="100%"
                language={language === 'c' ? 'cpp' : language}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  automaticLayout: true,
                  tabSize: 4,
                  lineHeight: 22,
                }}
              />
            </div>
          </div>
        )}

        {/* RIGHT: LIVE VISUALIZATION PANEL */}
        {(mobilePanelTab === 'visualize' || window.innerWidth >= 1024) && (
          <div className="flex flex-col bg-[#101827] border border-[#24344A] rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Header Tabs */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#0A1120] border-b border-[#24344A] overflow-x-auto touch-pan-x">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveVisTab('visualization')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[36px] ${
                    activeVisTab === 'visualization'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  Visualization
                </button>

                <button
                  onClick={() => setActiveVisTab('memory')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[36px] ${
                    activeVisTab === 'memory'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  Memory View
                </button>

                <button
                  onClick={() => setActiveVisTab('step_details')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[36px] ${
                    activeVisTab === 'step_details'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  Step Details
                </button>

                <button
                  onClick={() => setActiveVisTab('pseudocode')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[36px] ${
                    activeVisTab === 'pseudocode'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  Pseudo Code
                </button>
              </div>

              {/* Fullscreen toggle */}
              <button
                onClick={() => setIsFullscreenVis(!isFullscreenVis)}
                className="p-1.5 text-[#64748B] hover:text-white rounded-lg hover:bg-[#131D2D] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                title={isFullscreenVis ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreenVis ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Subheader Operation HUD */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#0d1420] border-b border-[#24344A] text-xs font-mono gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[#38BDF8]">⊞</span>
                <span className="font-extrabold text-[#F8FAFC]">
                  {activeChapter.label} Visualization
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="text-[#CBD5E1]">
                  Step: <span className="text-[#22D3EE] font-bold">{Math.max(currentStepIndex + 1, 1)}</span> / {Math.max(steps.length, 8)}
                </div>
                <div className="text-[#CBD5E1]">
                  Line: <span className="text-[#22D3EE] font-bold">{activeStep?.line || 8}</span>
                </div>
                <div className="text-[#CBD5E1] truncate max-w-[180px] sm:max-w-xs">
                  Op: <span className="text-[#22D3EE] font-bold">{activeStep?.operation || 'ASSIGN → arr[2] = 30'}</span>
                </div>
              </div>
            </div>

            {/* Visualization Body / Canvas */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#050914]/80 p-3 sm:p-4 min-h-[320px] max-w-full overflow-x-auto touch-pan-x select-none">
              {activeVisTab === 'visualization' && renderVisualizer()}

              {activeVisTab === 'memory' && (
                <div className="w-full max-w-xl p-3 sm:p-4 bg-[#0A1120] border border-[#24344A] rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#24344A] mb-3">
                    <span className="font-mono text-xs font-bold text-[#22D3EE]">SIMULATED CONTIGUOUS MEMORY (RAM)</span>
                    <span className="text-[10px] text-[#64748B] font-mono">32-bit Architecture</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-xs max-h-60 overflow-y-auto">
                    {memoryItems.map((mem) => (
                      <div
                        key={mem.address}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                          mem.isCurrent
                            ? 'bg-[#22D3EE]/15 border-[#22D3EE] text-[#22D3EE] font-bold shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                            : 'bg-[#101827] border-[#24344A] text-[#CBD5E1]'
                        }`}
                      >
                        <span className="text-[#64748B]">{mem.address}</span>
                        <span className="font-bold">{mem.index}</span>
                        <span className="px-2 py-0.5 rounded bg-[#050914] text-white border border-[#24344A]">
                          {mem.value}
                        </span>
                        <span className="text-[10px] text-[#64748B]">{mem.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeVisTab === 'step_details' && (
                <div className="w-full max-w-lg p-4 bg-[#0A1120] border border-[#24344A] rounded-2xl shadow-xl font-mono text-xs space-y-3">
                  <div className="text-xs sm:text-sm font-bold text-[#22D3EE] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span>Step {Math.max(currentStepIndex + 1, 1)} Breakdown</span>
                  </div>
                  <div className="p-3 bg-[#101827] rounded-xl border border-[#24344A] space-y-1.5">
                    <div className="text-[#64748B]">Action: <span className="text-white font-bold">{activeStep?.operation || 'ASSIGN → arr[2] = 30'}</span></div>
                    <div className="text-[#64748B]">Executed Line: <span className="text-[#38BDF8] font-bold">Line {activeStep?.line || 8}</span></div>
                    <div className="text-[#64748B]">Data Structure: <span className="text-white font-bold">{chapter.toUpperCase()}</span></div>
                    <div className="text-[#64748B]">State Transition: <span className="text-[#22C55E]">Memory cell modified in O(1) time</span></div>
                  </div>
                </div>
              )}

              {activeVisTab === 'pseudocode' && (
                <div className="w-full max-w-lg p-3 sm:p-4 bg-[#0A1120] border border-[#24344A] rounded-2xl shadow-xl space-y-1 font-mono text-xs">
                  {pseudocodeLines.map((line, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl transition-all ${
                        currentStepIndex >= 0 && idx === currentStepIndex % pseudocodeLines.length
                          ? 'bg-[#22D3EE]/20 border border-[#22D3EE]/50 text-[#22D3EE] font-bold shadow-sm'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM 3-PANEL ROW (CONSOLE, INPUT/PARAMETERS, OPERATION HISTORY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* PANEL 1: CONSOLE / TERMINAL (Col Span 5) */}
        {(mobilePanelTab === 'console' || window.innerWidth >= 1024) && (
          <div className="lg:col-span-5 flex flex-col bg-[#0A1120] border border-[#24344A] rounded-2xl overflow-hidden shadow-2xl">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#0d1420] border-b border-[#24344A] overflow-x-auto touch-pan-x">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveConsoleTab('console')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
                    activeConsoleTab === 'console'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  Console
                </button>

                <button
                  onClick={() => setActiveConsoleTab('variables')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
                    activeConsoleTab === 'variables'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  Variables
                </button>

                <button
                  onClick={() => setActiveConsoleTab('stack')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
                    activeConsoleTab === 'stack'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  Call Stack
                </button>

                <button
                  onClick={() => setActiveConsoleTab('complexity')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
                    activeConsoleTab === 'complexity'
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  Complexity
                </button>
              </div>

              {/* Console controls */}
              <div className="flex items-center gap-2 text-xs shrink-0">
                <label className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#64748B] cursor-pointer">
                  <span>Auto Scroll</span>
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="rounded border-[#24344A] bg-[#101827] text-[#22D3EE] focus:ring-0"
                  />
                </label>
                <button
                  onClick={() => setSteps([])}
                  className="px-2 py-1 rounded bg-[#131D2D] text-[#CBD5E1] hover:text-white text-[11px] min-h-[32px]"
                >
                  Clear
                </button>
                <button
                  onClick={copyConsoleToClipboard}
                  className="px-2 py-1 rounded bg-[#131D2D] text-[#CBD5E1] hover:text-white text-[11px] min-h-[32px]"
                >
                  {copiedConsole ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Console Body */}
            <div className="p-3 sm:p-4 flex-1 min-h-[170px] max-h-[220px] overflow-y-auto bg-[#070D18] font-mono text-xs">
              {activeConsoleTab === 'console' && (
                <div className="space-y-1">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span
                        className={`font-bold shrink-0 ${
                          log.type === 'INFO'
                            ? 'text-[#38BDF8]'
                            : log.type === 'STEP'
                            ? 'text-[#22D3EE]'
                            : log.type === 'SUCCESS'
                            ? 'text-[#22C55E]'
                            : 'text-[#F59E0B]'
                        }`}
                      >
                        [{log.type}]
                      </span>
                      <span className="text-[#CBD5E1] break-all">{log.message}</span>
                    </div>
                  ))}
                  <div ref={consoleBottomRef} />
                </div>
              )}

              {activeConsoleTab === 'variables' && (
                <div className="space-y-1">
                  <div className="text-[#64748B] text-[10px] uppercase font-bold mb-2">Runtime Variables</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-[#101827] border border-[#24344A]">
                      <span className="text-[#64748B]">n: </span>
                      <span className="text-[#22D3EE] font-bold">{arraySize}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#101827] border border-[#24344A]">
                      <span className="text-[#64748B]">i: </span>
                      <span className="text-[#38BDF8] font-bold">{activeStep?.line ? '2' : '0'}</span>
                    </div>
                    <div className="col-span-2 p-2 rounded-lg bg-[#101827] border border-[#24344A]">
                      <span className="text-[#64748B]">arr: </span>
                      <span className="text-[#22C55E] font-bold">[{elementsInput}]</span>
                    </div>
                  </div>
                </div>
              )}

              {activeConsoleTab === 'stack' && (
                <div className="space-y-1.5">
                  <div className="text-[#64748B] text-[10px] uppercase font-bold mb-2">Active Call Frames</div>
                  <div className="p-2 rounded-lg bg-[#101827] border border-[#22D3EE]/40 text-[#22D3EE] font-bold">
                    → main() [line {activeStep?.line || 8}]
                  </div>
                  <div className="p-2 rounded-lg bg-[#0A1120] border border-[#24344A] text-[#64748B]">
                    module scope __init__
                  </div>
                </div>
              )}

              {activeConsoleTab === 'complexity' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-[#101827] border border-[#24344A]">
                      <div className="text-[#64748B] text-[10px]">Time Complexity</div>
                      <div className="text-sm font-bold text-[#22D3EE]">{fullProgramItem?.complexity?.timeAverage || 'O(n)'}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#101827] border border-[#24344A]">
                      <div className="text-[#64748B] text-[10px]">Space Complexity</div>
                      <div className="text-sm font-bold text-[#8B5CF6]">{fullProgramItem?.complexity?.space || 'O(n)'}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                    {fullProgramItem?.complexity?.notes || 'Allocates contiguous memory proportional to the number of elements specified.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 2: INPUT / PARAMETERS CARD (Col Span 3) */}
        {(mobilePanelTab === 'params' || window.innerWidth >= 1024) && (
          <div className="lg:col-span-3 flex flex-col justify-between bg-[#0A1120] border border-[#24344A] rounded-2xl p-3.5 sm:p-4 shadow-2xl">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#24344A] text-xs font-bold text-[#F8FAFC]">
                <Edit3 className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Input / Parameters</span>
              </div>

              {/* Inputs */}
              <div className="space-y-3 mt-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] mb-1">Array Size (n)</label>
                  <input
                    type="text"
                    value={arraySize}
                    onChange={(e) => setArraySize(e.target.value)}
                    className="w-full bg-[#070D18] border border-[#24344A] rounded-xl py-2 px-3 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:border-[#22D3EE] transition-colors min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] mb-1">Elements (space separated)</label>
                  <input
                    type="text"
                    value={elementsInput}
                    onChange={(e) => setElementsInput(e.target.value)}
                    className="w-full bg-[#070D18] border border-[#24344A] rounded-xl py-2 px-3 text-xs text-[#F8FAFC] font-mono focus:outline-none focus:border-[#22D3EE] transition-colors min-h-[40px]"
                  />
                </div>
              </div>
            </div>

            {/* Apply Input Button */}
            <button
              onClick={handleApplyInput}
              className="w-full mt-4 py-3 bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] hover:from-[#38BDF8] hover:to-[#6366F1] text-[#050914] font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              Apply Input
            </button>
          </div>
        )}

        {/* PANEL 3: OPERATION HISTORY (Col Span 4) */}
        {(mobilePanelTab === 'params' || window.innerWidth >= 1024) && (
          <div className="lg:col-span-4 flex flex-col bg-[#0A1120] border border-[#24344A] rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1420] border-b border-[#24344A]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC]">
                <Layers className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Operation History</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span>Live</span>
              </div>
            </div>

            {/* Timeline List */}
            <div className="p-3 flex-1 min-h-[170px] max-h-[220px] overflow-y-auto space-y-1.5 font-mono text-xs">
              {timelineOperations.map((op) => (
                <div
                  key={op.num}
                  onClick={() => {
                    setPlaying(false);
                    setCurrentStepIndex(op.num - 1);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer min-h-[36px] ${
                    op.status === 'current'
                      ? 'bg-[#101827] border-[#22D3EE]/60 text-[#22D3EE] font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-[#070D18]/80 border-[#24344A]/50 text-[#CBD5E1] hover:bg-[#131D2D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-4 text-center text-[#64748B] text-[10px]">{op.num}</span>
                    <span className="text-xs">
                      {op.status === 'orange' ? (
                        <span className="text-[#F59E0B]">⚙</span>
                      ) : op.status === 'current' ? (
                        <span className="text-[#22D3EE]">▶</span>
                      ) : (
                        <span className="text-[#22C55E]">✓</span>
                      )}
                    </span>
                    <span className="truncate">{op.text}</span>
                  </div>
                  {op.line && <span className="text-[10px] text-[#64748B] shrink-0 ml-2">{op.line}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
