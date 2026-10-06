import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AICopilotModal from '../components/AICopilotModal';

export default function Dashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const recommendedTopics = [
    { name: 'Array', id: 'array', icon: '▤', desc: 'Contiguous memory & fast lookup' },
    { name: 'Stack', id: 'stack', icon: '▥', desc: 'LIFO push, pop & call frames' },
    { name: 'Queue', id: 'queue', icon: '⇢', desc: 'FIFO enqueue & dequeue processing' },
    { name: 'Binary Tree', id: 'binary_tree', icon: '⑂', desc: 'Inorder, Preorder, Postorder traversals' },
    { name: 'Searching', id: 'searching', icon: '⌕', desc: 'Linear & Binary Search algorithms' },
    { name: 'Sorting', id: 'sorting', icon: '⇅', desc: 'Bubble, Merge & Quick Sort visual bars' },
  ];

  const recentActivities = [
    { title: 'Completed Array Traversal', time: '2 hours ago', status: 'SUCCESS', icon: '✓', color: 'bg-[#22C55E]' },
    { title: 'Practiced Stack Push & Pop', time: 'Yesterday', status: 'STEP', icon: '▶', color: 'bg-[#22D3EE]' },
    { title: 'Explored Binary Search Range', time: '3 days ago', status: 'INFO', icon: '⌘', color: 'bg-[#8B5CF6]' },
    { title: 'Ran Bubble Sort Visualizer', time: 'Last week', status: 'SUCCESS', icon: '✓', color: 'bg-[#22C55E]' },
  ];

  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans flex flex-col">
      <Navbar user={user} onLogout={onLogout} onOpenCopilot={() => setIsCopilotOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Header Banner */}
        <header className="mb-8">
          <div className="text-xs font-mono text-[#22D3EE] uppercase tracking-wider mb-1">STUDENT LEARNING DASHBOARD</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F8FAFC]">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-sm text-[#CBD5E1] mt-1">Your DSA Learning Journey</p>
        </header>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-[#64748B] text-xs font-mono font-bold uppercase tracking-wider mb-2">Overall Progress</h3>
            <div className="text-3xl font-extrabold text-[#22D3EE]">80%</div>
            <div className="w-full bg-[#050914] rounded-full h-2 mt-4 overflow-hidden border border-[#24344A]">
              <div className="bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] h-2 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#64748B] text-xs font-mono font-bold uppercase tracking-wider mb-2">Chapters Completed</h3>
            <div className="text-3xl font-extrabold text-[#F8FAFC]">
              12 <span className="text-sm text-[#64748B] font-normal">/ 14</span>
            </div>
            <p className="text-xs text-[#22C55E] mt-3 font-semibold">Array, Stack, Queue, Trees done</p>
          </div>

          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#64748B] text-xs font-mono font-bold uppercase tracking-wider mb-2">Programs Completed</h3>
            <div className="text-3xl font-extrabold text-[#F8FAFC]">
              45 <span className="text-sm text-[#64748B] font-normal">/ 80</span>
            </div>
            <p className="text-xs text-[#CBD5E1] mt-3">Interactive traces generated</p>
          </div>

          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-[#64748B] text-xs font-mono font-bold uppercase tracking-wider mb-2">Current Streak</h3>
            <div className="text-3xl font-extrabold text-[#F59E0B] flex items-center gap-2">
              <span>5 Days</span>
              <span className="text-2xl animate-bounce">🔥</span>
            </div>
            <p className="text-xs text-[#F59E0B]/80 mt-3 font-semibold">Active learning streak</p>
          </div>
        </div>

        {/* Main Workspace Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning & Recommended */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Card */}
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
                <span>▶</span> Continue Learning
              </h2>
              <div className="bg-gradient-to-r from-[#0A1120] to-[#131D2D] border border-[#24344A] hover:border-[#22D3EE]/50 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all group">
                <div>
                  <div className="inline-block text-[10px] font-mono font-bold text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/30 px-2.5 py-1 rounded-md mb-2">
                    CURRENT CHAPTER: ARRAY
                  </div>
                  <h3 className="text-2xl font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors mb-2">
                    Create Array & Traverse
                  </h3>
                  <p className="text-xs text-[#CBD5E1] max-w-md leading-relaxed">
                    Master how to initialize a contiguous block of memory and visit each index sequentially with real execution traces.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/playground/array')}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(34,211,238,0.3)] shrink-0 flex items-center gap-2"
                >
                  <span>Continue</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Recommended Programs */}
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
                <span>⚡</span> Recommended Programs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recommendedTopics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => navigate(`/playground/${topic.id}`)}
                    className="bg-[#0A1120] border border-[#24344A] hover:border-[#22D3EE] rounded-xl p-4 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] group"
                  >
                    <div className="flex items-center gap-2 text-xl text-[#22D3EE] mb-2">
                      <span>{topic.icon}</span>
                      <span className="font-bold text-sm text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                        {topic.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] line-clamp-2">{topic.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
              <span>⏱</span> Recent Activity
            </h2>
            <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl">
              <div className="space-y-5">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className={`w-2 h-2 mt-1.5 rounded-full ${act.color} shrink-0`} />
                    <div className="flex-1">
                      <p className="font-semibold text-[#F8FAFC]">{act.title}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        context={{ chapterId: 'dashboard' }}
      />
    </div>
  );
}
