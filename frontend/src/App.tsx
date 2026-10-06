import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProgramEditor from './ProgramEditor';
import { chapters, type ChapterId, chapterById } from './programCatalog';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
type User = { id: number; name: string; email: string };

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('aids_user');
    return stored ? JSON.parse(stored) as User : null;
  });

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('aids_user', JSON.stringify(newUser));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!user ? <LandingPage onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" replace />} />
        <Route path="/playground" element={user ? <PlaygroundWrapper user={user} /> : <Navigate to="/" replace />} />
        <Route path="/playground/:chapterId" element={user ? <PlaygroundWrapper user={user} /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function PlaygroundWrapper({ user }: { user: User }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  
  const pathChapter = location.pathname.split('/')[2] as ChapterId | undefined;
  const isValidChapter = pathChapter && chapters.some(c => c.id === pathChapter);
  const chapterId = isValidChapter ? pathChapter : 'array';
  
  useEffect(() => {
    if (location.pathname === '/playground' || (!isValidChapter && pathChapter)) {
      navigate('/playground/array', { replace: true });
    }
  }, [isValidChapter, pathChapter, location.pathname, navigate]);

  const [selectedProgram, setSelectedProgram] = useState(() => {
    return localStorage.getItem(`aids_program_${chapterId}`) || chapterById(chapterId).programs[0]?.id || 'create';
  });

  useEffect(() => {
    const chapterPrograms = chapterById(chapterId).programs;
    if (!chapterPrograms.some(p => p.id === selectedProgram)) {
      setSelectedProgram(chapterPrograms[0]?.id || 'create');
    }
  }, [chapterId, selectedProgram]);

  const handleChapterSelect = (id: ChapterId, programId?: string) => {
    navigate(`/playground/${id}`);
    if (programId) setSelectedProgram(programId);
    setMobileMenu(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-logo">◬</span>
          <div>
            <strong>AI-DS</strong>
            <small>VISUALIZER PRO</small>
          </div>
        </div>
        <p className="eyebrow">Data structures</p>
        <div className="structure-list">
          {chapters.map(item => (
            <div className="chapter-nav" key={item.id}>
              <button 
                aria-expanded={chapterId === item.id} 
                aria-current={chapterId === item.id ? 'page' : undefined} 
                className={chapterId === item.id ? 'nav-item active' : 'nav-item'} 
                onClick={() => handleChapterSelect(item.id)}
              >
                <span>{item.icon}</span>{item.label}<i>{chapterId === item.id ? '⌄' : '›'}</i>
              </button>
              {chapterId === item.id && (
                <div className="chapter-programs">
                  {item.programs.map(program => (
                    <button 
                      key={program.id}
                      aria-current={selectedProgram === program.id ? 'true' : undefined} 
                      className={selectedProgram === program.id ? 'chapter-program active' : 'chapter-program'} 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleChapterSelect(item.id, program.id); 
                      }}
                    >
                      <span>·</span>{program.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="eyebrow algorithm-label">Algorithms</p>
        <div className="algorithm-chips">
          <span>BFS</span><span>DFS</span><span>Dijkstra</span><span>Sorting</span><span>Searching</span>
        </div>
        <div className="sidebar-footer">
          <div className="xp-line"><span>Learning progress</span><b>80%</b></div>
          <div className="progress"><i style={{ width: '80%' }} /></div>
          <small>Keep exploring to unlock badges</small>
        </div>
      </aside>

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
  );
}

export default App;
