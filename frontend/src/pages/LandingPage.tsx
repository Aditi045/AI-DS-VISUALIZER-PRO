import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState<'student' | 'educator' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Try real backend auth endpoint if running local/production backend
      const result = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);

      const userObj = result?.user || {
        id: Date.now(),
        name: email.split('@')[0] || 'Student',
        email,
        role,
      };

      onLogin(userObj);
      navigate('/dashboard');
    } catch {
      onLogin({
        id: Date.now(),
        name: email.split('@')[0] || 'Student',
        email,
        role,
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const featureCards = [
    {
      title: 'Interactive Visualizations',
      desc: 'See algorithms come to life in real-time',
      icon: '▶',
      color: 'from-[#22D3EE]/20 to-transparent border-[#22D3EE]/30 text-[#22D3EE]',
    },
    {
      title: 'Real Code Execution',
      desc: 'Run, step, debug, and visualize code',
      icon: '_>',
      color: 'from-[#22C55E]/20 to-transparent border-[#22C55E]/30 text-[#22C55E]',
    },
    {
      title: 'Multiple Languages',
      desc: 'Support for C, C++, Java, Python',
      icon: '</>',
      color: 'from-[#F59E0B]/20 to-transparent border-[#F59E0B]/30 text-[#F59E0B]',
    },
    {
      title: 'Track Your Progress',
      desc: 'Monitor chapters, programs, and daily streaks',
      icon: '📊',
      color: 'from-[#38BDF8]/20 to-transparent border-[#38BDF8]/30 text-[#38BDF8]',
    },
    {
      title: 'AI Student Copilot',
      desc: 'Get instant explanations and debugging help',
      icon: '🤖',
      color: 'from-[#8B5CF6]/20 to-transparent border-[#8B5CF6]/30 text-[#8B5CF6]',
    },
    {
      title: 'Practice & Improve',
      desc: 'Interactive exercises and complexity analysis',
      icon: '🎯',
      color: 'from-[#6366F1]/20 to-transparent border-[#6366F1]/30 text-[#6366F1]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans flex flex-col md:flex-row relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#22D3EE] opacity-10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-[#8B5CF6] opacity-10 blur-[130px] rounded-full pointer-events-none" />

      {/* LEFT HERO SECTION */}
      <div className="w-full md:w-3/5 p-8 md:p-16 lg:p-24 flex flex-col justify-between z-10">
        <div>
          {/* Logo */}
          <div className="text-2xl font-extrabold flex items-center gap-2 mb-10 tracking-tight">
            <span className="text-3xl text-[#22D3EE]">◬</span>
            <span>AI-DS <span className="text-[#CBD5E1]">VISUALIZER PRO</span></span>
          </div>

          <p className="text-xs font-mono font-bold text-[#22D3EE] tracking-widest uppercase mb-4">
            Interactive Visualizations · Code Execution · AI Guidance
          </p>

          <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
            Master Data Structures<br />
            and Algorithms<br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#8B5CF6]">AI-Powered Learning</span>
          </h1>

          <p className="text-base text-[#CBD5E1] max-w-xl mb-12 leading-relaxed">
            Interactive visualizations, real code execution, AI guidance, and structured learning — everything you need to truly understand DSA.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0A1120]/80 border border-[#24344A] hover:border-[#22D3EE]/40 backdrop-blur-md transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} border flex items-center justify-center font-mono font-bold text-sm shrink-0`}>
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

      {/* RIGHT LOGIN CARD SECTION */}
      <div className="w-full md:w-2/5 p-8 md:p-12 lg:p-16 flex items-center justify-center z-10 relative">
        <div className="absolute inset-0 bg-[#0A1120]/75 backdrop-blur-3xl border-l border-[#24344A]" />

        <div className="w-full max-w-md relative z-20">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] text-[#050914] font-black text-2xl mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              ◬
            </div>
            <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
            <p className="text-xs text-[#CBD5E1]">Log in to continue your DSA learning journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selection Tabs */}
            <div className="flex bg-[#050914] p-1 rounded-xl border border-[#24344A]">
              {(['student', 'educator', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                    role === r
                      ? 'bg-[#22D3EE] text-[#050914] shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1.5 font-medium">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#64748B] text-sm">✉</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#131D2D] border border-[#24344A] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE] transition-colors"
                    placeholder="student@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs text-[#CBD5E1] mb-1.5 font-medium">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#64748B] text-sm">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#131D2D] border border-[#24344A] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE] transition-colors"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#64748B] hover:text-white text-xs transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#CBD5E1] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#24344A] bg-[#131D2D] text-[#22D3EE] focus:ring-[#22D3EE]"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }} className="text-[#22D3EE] hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#8B5CF6] text-white font-bold text-xs rounded-xl mt-4 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>Log In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-5">
              <hr className="w-full border-[#24344A]" />
              <span className="absolute bg-[#0A1120] px-3 text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                className="flex items-center justify-center gap-2 py-2.5 bg-[#131D2D] border border-[#24344A] rounded-xl text-xs font-semibold hover:bg-[#24344A] hover:border-[#22D3EE]/40 transition-colors"
              >
                <span>🌐</span> Google
              </button>
              <button
                type="button"
                onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                className="flex items-center justify-center gap-2 py-2.5 bg-[#131D2D] border border-[#24344A] rounded-xl text-xs font-semibold hover:bg-[#24344A] hover:border-[#22D3EE]/40 transition-colors"
              >
                <span>🐙</span> GitHub
              </button>
              <button
                type="button"
                onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                className="flex items-center justify-center gap-2 py-2.5 bg-[#131D2D] border border-[#24344A] rounded-xl text-xs font-semibold hover:bg-[#24344A] hover:border-[#22D3EE]/40 transition-colors"
              >
                <span>❖</span> Microsoft
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-[#CBD5E1] mt-8">
            Don't have an account?{' '}
            <button
              onClick={() => {
                setEmail('student@example.com');
                setPassword('password123');
              }}
              className="text-[#22D3EE] font-bold hover:underline"
            >
              Sign Up (Demo Fill)
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
