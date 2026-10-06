import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'educator' | 'admin'>('student');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Try real backend if available, otherwise mock for demo
      const result = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).then(res => res.json()).catch(() => null);

      if (result?.success && result.user) {
        onLogin(result.user);
      } else {
        onLogin({ name: email.split('@')[0], email });
      }
      navigate('/dashboard');
    } catch (e) {
      onLogin({ name: email.split('@')[0], email });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans flex flex-col md:flex-row relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#22D3EE] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8B5CF6] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* LEFT SIDE */}
      <div className="w-full md:w-3/5 p-8 md:p-16 lg:p-24 flex flex-col justify-center z-10">
        <div className="mb-4">
          <div className="text-xl font-bold flex items-center gap-2 mb-8">
            <span className="text-3xl text-[#22D3EE]">◬</span>
            AI-DS<span className="text-[#CBD5E1]"> VISUALIZER PRO</span>
          </div>
          <p className="text-sm text-[#CBD5E1] tracking-widest uppercase mb-4">Learn · Visualize · Practice · Grow</p>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Master Data Structures<br />
            and Algorithms<br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] to-[#38BDF8]">AI-Powered Learning</span>
          </h1>
          <p className="text-lg text-[#CBD5E1] max-w-xl mb-12">
            Interactive visualizations, real code execution, AI guidance, and structured learning — everything students need to truly understand DSA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#22D3EE]/20 to-transparent flex items-center justify-center border border-[#22D3EE]/30 text-[#22D3EE]">▶</div>
            <div>
              <h3 className="font-bold">Interactive Visualizations</h3>
              <p className="text-sm text-[#64748B]">See algorithms come to life</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#22C55E]/20 to-transparent flex items-center justify-center border border-[#22C55E]/30 text-[#22C55E]">_&gt;</div>
            <div>
              <h3 className="font-bold">Real Code Execution</h3>
              <p className="text-sm text-[#64748B]">Run, step, debug, and visualize</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F59E0B]/20 to-transparent flex items-center justify-center border border-[#F59E0B]/30 text-[#F59E0B]">&lt;/&gt;</div>
            <div>
              <h3 className="font-bold">Multiple Languages</h3>
              <p className="text-sm text-[#64748B]">C, C++, Java, Python</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8B5CF6]/20 to-transparent flex items-center justify-center border border-[#8B5CF6]/30 text-[#8B5CF6]">●</div>
            <div>
              <h3 className="font-bold">AI Student Copilot</h3>
              <p className="text-sm text-[#64748B]">Get instant help and explanations</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-2/5 p-8 md:p-12 lg:p-16 flex items-center justify-center z-10 relative">
        <div className="absolute inset-0 bg-[#0A1120]/60 backdrop-blur-3xl border-l border-[#24344A]"></div>
        
        <div className="w-full max-w-md relative">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-[#CBD5E1]">Log in to continue your DSA learning journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex bg-[#050914] p-1 rounded-lg border border-[#24344A] mb-8">
              {(['student', 'educator', 'admin'] as const).map(r => (
                <button 
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md capitalize transition-colors ${role === r ? 'bg-[#22D3EE] text-[#050914]' : 'text-[#64748B] hover:text-[#CBD5E1]'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#CBD5E1] mb-2 font-medium">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-[#64748B]">✉</span>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#131D2D] border border-[#24344A] rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#22D3EE] transition-colors" 
                    placeholder="student@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-[#CBD5E1] mb-2 font-medium">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-[#64748B]">🔒</span>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#131D2D] border border-[#24344A] rounded-lg py-3 pl-10 pr-10 text-white focus:outline-none focus:border-[#22D3EE] transition-colors" 
                    placeholder="••••••••••••"
                  />
                  <button type="button" className="absolute right-4 top-3 text-[#64748B] hover:text-white">👁</button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#CBD5E1]">
                  <input type="checkbox" className="rounded border-[#24344A] bg-[#131D2D] text-[#22D3EE] focus:ring-[#22D3EE]" defaultChecked />
                  Remember me
                </label>
                <a href="#" className="text-sm text-[#22D3EE] hover:underline">Forgot password?</a>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white font-bold rounded-lg mt-6 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-shadow">
              Log In →
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <hr className="w-full border-[#24344A]" />
              <span className="absolute bg-[#0A1120] px-4 text-xs text-[#64748B] uppercase tracking-wider">Or continue with</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <button className="flex items-center justify-center py-2 bg-[#131D2D] border border-[#24344A] rounded-lg hover:bg-[#24344A] transition-colors"><span className="font-bold">G</span></button>
              <button className="flex items-center justify-center py-2 bg-[#131D2D] border border-[#24344A] rounded-lg hover:bg-[#24344A] transition-colors"><span className="font-bold">GH</span></button>
              <button className="flex items-center justify-center py-2 bg-[#131D2D] border border-[#24344A] rounded-lg hover:bg-[#24344A] transition-colors"><span className="font-bold">MS</span></button>
            </div>
          </div>

          <p className="text-center text-sm text-[#CBD5E1] mt-8">
            Don't have an account? <a href="#" className="text-[#22D3EE] font-bold hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
