import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import StackVisualizer from './visualizers/StackVisualizer';
import QueueVisualizer from './visualizers/QueueVisualizer';
import LinkedListVisualizer from './visualizers/LinkedListVisualizer';
import TreeVisualizer from './visualizers/TreeVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';
import AuthScreen from './AuthScreen';
import ProgramEditor from './ProgramEditor';
import { chapters, chapterById, type ChapterId } from './programCatalog';

type DS = 'stack' | 'queue' | 'linked_list' | 'bst' | 'heap' | 'graph';
type Language = 'c' | 'cpp' | 'java' | 'python';
type Complexity = { time: string; space: string };
type EventItem = { step: number; event_type: string; description: string; state: unknown; complexity: string };
type HistoryItem = { id: number; command: string; data_structure: string; language?: Language; created_at: string };
type User = { id: number; name: string; email: string };

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const structures: { id: DS; label: string; icon: string }[] = [
  { id: 'stack', label: 'Stack', icon: '▥' }, { id: 'queue', label: 'Queue', icon: '⇢' },
  { id: 'linked_list', label: 'Linked List', icon: '⛓' }, { id: 'bst', label: 'Binary Tree', icon: '⑂' },
  { id: 'heap', label: 'Heap', icon: '◆' }, { id: 'graph', label: 'Graph', icon: '✣' },
];

