import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import ProgramEditor from './ProgramEditor';
import Navbar from './components/Navbar';
import AICopilotModal from './components/AICopilotModal';
import { chapters, type ChapterId, chapterById } from './programCatalog';
import { X, Menu } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

type User = { id: number; name: string; email: string; role?: string };

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('aids_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('aids_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aids_user');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!user ? <LandingPage onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/learn"
          element={user ? <Learn user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/progress"
          element={user ? <Progress user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/playground"
          element={user ? <PlaygroundWrapper user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/playground/:chapterId"
          element={user ? <PlaygroundWrapper user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function PlaygroundWrapper({ user, onLogout }: { user: User; onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenu]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Parse chapterId from path
  const pathChapter = location.pathname.split('/')[2] as ChapterId | undefined;
  const isValidChapter = pathChapter && chapters.some((c) => c.id === pathChapter);
  const chapterId = isValidChapter ? pathChapter : 'array';

  // Parse programId query parameter if present, otherwise read stored state
  const queryParams = new URLSearchParams(location.search);
  const queryProgram = queryParams.get('program');

  useEffect(() => {
    if (location.pathname === '/playground' || (!isValidChapter && pathChapter)) {
      navigate('/playground/array', { replace: true });
    }
  }, [isValidChapter, pathChapter, location.pathname, navigate]);

  const [selectedProgram, setSelectedProgram] = useState(() => {
    if (queryProgram) return queryProgram;
    return localStorage.getItem(`aids_program_${chapterId}`) || chapterById(chapterId).programs[0]?.id || 'create';
  });

  useEffect(() => {
    if (queryProgram) {
      setSelectedProgram(queryProgram);
    } else {
      const chapterPrograms = chapterById(chapterId).programs;
      if (!chapterPrograms.some((p) => p.id === selectedProgram)) {
        setSelectedProgram(chapterPrograms[0]?.id || 'create');
      }
    }
  }, [chapterId, queryProgram, selectedProgram]);

  const handleChapterSelect = (id: ChapterId, programId?: string) => {
    const targetProgram = programId || chapterById(id).programs[0]?.id || 'create';
    setSelectedProgram(targetProgram);
    localStorage.setItem(`aids_program_${id}`, targetProgram);
    navigate(`/playground/${id}?program=${targetProgram}`);
    setMobileMenu(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050914] text-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar user={user} onLogout={onLogout} onOpenCopilot={() => setIsCopilotOpen(true)} />

      {/* Main Workspace with Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Floating Drawer Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden fixed bottom-5 left-4 z-40 p-3 bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] font-bold rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)] min-h-[44px] min-w-[44px] flex items-center justify-center transition-transform active:scale-95"
          aria-label="Toggle Navigation Sidebar"
        >
          {mobileMenu ? <X className="w-5 h-5 text-[#050914]" /> : <Menu className="w-5 h-5 text-[#050914]" />}
        </button>

        {/* Mobile Drawer Backdrop Overlay */}
        {mobileMenu && (
          <div
            className="fixed inset-0 bg-[#050914]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setMobileMenu(false)}
            aria-hidden="true"
          />
        )}

        {/* Collapsible Sidebar Drawer */}
        <aside
          className={`w-72 sm:w-64 bg-[#070D18] border-r border-[#24344A] flex flex-col z-50 transition-transform duration-300 ${
            mobileMenu
              ? 'fixed inset-y-0 left-0 top-0 bottom-0 shadow-2xl translate-x-0'
              : '-translate-x-full lg:translate-x-0 lg:static lg:z-auto'
          }`}
        >
          {/* Sidebar Top Header */}
          <div className="px-4 pt-4 pb-2 border-b border-[#24344A]/60 flex items-center justify-between">
            <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
              DATA STRUCTURES
            </div>
            {mobileMenu && (
              <button
                onClick={() => setMobileMenu(false)}
                className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#101827]"
                aria-label="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="px-4 pt-3 pb-1">
            {/* Program Editor Action Badge */}
            <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#0A1120] border border-[#22D3EE]/40 text-[#22D3EE] text-xs font-bold mb-2 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              <div className="flex items-center gap-2">
                <span className="text-sm">⊞</span>
                <span>Program Editor</span>
              </div>
              <span className="text-xs text-[#22D3EE]">›</span>
            </div>
          </div>

          {/* Chapter Navigation List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {chapters.map((item) => {
              const isChapterActive = chapterId === item.id;
              return (
                <div key={item.id} className="rounded-xl overflow-hidden">
                  <button
                    aria-expanded={isChapterActive}
                    onClick={() => handleChapterSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
                      isChapterActive
                        ? 'bg-[#101827] text-[#22D3EE] border border-[#22D3EE]/30 font-bold shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                        : 'text-[#CBD5E1] hover:text-white hover:bg-[#131D2D]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm text-[#22D3EE]">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[11px] text-[#64748B]">
                      {isChapterActive ? '⌄' : '›'}
                    </span>
                  </button>

                  {/* Program Sub-menu */}
                  {isChapterActive && (
                    <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-[#24344A]/60 ml-4 my-1">
                      {item.programs.map((program) => {
                        const isProgActive = selectedProgram === program.id;
                        return (
                          <button
                            key={program.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChapterSelect(item.id, program.id);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 min-h-[36px] ${
                              isProgActive
                                ? 'bg-[#22D3EE]/15 text-[#22D3EE] font-bold border border-[#22D3EE]/40 shadow-sm'
                                : 'text-[#64748B] hover:text-[#CBD5E1] hover:bg-[#131D2D]/40'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isProgActive ? 'bg-[#22D3EE]' : 'bg-[#64748B]'}`} />
                            <span className="truncate">{program.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Workspace Area */}
        <div className="flex-1 overflow-y-auto bg-[#050914] relative">
          <ProgramEditor
            api={API}
            chapter={chapterId}
            selectedProgram={selectedProgram}
            onProgramChange={(program) => {
              setSelectedProgram(program);
              localStorage.setItem(`aids_program_${chapterId}`, program);
            }}
          />

          {/* Floating AI Copilot Mascot Widget */}
          <div className="fixed bottom-5 right-4 sm:right-6 z-30 flex items-center gap-3">
            <div
              onClick={() => setIsCopilotOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-[#0A1120]/90 border border-[#8B5CF6]/40 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.25)] text-left cursor-pointer hover:border-[#8B5CF6] transition-all hover:scale-[1.02]"
            >
              <div className="text-[11px]">
                <div className="font-bold text-[#F8FAFC] flex items-center gap-1">
                  <span className="text-[#8B5CF6]">✨</span> AI Copilot
                </div>
                <div className="text-[10px] text-[#64748B]">
                  Ask for explanations, hints, debugging help, and more!
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#22D3EE] via-[#6366F1] to-[#8B5CF6] p-[2px] shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 transition-all group shrink-0"
              title="Open AI Copilot"
              aria-label="Open AI Copilot"
            >
              <div className="w-full h-full rounded-full bg-[#070D18] flex items-center justify-center overflow-hidden">
                <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">🤖</span>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#22D3EE] border-2 border-[#050914] animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        context={{
          chapterId,
          programName: selectedProgram,
        }}
      />
    </div>
  );
}

export default App;
