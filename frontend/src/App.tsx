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
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-[#22D3EE] text-[#050914] font-bold rounded-full shadow-2xl"
          aria-label="Toggle Navigation Sidebar"
        >
          {mobileMenu ? '✕' : '☰'}
        </button>

        {/* Collapsible Sidebar */}
        <aside
          className={`w-72 bg-[#0A1120] border-r border-[#24344A] flex flex-col z-40 transition-transform duration-300 ${
            mobileMenu ? 'translate-x-0 fixed inset-y-0 left-0 top-14 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 border-b border-[#24344A]">
            <div className="text-[10px] font-mono font-bold text-[#22D3EE] uppercase tracking-wider mb-1">DATA STRUCTURES</div>
            <p className="text-xs text-[#64748B]">Click a chapter to expand programs</p>
          </div>

          {/* Chapter Navigation List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {chapters.map((item) => {
              const isChapterActive = chapterId === item.id;
              return (
                <div key={item.id} className="rounded-xl overflow-hidden">
                  <button
                    aria-expanded={isChapterActive}
                    onClick={() => handleChapterSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isChapterActive
                        ? 'bg-[#131D2D] text-[#22D3EE] border border-[#22D3EE]/30 font-bold'
                        : 'text-[#CBD5E1] hover:text-white hover:bg-[#131D2D]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm text-[#22D3EE]">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] text-[#64748B]">{isChapterActive ? '⌄' : '›'}</span>
                  </button>

                  {/* Program Sub-menu */}
                  {isChapterActive && (
                    <div className="pl-6 pr-2 py-1 space-y-1 bg-[#050914]/40 border-l border-[#24344A] ml-4 my-1 rounded-r-lg">
                      {item.programs.map((program) => {
                        const isProgActive = selectedProgram === program.id;
                        return (
                          <button
                            key={program.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChapterSelect(item.id, program.id);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                              isProgActive
                                ? 'bg-[#22D3EE]/15 text-[#22D3EE] font-bold border border-[#22D3EE]/30'
                                : 'text-[#64748B] hover:text-[#CBD5E1] hover:bg-[#131D2D]/40'
                            }`}
                          >
                            <span className="text-[10px]">·</span>
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

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#24344A] bg-[#0d1420]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <span className="text-[#CBD5E1]">Mastery progress</span>
              <span className="text-[#22D3EE] font-mono font-bold">80%</span>
            </div>
            <div className="w-full bg-[#050914] rounded-full h-1.5 overflow-hidden border border-[#24344A]">
              <div className="bg-[#22D3EE] h-1.5 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <div className="flex-1 overflow-y-auto">
          <ProgramEditor
            api={API}
            chapter={chapterId}
            selectedProgram={selectedProgram}
            onProgramChange={(program) => {
              setSelectedProgram(program);
              localStorage.setItem(`aids_program_${chapterId}`, program);
            }}
          />
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
