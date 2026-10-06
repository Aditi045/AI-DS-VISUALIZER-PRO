import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AICopilotModal from '../components/AICopilotModal';
import { chapters } from '../programCatalog';

export default function Learn({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState('array');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const active = chapters.find((c) => c.id === selectedChapter) || chapters[0];

  const lessons: Record<string, Array<{ id: string; title: string; duration: string; level: string; summary: string }>> = {
    array: [
      { id: '1', title: 'Memory Layout & Indexing', duration: '10 min', level: 'Beginner', summary: 'Learn how arrays store contiguous data elements in RAM.' },
      { id: '2', title: 'Insertion & Deletion Trade-offs', duration: '15 min', level: 'Intermediate', summary: 'Analyze why shifting elements causes O(n) worst-case time complexity.' },
      { id: '3', title: 'Two-Pointer Technique', duration: '20 min', level: 'Advanced', summary: 'Master array searching and reversal using dual indices.' },
    ],
    stack: [
      { id: '1', title: 'LIFO (Last In First Out) Principle', duration: '12 min', level: 'Beginner', summary: 'Understand push/pop semantics with physical analogies.' },
      { id: '2', title: 'Call Stack & Function Recursion', duration: '18 min', level: 'Intermediate', summary: 'How CPUs use stack frames for method invocation.' },
    ],
    queue: [
      { id: '1', title: 'FIFO (First In First Out) Basics', duration: '10 min', level: 'Beginner', summary: 'Explore front and rear pointers in linear queues.' },
      { id: '2', title: 'Circular Queues & Modulo Arithmetic', duration: '15 min', level: 'Intermediate', summary: 'Eliminate element shifting using index wrap-around.' },
    ],
  };

  const currentLessons = lessons[selectedChapter] || [
    { id: '1', title: `Fundamentals of ${active.label}`, duration: '15 min', level: 'Beginner', summary: `Core concepts and practical implementations of ${active.label}.` },
    { id: '2', title: `Advanced ${active.label} Operations`, duration: '20 min', level: 'Intermediate', summary: `Complex operations, memory trade-offs, and algorithmic efficiency.` },
  ];

  return (
    <div className="min-h-screen bg-[#050914] text-[#F8FAFC] font-sans flex flex-col">
      <Navbar user={user} onLogout={onLogout} onOpenCopilot={() => setIsCopilotOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <header className="mb-8">
          <div className="text-xs font-mono text-[#22D3EE] uppercase tracking-wider mb-2">CURRICULUM & GUIDED PATHS</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#F8FAFC]">Interactive DSA Learning Hub</h1>
          <p className="text-sm text-[#CBD5E1] mt-1">Master computer science concepts through visual lessons, code walkthroughs, and quizzes.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chapter Selector */}
          <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-4 shadow-xl h-fit">
            <h3 className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider px-3 mb-3">All Chapters</h3>
            <div className="space-y-1">
              {chapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => setSelectedChapter(chap.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedChapter === chap.id
                      ? 'bg-[#131D2D] text-[#22D3EE] border border-[#22D3EE]/30 shadow-md'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-[#131D2D]/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{chap.icon}</span>
                    <span>{chap.label}</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] bg-[#050914] px-1.5 py-0.5 rounded border border-[#24344A]">
                    {chap.programs.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Lessons List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#0A1120] border border-[#24344A] rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-[#22D3EE]">{active.icon}</span>
                  <h2 className="text-2xl font-bold text-[#F8FAFC]">{active.label} Masterclass</h2>
                </div>
                <p className="text-xs text-[#CBD5E1] mt-2 max-w-xl">
                  {active.programs.length} interactive programs ready in the playground. Master data layout, operational steps, and time/space complexity.
                </p>
              </div>
              <button
                onClick={() => navigate(`/playground/${active.id}`)}
                className="px-5 py-3 bg-gradient-to-r from-[#22D3EE] to-[#38BDF8] text-[#050914] font-bold text-xs rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(34,211,238,0.3)] whitespace-nowrap"
              >
                Launch Playground →
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#F8FAFC]">Guided Lessons</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-[#101827] border border-[#24344A] hover:border-[#22D3EE]/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20">
                        {lesson.level}
                      </span>
                      <span className="text-xs text-[#64748B]">⏱ {lesson.duration}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors mb-2">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed">{lesson.summary}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#24344A]/60 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/playground/${active.id}`)}
                      className="text-xs font-semibold text-[#22D3EE] hover:underline flex items-center gap-1"
                    >
                      <span>Interactive Code & Visuals</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => setIsCopilotOpen(true)}
                      className="text-[11px] font-mono text-[#8B5CF6] hover:text-white"
                    >
                      Ask AI 🤖
                    </button>
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
        context={{ chapterId: active.id, programName: active.label }}
      />
    </div>
  );
}
