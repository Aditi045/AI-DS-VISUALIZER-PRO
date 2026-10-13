import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Terminal,
  Code2,
  BarChart3,
  Bot,
  Target,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Heart,
  ArrowRight,
  Sun,
  Moon,
  GraduationCap,
  Users,
  Shield,
} from 'lucide-react';

export default function LandingPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('sairaj@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState<'student' | 'educator' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
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
    {
      title: 'Interactive Visualizations',
      desc: 'See algorithms come to life',
      icon: Play,
      gradient: 'from-[#22D3EE]/25 to-[#38BDF8]/20',
      border: 'border-[#22D3EE]/40',
      iconColor: 'text-[#22D3EE]',
      glow: 'shadow-[0_0_15px_rgba(34,211,238,0.25)]',
    },
    {
      title: 'Real Code Execution',
      desc: 'Run, step, debug, and visualize',
      icon: Terminal,
      gradient: 'from-[#22C55E]/25 to-[#10B981]/20',
      border: 'border-[#22C55E]/40',
      iconColor: 'text-[#22C55E]',
      glow: 'shadow-[0_0_15px_rgba(34,197,94,0.25)]',
    },
    {
      title: 'Multiple Languages',
      desc: 'C, C++, Java, Python',
      icon: Code2,
      gradient: 'from-[#8B5CF6]/25 to-[#6366F1]/20',
      border: 'border-[#8B5CF6]/40',
      iconColor: 'text-[#8B5CF6]',
      glow: 'shadow-[0_0_15px_rgba(139,92,246,0.25)]',
    },
    {
      title: 'Track Your Progress',
      desc: 'Learn with structured paths',
      icon: BarChart3,
      gradient: 'from-[#F59E0B]/25 to-[#D97706]/20',
      border: 'border-[#F59E0B]/40',
      iconColor: 'text-[#F59E0B]',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    },
    {
      title: 'AI Student Copilot',
      desc: 'Get instant help and explanations',
      icon: Bot,
      gradient: 'from-[#22D3EE]/25 to-[#8B5CF6]/20',
      border: 'border-[#22D3EE]/40',
      iconColor: 'text-[#22D3EE]',
      glow: 'shadow-[0_0_15px_rgba(34,211,238,0.25)]',
    },
    {
      title: 'Practice & Improve',
      desc: 'Solve, visualize, and master',
      icon: Target,
      gradient: 'from-[#EC4899]/25 to-[#D946EF]/20',
      border: 'border-[#EC4899]/40',
      iconColor: 'text-[#EC4899]',
      glow: 'shadow-[0_0_15px_rgba(236,72,153,0.25)]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background radial glowing gradients matching design tokens */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#22D3EE] opacity-[0.12] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8B5CF6] opacity-[0.12] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[35%] h-[35%] bg-[#38BDF8] opacity-[0.05] blur-[130px] rounded-full pointer-events-none" />

      {/* TOP LANDING NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl w-full mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#22D3EE] via-[#6366F1] to-[#8B5CF6] text-white font-black text-sm flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.45)]">
            <span>A</span>
          </div>
          <div className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
            <span className="text-[#F8FAFC]">AI-DS</span>
            <span className="text-[#22D3EE] text-sm tracking-wider">VISUALIZER PRO</span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#CBD5E1]">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5 text-white">
            <span>🏠</span> Home
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>

          {/* Theme Switch Pill */}
          <div className="flex items-center gap-1 p-1 bg-[#101827] border border-[#24344A] rounded-full text-xs">
            <button
              onClick={() => setIsDark(false)}
              className={`p-1 rounded-full transition-colors ${!isDark ? 'bg-[#151F2E] text-[#F59E0B]' : 'text-[#64748B]'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDark(true)}
              className={`p-1 rounded-full transition-colors ${isDark ? 'bg-[#151F2E] text-[#22D3EE]' : 'text-[#64748B]'}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT SECTION */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 lg:px-12 py-6 flex flex-col lg:flex-row items-center justify-between gap-12 flex-1">
        {/* LEFT HERO COLUMN */}
        <div className="w-full lg:w-[54%] flex flex-col justify-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101827]/80 border border-[#22D3EE]/40 text-xs font-mono text-[#CBD5E1] w-fit mb-5 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="text-[#22D3EE]">Learn</span>
            <span className="text-[#64748B]">•</span>
            <span className="text-[#38BDF8]">Visualize</span>
            <span className="text-[#64748B]">•</span>
            <span className="text-[#8B5CF6]">Practice</span>
            <span className="text-[#64748B]">•</span>
            <span className="text-[#22C55E]">Grow</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black leading-[1.12] mb-5 tracking-tight text-[#F8FAFC]">
            Master Data Structures<br />
            and Algorithms<br />
            with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#8B5CF6]">
              AI-Powered Learning
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-xl mb-8 leading-relaxed">
            Interactive visualizations, real code execution, AI guidance, and structured learning — everything you need
            to truly understand DSA.
          </p>

          {/* 6 Feature Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mb-8">
            {featureCards.map((card) => {
              const IconComp = card.icon;
              return (
                <div
                  key={card.title}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#0A1120]/80 border border-[#24344A] hover:border-[#22D3EE]/40 backdrop-blur-md transition-all group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} border ${card.border} flex items-center justify-center shrink-0 ${card.glow}`}
                  >
                    <IconComp className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-[#64748B]">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Device Preview below feature cards matching Reference 1 */}
          <div className="relative max-w-xl rounded-2xl bg-[#0A1120]/90 border border-[#24344A] p-4 shadow-2xl backdrop-blur-xl overflow-hidden group">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22D3EE]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-[#24344A] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                <span className="font-mono text-[11px] text-[#CBD5E1] font-bold ml-2">Array Visualizer Demo</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-[10px] font-mono font-bold">
                Live Trace
              </span>
            </div>

            {/* Simulated mini dashboard preview */}
            <div className="pt-3 flex flex-col gap-2.5">
              {/* Mini Array Blocks */}
              <div className="flex items-center justify-center gap-2 py-2 bg-[#050914] rounded-xl border border-[#24344A]/60 font-mono text-xs">
                {[10, 20, 30, 40, 50].map((v, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-lg border text-center font-bold transition-all ${
                      i === 2
                        ? 'border-[#22D3EE] bg-[#101827] text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                        : 'border-[#24344A] bg-[#0A1120] text-[#CBD5E1]'
                    }`}
                  >
                    <div>{v}</div>
                    <div className="text-[9px] text-[#64748B]">[{i}]</div>
                  </div>
                ))}
              </div>

              {/* Floating tech badges & cute robot indicator */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-1">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-[#101827] border border-[#24344A] text-[#38BDF8]">
                    🐍 Python
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#101827] border border-[#24344A] text-[#6366F1]">
                    ⚡ C++
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#101827] border border-[#24344A] text-[#F59E0B]">
                    ☕ Java
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[#22D3EE] font-bold">
                  <span className="text-base">🤖</span>
                  <span>AI Copilot Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PREMIUM LOGIN CARD (Matches Reference 1) */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="bg-[#101827]/85 border border-[#22D3EE]/35 rounded-[24px] p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)] backdrop-blur-2xl relative overflow-hidden">
            {/* Top Logo inside card */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22D3EE] via-[#6366F1] to-[#8B5CF6] text-white font-black text-xl mx-auto mb-3 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.45)]">
                <span>A</span>
              </div>
              <div className="font-mono text-[10px] tracking-widest text-[#22D3EE] font-bold mb-1 uppercase">
                AI-DS VISUALIZER PRO
              </div>
              <h2 className="text-2xl font-extrabold text-[#F8FAFC]">
                Welcome <span className="text-[#38BDF8]">Back</span>
              </h2>
              <p className="text-xs text-[#CBD5E1] mt-1">Log in to continue your DSA learning journey</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role selector segmented tabs */}
              <div className="flex bg-[#0A1120] p-1 rounded-xl border border-[#24344A]">
                {(
                  [
                    { id: 'student', label: 'Student', icon: GraduationCap },
                    { id: 'educator', label: 'Educator', icon: Users },
                    { id: 'admin', label: 'Admin', icon: Shield },
                  ] as const
                ).map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        role === r.id
                          ? 'bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#6366F1] text-[#050914] shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                          : 'text-[#64748B] hover:text-[#CBD5E1]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1.5 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sairaj@example.com"
                    className="w-full h-[52px] bg-[#0A1120] border border-[#24344A] rounded-xl pl-10 pr-4 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1.5 font-medium">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-[52px] bg-[#0A1120] border border-[#24344A] rounded-xl pl-10 pr-10 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#64748B] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#CBD5E1]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#24344A] bg-[#0A1120] text-[#22D3EE] focus:ring-[#22D3EE]"
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to your email.');
                  }}
                  className="text-[#38BDF8] hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button with Cyan -> Indigo -> Purple gradient */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] bg-gradient-to-r from-[#22D3EE] via-[#6366F1] to-[#8B5CF6] hover:opacity-95 active:scale-[0.99] text-white font-extrabold text-xs rounded-xl shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Login Section */}
            <div className="mt-6">
              <div className="relative flex items-center justify-center mb-4">
                <hr className="w-full border-[#24344A]" />
                <span className="absolute bg-[#101827] px-3 text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                  OR CONTINUE WITH
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#0A1120] border border-[#24344A] rounded-xl text-xs font-semibold hover:border-[#22D3EE]/40 transition-colors"
                >
                  <span className="text-red-400 font-bold">G</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#0A1120] border border-[#24344A] rounded-xl text-xs font-semibold hover:border-[#22D3EE]/40 transition-colors"
                >
                  <span>🐙</span>
                  <span>GitHub</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#0A1120] border border-[#24344A] rounded-xl text-xs font-semibold hover:border-[#22D3EE]/40 transition-colors"
                >
                  <span className="text-blue-400 font-bold">❖</span>
                  <span>Microsoft</span>
                </button>
              </div>
            </div>

            {/* Sign Up footer link */}
            <p className="text-center text-xs text-[#CBD5E1] mt-6">
              Don't have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin({ preventDefault: () => {} } as any);
                }}
                className="text-[#38BDF8] font-bold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER TRUST SECTION (Matches Reference 1) */}
      <footer className="relative z-20 border-t border-[#24344A]/60 py-4 px-6 lg:px-12 bg-[#0A1120]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-6 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>
              <strong className="text-[#CBD5E1]">Secure & Private</strong> · Your data is safe
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#22D3EE]" />
            <span>
              <strong className="text-[#CBD5E1]">Access Anywhere</strong> · On any device
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#8B5CF6]" />
            <span>
              <strong className="text-[#CBD5E1]">Join Community</strong> · Learn together
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
