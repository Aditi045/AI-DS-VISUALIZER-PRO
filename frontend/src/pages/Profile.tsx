import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AICopilotModal from '../components/AICopilotModal';

export default function Profile({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [name, setName] = useState(user?.name || 'Sairaj Agawane');
  const [email, setEmail] = useState(user?.email || 'student@example.com');
  const [preferredLang, setPreferredLang] = useState('python');
  const [savedStatus, setSavedStatus] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...user, name, email };
    localStorage.setItem('aids_user', JSON.stringify(updatedUser));
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans flex flex-col">
      <Navbar user={{ ...user, name, email }} onLogout={onLogout} onOpenCopilot={() => setIsCopilotOpen(true)} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <div className="text-xs font-mono text-[#22D3EE] uppercase tracking-wider mb-2">USER ACCOUNT & PREFERENCES</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">Profile & Preferences</h1>
          <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1">Manage your student credentials, preferred programming language, and account settings.</p>
        </header>

        <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6 sm:space-y-8">
          {/* User Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 pb-6 border-b border-[#24344A]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] text-[#050914] font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] shrink-0">
              {name[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">{name}</h2>
              <p className="text-xs text-[#22D3EE] font-mono mt-0.5">STUDENT ACCOUNT · VERIFIED</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131D2D] border border-[#24344A] rounded-xl py-3 px-4 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-colors min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131D2D] border border-[#24344A] rounded-xl py-3 px-4 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-colors min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-2">Preferred Execution Language</label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value)}
                className="w-full bg-[#131D2D] border border-[#24344A] rounded-xl py-3 px-4 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-colors min-h-[44px]"
              >
                <option value="python">Python (Recommended for quick DSA logic)</option>
                <option value="c">C (Low-level memory management)</option>
                <option value="cpp">C++ (STL Containers & Pointers)</option>
                <option value="java">Java (Object-Oriented Data Structures)</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#24344A]">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(34,211,238,0.3)] text-center"
              >
                Save Preferences
              </button>

              {savedStatus && (
                <span className="text-xs text-[#22C55E] font-semibold animate-pulse text-center sm:text-right">
                  ✓ Profile preferences updated successfully!
                </span>
              )}
            </div>
          </form>

          {/* Account Danger Zone */}
          <div className="pt-6 border-t border-[#24344A]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-xs text-red-400">Log Out Session</h4>
              <p className="text-[11px] text-[#64748B]">Sign out of AI-DS Visualizer Pro on this device.</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 font-semibold text-xs rounded-xl transition-colors text-center"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        context={{ chapterId: 'profile' }}
      />
    </div>
  );
}