const chapterFromPath = (): ChapterId => {
  const pathChapter = window.location.pathname.split('/')[2] as ChapterId | undefined;
  return pathChapter && chapters.some(chapter => chapter.id === pathChapter) ? pathChapter : 'stack';
};

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('aids_user');
    return stored ? JSON.parse(stored) as User : null;
  });
  const [activeDS, setActiveDS] = useState<DS>('stack');
  const [selectedChapter, setSelectedChapter] = useState<ChapterId>(() => {
    const saved = localStorage.getItem('aids_chapter') as ChapterId | null;
    const fromPath = chapterFromPath();
    return window.location.pathname.startsWith('/playground/') ? fromPath : saved && chapters.some(chapter => chapter.id === saved) ? saved : 'stack';
  });
  const [selectedProgram, setSelectedProgram] = useState(() => localStorage.getItem('aids_program') || chapterById('stack').programs[0].id);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('aids_language') as Language) || 'python');
  const [command, setCommand] = useState('Create a stack and push 10, 20 and 30.');
  const [state, setState] = useState<unknown[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [visibleStep, setVisibleStep] = useState(-1);
  const [complexity, setComplexity] = useState<Complexity>({ time: 'O(1)', space: 'O(1)' });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chat, setChat] = useState('');
  const [chatAnswer, setChatAnswer] = useState('Ask me why an operation works or what you are seeing.');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('Ready when you are.');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showProgramEditor, setShowProgramEditor] = useState(() => window.location.pathname === '/playground' || window.location.pathname.startsWith('/playground/'));
  const sessionId = user ? `user-${user.id}` : 'demo-session';

  const loadHistory = async () => {
    try { setHistory((await axios.get<HistoryItem[]>(`${API}/api/history`, { params: { session_id: sessionId } })).data); } catch { /* backend may be starting */ }
  };
  useEffect(() => { void loadHistory(); }, [sessionId]);
  useEffect(() => {
    if (!isPlaying || !events.length) return;
    const timer = window.setInterval(() => {
      setVisibleStep(current => {
        if (current >= events.length - 1) { setIsPlaying(false); return events.length - 1; }
        return current + 1;
      });
    }, 1200 / playbackSpeed);
    return () => window.clearInterval(timer);
  }, [isPlaying, events.length, playbackSpeed]);

  const authenticate = (nextUser: User, token: string) => {
    localStorage.setItem('aids_user', JSON.stringify(nextUser));
    localStorage.setItem('aids_token', token);
    setUser(nextUser);
  };

  const renderVisualizer = useMemo(() => {
    const shown = visibleStep >= 0 && events[visibleStep] ? events[visibleStep].state : state;
    if (activeDS === 'stack') return <StackVisualizer items={Array.isArray(shown) ? shown : []} />;
    if (activeDS === 'queue') return <QueueVisualizer items={Array.isArray(shown) ? shown : []} />;
    if (activeDS === 'linked_list') return <LinkedListVisualizer items={Array.isArray(shown) ? shown : []} />;
    if (activeDS === 'bst' || activeDS === 'heap') return <TreeVisualizer state={shown} />;
    return <GraphVisualizer state={shown} />;
  }, [activeDS, events, state, visibleStep]);

  const execute = async () => {
    if (!command.trim() || loading) return;
    setLoading(true); setNotice('Parsing and validating your command…'); setVisibleStep(-1);
    try {
      const parsed = await axios.post(`${API}/api/ai/parse`, { command });
      if (!parsed.data.success) throw new Error(parsed.data.message ?? parsed.data.error);
      const payload = parsed.data.data;
      const response = await axios.post(`${API}/api/execute/`, { session_id: sessionId, command_text: command, language, ...payload });
      if (!response.data.success) throw new Error(response.data.message ?? response.data.error);
      setActiveDS(payload.data_structure); setState(response.data.state); setEvents(response.data.events); setComplexity(response.data.complexity); setGeneratedCode(response.data.source_code ?? ''); setIsPlaying(false); setVisibleStep(-1);
      setNotice(`${response.data.events.length} step${response.data.events.length === 1 ? '' : 's'} completed in ${language.toUpperCase()}.`);
      await loadHistory();
    } catch (error) {
      const message = axios.isAxiosError(error) ? (error.response?.data?.detail?.message ?? error.response?.data?.message) : undefined;
      setNotice(message ?? (error instanceof Error ? error.message : 'The command could not be completed.'));
    } finally { setLoading(false); }
  };

  const askTutor = async () => {
    if (!chat.trim()) return;
    try {
      const result = await axios.post(`${API}/api/chat/`, { message: chat, context_ds: activeDS, context_state: state, complexity: complexity.time });
      setChatAnswer(result.data.response); setChat('');
    } catch { setChatAnswer('The tutor is unavailable right now. Try the built-in examples in the command box.'); }
  };

  const resetPlayback = () => { setIsPlaying(false); setVisibleStep(-1); };
  const nextStep = () => setVisibleStep(current => Math.min(current + 1, Math.max(events.length - 1, 0)));
  const visualizationLink = () => `${window.location.origin}${window.location.pathname}?topic=${activeDS}&language=${language}`;
  const shareVisualization = async () => {
    const url = visualizationLink();
    try {
      if (navigator.share) await navigator.share({ title: 'AI-DS Visualizer Pro', text: `Explore my ${language.toUpperCase()} ${activeDS} visualization`, url });
      else { await navigator.clipboard.writeText(url); setNotice('Visualization link copied.'); }
    } catch { setNotice('Sharing was cancelled.'); }
  };
  const copyVisualizationLink = async () => { await navigator.clipboard.writeText(visualizationLink()); setNotice('Visualization link copied.'); };
  const tweetVisualization = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Learning ${activeDS} in ${language.toUpperCase()} with AI-DS Visualizer Pro`)}&url=${encodeURIComponent(visualizationLink())}`, '_blank', 'noopener,noreferrer');
  const selectChapter = (chapter: ChapterId, program = chapterById(chapter).programs[0].id) => { setSelectedChapter(chapter); setSelectedProgram(program); localStorage.setItem('aids_chapter', chapter); localStorage.setItem('aids_program', program); };

  if (!user) return <AuthScreen onAuthenticated={authenticate} />;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark">AI</div><div><strong>AI-DS</strong><span>VISUALIZER PRO</span></div></div>
      <p className="eyebrow">Data structures</p>
      <button className={showProgramEditor ? 'nav-item active editor-nav' : 'nav-item editor-nav'} onClick={() => { window.history.pushState({}, '', '/playground'); setShowProgramEditor(true); setMobileMenu(false); }}><span>⌘</span>Program Editor<i>›</i></button>
      <div className="structure-list">{chapters.map(item => <div className="chapter-nav" key={item.id}><button aria-expanded={showProgramEditor && selectedChapter === item.id} aria-current={selectedChapter === item.id ? 'page' : undefined} aria-label={`Open ${item.label} chapter`} key={item.id} className={selectedChapter === item.id ? 'nav-item active' : 'nav-item'} onClick={() => { window.history.pushState({}, '', `/playground/${item.id}`); setShowProgramEditor(true); selectChapter(item.id); setMobileMenu(false); }}><span>{item.icon}</span>{item.label}<i>{selectedChapter === item.id && showProgramEditor ? '⌄' : '›'}</i></button>{showProgramEditor && selectedChapter === item.id && <div className="chapter-programs">{item.programs.map(program => <button aria-current={selectedProgram === program.id ? 'true' : undefined} aria-label={`Open ${item.label} ${program.name} program`} className={selectedProgram === program.id ? 'chapter-program active' : 'chapter-program'} key={program.id} onClick={(event) => { event.stopPropagation(); window.history.pushState({}, '', `/playground/${item.id}/${program.id}`); selectChapter(item.id, program.id); setShowProgramEditor(true); setMobileMenu(false); }}><span>·</span>{program.name}</button>)}</div>}</div>)}</div>
      <p className="eyebrow algorithm-label">Algorithms</p>
      <div className="algorithm-chips"><span>BFS</span><span>DFS</span><span>Dijkstra</span><span>Sorting</span><span>Searching</span></div>
      <div className="sidebar-footer"><div className="xp-line"><span>Learning progress</span><b>24%</b></div><div className="progress"><i /></div><small>Keep exploring to unlock badges</small></div>
    </aside>

    {showProgramEditor ? <ProgramEditor api={API} chapter={selectedChapter} selectedProgram={selectedProgram} onProgramChange={(program) => { setSelectedProgram(program); localStorage.setItem('aids_program', program); }} /> : <main className="main-area">
      <header className="topbar"><button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)}>☰</button><div><p className="eyebrow">Interactive workspace</p><h1>Learn DSA. Ask AI. <em>Master.</em></h1></div><div className="top-actions"><label className="language-picker"><span>Language</span><select value={language} onChange={e => { const next = e.target.value as Language; setLanguage(next); localStorage.setItem('aids_language', next); }}><option value="python">Python</option><option value="c">C</option><option value="cpp">C++</option><option value="java">Java</option></select></label><button className="ghost-button">⌘ K <span>Commands</span></button><button className="avatar" title="Sign out" onClick={() => { localStorage.removeItem('aids_user'); localStorage.removeItem('aids_token'); setUser(null); }}>{user.name.slice(0, 1).toUpperCase()}</button></div></header>
      <section className="stats-row"><div><span>Current topic</span><strong>{structures.find(s => s.id === activeDS)?.label}</strong></div><div><span>Steps executed</span><strong>{events.length}</strong></div><div><span>Time complexity</span><strong className="cyan">{complexity.time}</strong></div><div><span>Learning streak</span><strong>3 days 🔥</strong></div></section>
      <section className="visual-toolbar panel"><button className="play-button" onClick={() => { if (visibleStep >= events.length - 1) setVisibleStep(-1); setIsPlaying(value => !value); }} disabled={!events.length}>{isPlaying ? '❚❚ Pause' : '▶ Resume'}</button><button className="toolbar-icon" onClick={nextStep} disabled={!events.length || visibleStep >= events.length - 1} title="Next step">▷|</button><button className="toolbar-icon stop" onClick={() => setIsPlaying(false)} title="Stop">■</button><button className="toolbar-icon" onClick={resetPlayback} title="Reset">↶</button><span className="toolbar-divider" /><span className="toolbar-label">Speed:</span>{[0.5, 1, 2, 4].map(speed => <button key={speed} className={playbackSpeed === speed ? 'speed-button selected' : 'speed-button'} onClick={() => setPlaybackSpeed(speed)}>{speed}x</button>)}<span className="toolbar-divider" /><span className="step-count">Step {visibleStep >= 0 ? visibleStep + 1 : events.length ? 1 : 0}/{events.length}</span><button className="step-run-button" onClick={() => { setIsPlaying(false); setVisibleStep(0); }} disabled={!events.length}>♧ Run Step-by-Step</button><div className="toolbar-spacer" /><button className="share-button" onClick={() => void shareVisualization()}>♧ Share Visualization</button><button className="link-button" onClick={() => void copyVisualizationLink()}>▣ Copy Link</button><button className="tweet-button" onClick={tweetVisualization}>♥ Tweet</button></section>
      <section className="workspace-grid">
        <div className="visual-panel panel"><div className="panel-heading"><div><p className="eyebrow">Live visualization</p><h2>{structures.find(s => s.id === activeDS)?.label}</h2></div><div className="live-dot"><i /> Live</div></div><div className="canvas-area">{renderVisualizer}<AnimatePresence>{notice && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="toast">{notice}</motion.div>}</AnimatePresence></div><div className="step-bar"><span>Step {visibleStep >= 0 ? visibleStep + 1 : events.length ? events.length : 0} <small>/ {events.length}</small></span><div className="step-controls"><button disabled={!events.length} onClick={() => setVisibleStep(-1)}>↺ Reset</button><button disabled={visibleStep <= 0} onClick={() => setVisibleStep(Math.max(0, visibleStep - 1))}>‹ Prev</button><button disabled={visibleStep >= events.length - 1} onClick={() => setVisibleStep(visibleStep < 0 ? 0 : visibleStep + 1)}>Next ›</button></div></div></div>
        <aside className="right-column"><div className="panel tutor-panel"><div className="panel-heading"><div><p className="eyebrow">AI learning assistant</p><h2>DSA Tutor <span className="status-badge">Online</span></h2></div><span className="sparkle">✦</span></div><div className="tutor-message"><div className="bot-avatar">✦</div><p>{chatAnswer}</p></div><div className="chat-input"><input value={chat} onChange={e => setChat(e.target.value)} onKeyDown={e => e.key === 'Enter' && void askTutor()} placeholder="Ask about this visualization…" /><button onClick={() => void askTutor()}>↑</button></div></div><div className="panel complexity-panel"><div className="panel-heading"><h2>Complexity</h2><span className="info">i</span></div><div className="complexity-grid"><div><span>Time</span><strong>{complexity.time}</strong></div><div><span>Space</span><strong>{complexity.space}</strong></div></div><p>Values are verified by the execution engine.</p></div></aside>
      </section>
      <section className="command-panel panel"><div className="command-label"><span className="command-icon">⌁</span><div><p className="eyebrow">{language.toUpperCase()} execution</p><strong>Tell the visualizer what to do</strong></div></div><input value={command} onChange={e => setCommand(e.target.value)} onKeyDown={e => e.key === 'Enter' && void execute()} placeholder="Create a stack and push 10, 20 and 30…" /><button className="voice-button" title="Voice input is optional">⌕</button><button className="execute-button" disabled={loading} onClick={() => void execute()}>{loading ? 'Working…' : 'Run'} <span>↗</span></button></section>
      {generatedCode && <section className="code-panel panel"><div className="panel-heading"><div><p className="eyebrow">Generated program</p><h2>{language.toUpperCase()} source code</h2></div><span className="code-badge">{language}</span></div><pre>{generatedCode}</pre></section>}
      <section className="history-panel panel"><div className="panel-heading"><div><p className="eyebrow">Your activity</p><h2>Operation history</h2></div><button className="text-button" onClick={async () => { await axios.delete(`${API}/api/history`, { params: { session_id: sessionId } }); setHistory([]); }}>Clear all</button></div>{history.length ? <div className="history-list">{history.slice(0, 4).map(item => <div className="history-item" key={item.id}><span className="history-icon">✓</span><div><strong>{item.command}</strong><small>{item.data_structure.replace('_', ' ')} · {(item.language ?? 'python').toUpperCase()} · {new Date(item.created_at).toLocaleTimeString()}</small></div><span className="history-arrow">›</span></div>)}</div> : <div className="empty-history">Your completed commands will appear here.</div>}</section>
    </main>}
  </div>;
}

export default App;
