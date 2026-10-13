import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Code2,
  BookOpen,
  BarChart3,
  Sparkles,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Lock body scroll when mobile nav drawer is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileNavOpen(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
        setShowSearchDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter search results
  const searchResults =
    searchQuery.trim().length > 0
      ? Object.values(ALL_PROGRAMS)
          .filter((p) => {
            const q = searchQuery.toLowerCase();
            return (
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.chapterId.toLowerCase().includes(q)
            );
          })
          .slice(0, 6)
      : [];

  const chapterMatches =
    searchQuery.trim().length > 0
      ? chapters.filter((c) => {
          const q = searchQuery.toLowerCase();
          return c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
        })
      : [];

  const handleSelectProgram = (chapterId: string, programId: string) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    setMobileNavOpen(false);
    navigate(`/playground/${chapterId}?program=${programId}`);
  };

  const navLinks = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Playground', path: '/playground/array', icon: Code2, matchPrefix: '/playground' },
    { label: 'Learn', path: '/learn', icon: BookOpen },
    { label: 'Progress', path: '/progress', icon: BarChart3 },
  ];

  const notifications = [
    { id: 1, title: 'Streak milestone reached! 5 Days 🔥', time: '10m ago', unread: true },
    { id: 2, title: 'New chapter unlocked: Recursion', time: '1h ago', unread: true },
    { id: 3, title: 'AI Copilot updated with enhanced visualization logic', time: '1d ago', unread: false },
  ];

  const userName = user?.name || 'Sairaj';

  return (
    <>
      <nav className="sticky top-0 z-50 h-16 bg-[#050914]/95 backdrop-blur-xl border-b border-[#24344A] px-4 md:px-6 flex items-center justify-between select-none">
        {/* Brand & Left Links */}
        <div className="flex items-center gap-4 md:gap-7">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2 rounded-xl text-[#CBD5E1] hover:text-white hover:bg-[#131D2D] border border-[#24344A] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open Mobile Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#22D3EE]" />
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 md:gap-2.5 text-base md:text-lg font-black tracking-tight text-white hover:opacity-95 transition-opacity group"
          >
            {/* Logo Prism Glyph */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#22D3EE] via-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.4)] shrink-0">
              <span className="text-white font-black text-sm tracking-tighter">A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold tracking-tight">AI-DS</span>
              <span className="text-[#22D3EE] font-extrabold tracking-wider text-xs md:text-sm">VISUALIZER PRO</span>
            </div>
          </Link>

          {/* Center Nav items (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = link.matchPrefix
                ? location.pathname.startsWith(link.matchPrefix)
                : location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
              const IconComponent = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-[#101827] text-[#22D3EE] border border-[#22D3EE]/50 shadow-[0_0_14px_rgba(34,211,238,0.25)] font-bold'
                      : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#131D2D]/60'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : 'text-[#64748B]'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#CBD5E1] hover:text-white hover:bg-[#131D2D]/60 transition-all min-h-[40px]"
            >
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span>AI Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
            </button>
          </div>
        </div>

        {/* Right Search, Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Global Search Bar (Desktop) */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search programs, concepts..."
                className="w-full bg-[#0A1120] border border-[#24344A] rounded-xl py-2 pl-8 pr-12 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 transition-all"
              />
              <span className="absolute right-2 px-1.5 py-0.5 rounded border border-[#24344A] bg-[#101827] text-[10px] font-mono text-[#64748B] pointer-events-none">
                Ctrl K
              </span>
            </div>

            {/* Desktop Search Dropdown */}
            {showSearchDropdown && searchQuery.trim().length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-2 bg-[#0A1120] border border-[#24344A] rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
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
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#131D2D] flex items-center gap-2 text-xs text-[#CBD5E1] hover:text-[#22D3EE] transition-colors min-h-[40px]"
                      >
                        <span>{c.icon}</span>
                        <span className="font-semibold">{c.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase px-2 py-1">
                      Programs & Algorithms
                    </div>
                    {searchResults.map((p) => (
                      <button
                        key={`${p.chapterId}-${p.id}`}
                        onClick={() => handleSelectProgram(p.chapterId, p.id)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#131D2D] text-xs transition-colors"
                      >
                        <div className="font-bold text-[#F8FAFC] hover:text-[#22D3EE]">{p.name}</div>
                        <div className="text-[11px] text-[#64748B] truncate">{p.description}</div>
                      </button>
                    ))}
                  </div>
                ) : chapterMatches.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#64748B]">No matching programs found</div>
                ) : null}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 text-[#CBD5E1] hover:text-white rounded-xl hover:bg-[#131D2D] border border-[#24344A] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? <Moon className="w-4 h-4 text-[#38BDF8]" /> : <Sun className="w-4 h-4 text-[#F59E0B]" />}
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 text-[#CBD5E1] hover:text-white rounded-xl hover:bg-[#131D2D] border border-[#24344A] transition-colors relative min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#CBD5E1]" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#0A1120] border border-[#24344A] rounded-2xl shadow-2xl p-4 z-50 max-w-[calc(100vw-32px)]">
                <div className="flex items-center justify-between pb-3 border-b border-[#24344A]">
                  <span className="font-bold text-xs text-[#F8FAFC]">Notifications</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-[#22D3EE] hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-[#131D2D]/60 hover:bg-[#131D2D] transition-colors">
                      <div className="flex items-start justify-between text-xs font-semibold text-[#F8FAFC]">
                        <span>{n.title}</span>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shrink-0 mt-1" />}
                      </div>
                      <span className="text-[10px] text-[#64748B] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-[#0A1120] border border-[#24344A] hover:border-[#38BDF8]/40 transition-colors min-h-[40px]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#38BDF8] to-[#6366F1] text-white font-extrabold flex items-center justify-center text-xs shadow-sm shrink-0">
                {userName[0]?.toUpperCase() || 'S'}
              </div>
              <span className="text-xs font-bold text-[#F8FAFC] hidden sm:inline truncate max-w-[90px]">{userName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#0A1120] border border-[#24344A] rounded-2xl shadow-2xl p-2 z-50 text-xs">
                <div className="p-3 border-b border-[#24344A]">
                  <div className="font-bold text-xs text-[#F8FAFC]">{userName}</div>
                  <div className="text-[10px] text-[#64748B] truncate">{user?.email || 'sairaj@example.com'}</div>
                </div>
                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#131D2D] text-[#CBD5E1] hover:text-white flex items-center gap-2 transition-colors font-medium min-h-[40px]"
                  >
                    <UserIcon className="w-4 h-4 text-[#38BDF8]" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/progress');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#131D2D] text-[#CBD5E1] hover:text-white flex items-center gap-2 transition-colors font-medium min-h-[40px]"
                  >
                    <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
                    <span>My Progress</span>
                  </button>
                </div>
                <div className="pt-2 border-t border-[#24344A]">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-950/40 text-red-400 font-semibold flex items-center gap-2 transition-colors min-h-[40px]"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dark Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-[#050914]/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-[#070D18] border-r border-[#24344A] flex flex-col h-full shadow-2xl z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#24344A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#22D3EE] via-[#6366F1] to-[#8B5CF6] flex items-center justify-center font-black text-xs text-white">
                  A
                </div>
                <span className="font-extrabold text-sm text-white">AI-DS VISUALIZER PRO</span>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-xl bg-[#101827] border border-[#24344A] text-[#CBD5E1] hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close Mobile Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Input */}
            <div className="p-4 border-b border-[#24344A]">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programs..."
                  className="w-full bg-[#0A1120] border border-[#24344A] rounded-xl py-2.5 pl-9 pr-4 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              {/* Mobile Search Matches */}
              {searchQuery.trim().length > 0 && searchResults.length > 0 && (
                <div className="mt-2 bg-[#0A1120] border border-[#24344A] rounded-xl p-2 space-y-1">
                  {searchResults.map((p) => (
                    <button
                      key={`mob-${p.chapterId}-${p.id}`}
                      onClick={() => handleSelectProgram(p.chapterId, p.id)}
                      className="w-full text-left p-2 rounded-lg hover:bg-[#131D2D] text-xs text-[#CBD5E1] block"
                    >
                      <div className="font-bold text-[#F8FAFC]">{p.name}</div>
                      <div className="text-[10px] text-[#64748B] truncate">{p.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Page Navigation Links */}
            <div className="p-4 space-y-2 flex-1">
              <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase px-2 mb-2">Main Menu</div>
              {navLinks.map((link) => {
                const isActive = link.matchPrefix
                  ? location.pathname.startsWith(link.matchPrefix)
                  : location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
                const IconComponent = link.icon;

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-[#101827] text-[#22D3EE] border border-[#22D3EE]/50 shadow-md'
                        : 'text-[#CBD5E1] hover:bg-[#131D2D]'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : 'text-[#64748B]'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onOpenCopilot?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20 transition-all min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                <span>AI Student Copilot</span>
              </button>
            </div>

            {/* Drawer Bottom Profile Info */}
            <div className="p-4 border-t border-[#24344A] bg-[#0A1120]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#38BDF8] to-[#6366F1] text-white font-extrabold flex items-center justify-center text-xs">
                  {userName[0]?.toUpperCase() || 'S'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-white truncate">{userName}</div>
                  <div className="text-[10px] text-[#64748B] truncate">{user?.email || 'sairaj@example.com'}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  onLogout?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-900/50 transition-colors min-h-[40px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
