import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { chapters } from '../programCatalog';
import { ALL_PROGRAMS } from '../data/allPrograms';

interface NavbarProps {
  user: any;
  onLogout?: () => void;
  onOpenCopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenCopilot }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'midnight'>('dark');

  // Filter search results
  const searchResults = searchQuery.trim().length > 0 ? Object.values(ALL_PROGRAMS).filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.chapterId.toLowerCase().includes(q)
    );
  }).slice(0, 6) : [];

  const chapterMatches = searchQuery.trim().length > 0 ? chapters.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  }) : [];

  const handleSelectProgram = (chapterId: string, programId: string) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate(`/playground/${chapterId}?program=${programId}`);
  };

  const navLinks = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Playground', path: '/playground/array' },
    { label: 'Learn', path: '/learn' },
    { label: 'Progress', path: '/progress' },
  ];

  const notifications = [
    { id: 1, title: 'Streak milestone reached!', time: '10m ago', unread: true },
    { id: 2, title: 'New chapter unlocked: Recursion', time: '1h ago', unread: true },
    { id: 3, title: 'AI Copilot updated with Python 3.12 support', time: '1d ago', unread: false },
  ];

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-3 bg-[#0A1120]/90 backdrop-blur-md border-b border-[#24344A]">
      {/* Brand & Main Links */}
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#22D3EE] hover:opacity-90 transition-opacity">
          <span className="text-2xl text-[#22D3EE]">◬</span>
          <span>AI-DS <span className="text-[#F8FAFC]">VISUALIZER PRO</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path) || (link.path === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#131D2D] text-[#22D3EE] border border-[#22D3EE]/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'text-[#CBD5E1] hover:text-white hover:bg-[#131D2D]/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#8B5CF6]/20 to-[#22D3EE]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] transition-all"
          >
            <span>🤖</span>
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden lg:block w-72">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[#64748B] text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search programs, concepts..."
              className="w-full bg-[#131D2D] border border-[#24344A] rounded-lg py-1.5 pl-9 pr-4 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#64748B] hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && (searchQuery.trim().length > 0) && (
            <div
              className="absolute left-0 right-0 top-full mt-2 bg-[#0A1120] border border-[#24344A] rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
              onMouseLeave={() => setShowSearchDropdown(false)}
            >
              {chapterMatches.length > 0 && (
                <div className="p-2 border-b border-[#24344A]">
                  <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase px-2 py-1">Chapters</div>
                  {chapterMatches.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchDropdown(false);
                        navigate(`/playground/${c.id}`);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#131D2D] flex items-center gap-2 text-xs text-[#CBD5E1] hover:text-[#22D3EE]"
                    >
                      <span>{c.icon}</span>
                      <span className="font-semibold">{c.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.length > 0 ? (
                <div className="p-2">
                  <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase px-2 py-1">Programs & Algorithms</div>
                  {searchResults.map((p) => (
                    <button
                      key={`${p.chapterId}-${p.id}`}
                      onClick={() => handleSelectProgram(p.chapterId, p.id)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#131D2D] text-xs transition-colors"
                    >
                      <div className="font-bold text-[#F8FAFC] group-hover:text-[#22D3EE]">{p.name}</div>
                      <div className="text-[11px] text-[#64748B] truncate">{p.description}</div>
                    </button>
                  ))}
                </div>
              ) : chapterMatches.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#64748B]">No matching programs or concepts found</div>
              ) : null}
            </div>
          )}
        </div>

        {/* Theme Indicator */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'midnight' : 'dark')}
          className="p-2 text-[#CBD5E1] hover:text-white rounded-lg hover:bg-[#131D2D] transition-colors text-sm"
          title={`Theme: ${theme}`}
        >
          {theme === 'dark' ? '🌙' : '✨'}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#CBD5E1] hover:text-white rounded-lg hover:bg-[#131D2D] transition-colors text-sm"
            title="Notifications"
          >
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#22D3EE]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0A1120] border border-[#24344A] rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#24344A]">
                <span className="font-bold text-sm">Notifications</span>
                <span className="text-xs text-[#22D3EE] cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-3 mt-3">
                {notifications.map((n) => (
                  <div key={n.id} className="flex flex-col gap-0.5 text-xs p-2 rounded-lg bg-[#131D2D]/60 hover:bg-[#131D2D]">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-[#F8FAFC]">{n.title}</span>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />}
                    </div>
                    <span className="text-[10px] text-[#64748B]">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#131D2D] border border-[#24344A] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] text-[#050914] font-extrabold flex items-center justify-center text-xs">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0A1120] border border-[#24344A] rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="p-3 border-b border-[#24344A]">
                <div className="font-bold text-sm text-[#F8FAFC]">{user?.name || 'Student'}</div>
                <div className="text-[11px] text-[#64748B] truncate">{user?.email || 'student@example.com'}</div>
              </div>
              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#131D2D] text-[#CBD5E1] hover:text-white flex items-center gap-2"
                >
                  <span>👤</span> Profile & Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/progress');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#131D2D] text-[#CBD5E1] hover:text-white flex items-center gap-2"
                >
                  <span>📊</span> My Progress
                </button>
              </div>
              <div className="pt-2 border-t border-[#24344A]">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout?.();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/40 text-red-400 font-semibold flex items-center gap-2"
                >
                  <span>🚪</span> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
