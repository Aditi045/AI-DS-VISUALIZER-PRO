import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard({ user }: { user: any }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#0A1120] border-b border-[#24344A]">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-[#22D3EE] tracking-tight">AI-DS<span className="text-[#F8FAFC]"> VISUALIZER PRO</span></Link>
          <div className="hidden md:flex gap-6 text-[#CBD5E1] text-sm">
            <Link to="/dashboard" className="text-[#22D3EE] font-semibold">Dashboard</Link>
            <Link to="/playground" className="hover:text-white transition-colors">Playground</Link>
            <Link to="/learn" className="hover:text-white transition-colors">Learn</Link>
            <Link to="/progress" className="hover:text-white transition-colors">Progress</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#22D3EE] to-[#8B5CF6] flex items-center justify-center font-bold">
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back{user?.name ? `, ${user.name}` : ''}!</h1>
          <p className="text-[#CBD5E1]">Your DSA Learning Journey</p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#131D2D] border border-[#24344A] rounded-xl p-6">
            <h3 className="text-[#64748B] text-sm font-semibold uppercase tracking-wider mb-2">Overall Progress</h3>
            <div className="text-3xl font-bold text-[#22D3EE]">80%</div>
            <div className="w-full bg-[#050914] rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-[#22D3EE] h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="bg-[#131D2D] border border-[#24344A] rounded-xl p-6">
            <h3 className="text-[#64748B] text-sm font-semibold uppercase tracking-wider mb-2">Chapters Completed</h3>
            <div className="text-3xl font-bold">12 / 14</div>
          </div>
          <div className="bg-[#131D2D] border border-[#24344A] rounded-xl p-6">
            <h3 className="text-[#64748B] text-sm font-semibold uppercase tracking-wider mb-2">Programs Completed</h3>
            <div className="text-3xl font-bold">45 / 80</div>
          </div>
          <div className="bg-[#131D2D] border border-[#24344A] rounded-xl p-6">
            <h3 className="text-[#64748B] text-sm font-semibold uppercase tracking-wider mb-2">Current Streak</h3>
            <div className="text-3xl font-bold text-[#F59E0B]">5 Days 🔥</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
            <div className="bg-[#131D2D] border border-[#24344A] rounded-xl p-8 flex items-center justify-between mb-8">
              <div>
                <p className="text-[#22D3EE] font-mono text-sm mb-1">CURRENT CHAPTER: ARRAY</p>
                <h3 className="text-2xl font-bold mb-2">Create Array & Traverse</h3>
                <p className="text-[#CBD5E1]">Master how to initialize a contiguous block of memory and access elements.</p>
              </div>
              <button 
                onClick={() => navigate('/playground/array')}
                className="px-6 py-3 bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue →
              </button>
            </div>

            <h2 className="text-xl font-bold mb-4">Recommended Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Stack', 'Queue', 'Searching', 'Sorting', 'Linked List'].map(topic => (
                <div key={topic} onClick={() => navigate(`/playground/${topic.toLowerCase().replace(' ', '-')}`)} className="bg-[#131D2D] border border-[#24344A] rounded-xl p-5 hover:border-[#22D3EE] cursor-pointer transition-colors">
                  <h3 className="font-bold">{topic}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="bg-[#131D2D] border border-[#24344A] rounded-xl p-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#22C55E]"></div>
                  <div>
                    <p className="font-semibold text-sm">Completed Array Traversal</p>
                    <p className="text-xs text-[#64748B]">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#22D3EE]"></div>
                  <div>
                    <p className="font-semibold text-sm">Practiced Stack Push</p>
                    <p className="text-xs text-[#64748B]">Yesterday</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#8B5CF6]"></div>
                  <div>
                    <p className="font-semibold text-sm">Viewed Binary Search</p>
                    <p className="text-xs text-[#64748B]">3 days ago</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#22C55E]"></div>
                  <div>
                    <p className="font-semibold text-sm">Completed Bubble Sort</p>
                    <p className="text-xs text-[#64748B]">Last week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
