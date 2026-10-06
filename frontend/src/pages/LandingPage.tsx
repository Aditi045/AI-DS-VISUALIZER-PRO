import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('sairaj@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState<'student' | 'educator' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const userObj = {
        id: Date.now(),
        name: email.split('@')[0] || 'Sairaj Agawane',
        email,
        role,
      };
      onLogin(userObj);
      navigate('/dashboard');
      setIsLoading(false);
    }, 400);
  };

  const featureCards = [
    { title: 'Interactive Visualizations', desc: 'See algorithms come to life', icon: '▶', color: 'from-cyan-500/20 border-cyan-500/30 text-cyan-400' },
    { title: 'Real Code Execution', desc: 'Run, step, debug, and visualize', icon: '>_', color: 'from-emerald-500/20 border-emerald-500/30 text-emerald-400' },
    { title: 'Multiple Languages', desc: 'C, C++, Java, Python', icon: '</>', color: 'from-purple-500/20 border-purple-500/30 text-purple-400' },
    { title: 'Track Your Progress', desc: 'Learn with structured paths', icon: '📊', color: 'from-amber-500/20 border-amber-500/30 text-amber-400' },
    { title: 'AI Student Copilot', desc: 'Get instant help and explanations', icon: '🤖', color: 'from-cyan-500/20 border-cyan-500/30 text-cyan-400' },
    { title: 'Practice & Improve', desc: 'Solve, visualize, and master', icon: '🎯', color: 'from-pink-500/20 border-pink-500/30 text-pink-400' },
  ];

  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#22D3EE] opacity-15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-[#8B5CF6] opacity-15 blur-[140px] rounded-full pointer-events-none" />

      {/* TOP LANDING NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] text-[#050914] font-black text-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            ◬
          </div>
          <div className="font-extrabold text-lg tracking-tight">
            AI-DS <span className="text-[#22D3EE]">VISUALIZER PRO</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#CBD5E1]">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><span>🏠</span> Home</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <div className="flex items-center gap-1 p-1 bg-[#101827] border border-[#24344A] rounded-full text-sm">
            <button className="p-1 text-[#CBD5E1]">☀️</button>
            <button className="p-1 text-[#22D3EE] bg-[#151F2E] rounded-full">🌙</button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT SECTION */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-12 flex-1">
        {/* LEFT HERO COLUMN */}
        <div className="w-full md:w-3/5 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101827] border border-[#22D3EE]/30 text-xs font-mono text-[#CBD5E1] w-fit mb-6 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span>Learn</span> · <span>Visualize</span> · <span>Practice</span> · <span>Grow</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Master Data Structures<br />
            and Algorithms<br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#8B5CF6]">AI-Powered Learning</span>
          </h1>

          <p className="text-sm md:text-base text-[#CBD5E1] max-w-xl mb-10 leading-relaxed">
            Interactive visualizations, real code execution, AI guidance, and structured learning — everything you need to truly understand DSA.
          </p>

          {/* 6 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mb-10">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0A1120]/80 border border-[#24344A] hover:border-[#22D3EE]/40 backdrop-blur-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center font-mono font-bold text-sm shrink-0`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PREMIUM LOGIN CARD (Matches Reference Image 2) */}
        <div className="w-full md:w-[440px] relative">
          <div className="bg-[#0A1120]/85 border border-[#22D3EE]/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)] backdrop-blur-2xl relative overflow-hidden">
            {/* Logo inside card */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] text-[#050914] font-black text-2xl mx-auto mb-3 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                ◬
              </div>
              <h2 className="text-2xl font-bold text-[#F8FAFC]">
                Welcome <span className="text-[#38BDF8]">Back</span>
              </h2>
              <p className="text-xs text-[#CBD5E1] mt-1">Log in to continue your DSA learning journey</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role selector tabs */}
              <div className="flex bg-[#050914] p-1 rounded-xl border border-[#24344A]">
                {(['student', 'educator', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize flex items-center justify-center gap-1.5 transition-all ${
                      role === r
                        ? 'bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                        : 'text-[#64748B] hover:text-[#CBD5E1]'
                    }`}
                  >
                    <span>{r === 'student' ? '🎓' : r === 'educator' ? '👥' : '🛡'}</span>
                    <span>{r}</span>
                  </button>
                ))}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1 font-medium">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#64748B] text-xs">✉</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#050914] border border-[#24344A] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1 font-medium">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#64748B] text-xs">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#050914] border border-[#24344A] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#64748B] hover:text-white text-xs"
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#CBD5E1]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#24344A] bg-[#050914] text-[#22D3EE] focus:ring-[#22D3EE]"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent.'); }} className="text-[#38BDF8] hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#8B5CF6] text-white font-bold text-xs rounded-xl mt-2 shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <span>Logging in...</span> : <><span>Log In</span> <span>→</span></>}
              </button>
            </form>

            {/* Social options */}
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-4">
                <hr className="w-full border-[#24344A]" />
                <span className="absolute bg-[#0A1120] px-3 text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                  OR CONTINUE WITH
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                  className="flex items-center justify-center gap-2 py-2 bg-[#050914] border border-[#24344A] rounded-xl text-xs font-semibold hover:border-[#22D3EE]/40 transition-colors"
                >
                  <span className="text-red-400 font-bold">G</span> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                  className="flex items-center justify-center gap-2 py-2 bg-[#050914] border border-[#24344A] rounded-xl text-xs font-semibold hover:border-[#22D3EE]/40 transition-colors"
                >
                  <span>🐙</span> GitHub
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                  className="flex items-center justify-center gap-2 py-2 bg-[#050914] border border-[#24344A] rounded-xl text-xs font-semibold hover:border-[#22D3EE]/40 transition-colors"
                >
                  <span className="text-blue-400 font-bold">❖</span> Microsoft
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-[#CBD5E1] mt-6">
              Don't have an account?{' '}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleLogin({ preventDefault: () => {} } as any); }}
                className="text-[#38BDF8] font-bold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER BADGES (Matches Reference Image 2) */}
      <footer className="relative z-20 border-t border-[#24344A]/60 py-4 px-6 bg-[#0A1120]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-6 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="text-[#22C55E]">🛡</span>
            <span><strong>Secure & Private</strong> · Your data is safe</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#22D3EE]">⚡</span>
            <span><strong>Access Anywhere</strong> · On any device</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8B5CF6]">💖</span>
            <span><strong>Join Community</strong> · Learn together</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
