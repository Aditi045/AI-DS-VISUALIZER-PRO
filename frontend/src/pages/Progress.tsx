import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AICopilotModal from '../components/AICopilotModal';
import { chapters } from '../programCatalog';

export default function Progress({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const completedProgramsCount = 45;
  const totalProgramsCount = 80;
  const completedChaptersCount = 12;
  const totalChaptersCount = 14;
  const streakDays = 5;

  const badges = [
    { title: 'Array Master', icon: '⚡', unlocked: true, desc: 'Completed all 6 Array operations' },
    { title: 'Stack & Queue Champion', icon: '▥', unlocked: true, desc: 'Mastered push, pop, enqueue, dequeue' },
    { title: 'Tree Navigator', icon: '⌘', unlocked: true, desc: 'Performed Inorder, Preorder, and Postorder traversals' },
    { title: 'Graph Explorer', icon: '✣', unlocked: true, desc: 'Executed BFS & DFS algorithms' },
    { title: 'Recursion Master', icon: '↘', unlocked: false, desc: 'Solve 10 recursive call trace problems' },
    { title: 'Algorithm Speedrunner', icon: '⏱', unlocked: false, desc: 'Step through 50 visualization events' },
  ];

  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans flex flex-col">
      <Navbar user={user} onLogout={onLogout} onOpenCopilot={() => setIsCopilotOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <header className="mb-8">
          <div className="text-xs font-mono text-[#22D3EE] uppercase tracking-wider mb-2">ANALYTICS & MILESTONES</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F8FAFC]">Learning Progress & Stats</h1>
          <p className="text-sm text-[#CBD5E1] mt-1">Track your program execution practice, streaks, and unlocked achievements.</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#64748B] text-xs font-mono font-bold uppercase tracking-wider mb-2">Overall Completion</h3>
            <div className="text-3xl font-extrabold text-[#22D3EE]">80%</div>
            <div className="w-full bg-[#050914] rounded-full h-2 mt-4 overflow-hidden border border-[#24344A]">
              <div className="bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] h-2 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#64748B] text-xs font-mono font-bold uppercase tracking-wider mb-2">Chapters Completed</h3>
            <div className="text-3xl font-extrabold text-[#F8FAFC]">
              {completedChaptersCount} <span className="text-sm text-[#64748B] font-normal">/ {totalChaptersCount}</span>
            </div>
            <div className="text-xs text-[#22C55E] mt-3 font-semibold">85% of chapters finished</div>
          </div>

          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#64748B] text-xs font-mono font-bold uppercase tracking-wider mb-2">Programs Executed</h3>
            <div className="text-3xl font-extrabold text-[#F8FAFC]">
              {completedProgramsCount} <span className="text-sm text-[#64748B] font-normal">/ {totalProgramsCount}</span>
            </div>
            <div className="text-xs text-[#CBD5E1] mt-3">Interactive traces generated</div>
          </div>

          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#64748B] text-xs font-mono font-bold uppercase tracking-wider mb-2">Current Daily Streak</h3>
            <div className="text-3xl font-extrabold text-[#F59E0B] flex items-center gap-2">
              <span>{streakDays} Days</span>
              <span className="text-2xl animate-bounce">🔥</span>
            </div>
            <div className="text-xs text-[#F59E0B]/80 mt-3 font-semibold">Keep learning tomorrow!</div>
          </div>
        </div>

        {/* Chapter Breakdown & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapter Progress Breakdown */}
          <div className="lg:col-span-2 bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-6">Chapter Mastery Breakdown</h3>
            <div className="space-y-4">
              {chapters.map((chap, idx) => {
                const pct = idx < 10 ? 100 : idx === 10 ? 70 : 40;
                return (
                  <div key={chap.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-[#CBD5E1]">
                        <span>{chap.icon}</span>
                        <span>{chap.label}</span>
                      </span>
                      <span className="font-mono text-[#22D3EE]">{pct}%</span>
                    </div>
                    <div className="w-full bg-[#050914] rounded-full h-2 overflow-hidden border border-[#24344A]">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          pct === 100
                            ? 'bg-[#22C55E]'
                            : pct > 50
                            ? 'bg-[#22D3EE]'
                            : 'bg-[#F59E0B]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges / Achievements */}
          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-6">Unlocked Badges</h3>
            <div className="space-y-4">
              {badges.map((b) => (
                <div
                  key={b.title}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    b.unlocked
                      ? 'bg-[#131D2D] border-[#22D3EE]/30 shadow-md'
                      : 'bg-[#050914]/60 border-[#24344A] opacity-60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3EE]/20 to-[#8B5CF6]/20 border border-[#22D3EE]/40 flex items-center justify-center text-xl shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#F8FAFC] flex items-center gap-2">
                      <span>{b.title}</span>
                      {b.unlocked && <span className="text-[10px] text-[#22C55E]">✓ UNLOCKED</span>}
                    </h4>
                    <p className="text-[11px] text-[#CBD5E1] mt-1">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        context={{ chapterId: 'progress' }}
      />
    </div>
  );
}
