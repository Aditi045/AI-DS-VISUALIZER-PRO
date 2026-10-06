import React, { useState } from 'react';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: {
    chapterId?: string;
    programName?: string;
    language?: string;
    code?: string;
    error?: string | null;
    operation?: string;
    complexity?: any;
  };
}

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionType?: string;
};

export const AICopilotModal: React.FC<AICopilotModalProps> = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I am your AI Student Copilot. I'm context-aware and ready to help you master ${
        context?.chapterId ? context.chapterId.toUpperCase() : 'Data Structures & Algorithms'
      }. How can I assist your learning right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Explain Topic', icon: '📖', key: 'explain_topic' },
    { label: 'Explain My Code', icon: '💻', key: 'explain_code' },
    { label: 'Debug My Code', icon: '🐛', key: 'debug_code' },
    { label: 'Give Me a Hint', icon: '💡', key: 'hint' },
    { label: 'Explain Visualization', icon: '👁', key: 'explain_visual' },
    { label: 'Explain Complexity', icon: '⏱', key: 'complexity' },
    { label: 'Generate Example', icon: '⚡', key: 'example' },
    { label: 'Quiz Me', icon: '🎯', key: 'quiz' },
  ];

  const generateAIResponse = (userPrompt: string, actionKey?: string) => {
    setIsThinking(true);
    setTimeout(() => {
      let reply = '';
      const lang = context?.language?.toUpperCase() || 'PYTHON';
      const prog = context?.programName || 'Data Structure';
      const chap = context?.chapterId?.toUpperCase() || 'DSA';

      if (actionKey === 'explain_topic') {
        reply = `### 📖 Concept Explanation: ${chap}\n\n**${prog}** is a foundational structure in computer science.\n- **Core Mechanism**: Organizes data to allow efficient access and modification.\n- **Key Properties**: Predictable memory layout and strict operational rules.\n- **Real-world Use Cases**: Operating system scheduling, database indexing, browser history stack, and graph navigation.`;
      } else if (actionKey === 'explain_code') {
        reply = `### 💻 Code Walkthrough (${lang})\n\nHere is how your current ${lang} code executes line-by-line:\n1. **Initialization**: Declares and structures memory allocation.\n2. **Operations**: Applies data transformations (insertions/traversals).\n3. **Termination**: Cleanly concludes execution and outputs results.`;
      } else if (actionKey === 'debug_code') {
        if (context?.error) {
          reply = `### 🐛 Debug Assistant\n\n**Detected Error**: \`${context.error}\`\n\n**Suggestion**: Check array bounds or variable assignments before accessing elements. Make sure input formats match expected types.`;
        } else {
          reply = `### 🐛 Debug Audit\n\nNo active runtime crash detected in your ${lang} code! All boundary checks and pointer allocations appear consistent.`;
        }
      } else if (actionKey === 'hint') {
        reply = `### 💡 Learning Hint\n\nTry stepping through the program line-by-line using the **⏭ STEP** button in the playground execution toolbar. Watch how the pointers shift in real-time in the visualization panel!`;
      } else if (actionKey === 'explain_visual') {
        reply = `### 👁 Visualization Breakdown\n\n- **Cyan Highlight**: Represents the element or node currently being accessed by the pointer.\n- **Purple/Indigo Highlight**: Marks active comparison or swap operations.\n- **Green Elements**: Confirmed processed or sorted nodes.`;
      } else if (actionKey === 'complexity') {
        reply = `### ⏱ Complexity Deep-Dive\n\n- **Time Complexity**: ${context?.complexity?.timeAverage || 'O(n)'} average case.\n- **Space Complexity**: ${context?.complexity?.space || 'O(1)'}.\n- **Why?**: Processing requires traversing elements sequentially without requiring extra auxiliary data buffers proportional to input size.`;
      } else if (actionKey === 'example') {
        reply = `### ⚡ Practical Code Snippet (${lang})\n\n\`\`\`${lang.toLowerCase()}\n# Practical demonstration of ${prog}\nvals = [10, 20, 30, 40, 50]\nprint("Initial state:", vals)\n# Performing operation\nvals.append(60)\nprint("Updated state:", vals)\n\`\`\``;
      } else if (actionKey === 'quiz') {
        reply = `### 🎯 Quick DSA Quiz\n\n**Question**: What is the worst-case time complexity for searching an element in an unsorted array of size *n*?\n\nA) O(1)\nB) O(log n)\nC) O(n)\nD) O(n²)`;
      } else {
        reply = `I parsed your question regarding **${prog}** (${lang}). Based on your current execution state, the structure maintains optimal runtime bounds. Let me know if you want to inspect line-by-line state or debug any specific operation!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsThinking(false);
    }, 600);
  };

  const handleSendMessage = (textToSend?: string, actionKey?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    generateAIResponse(text, actionKey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050914]/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0A1120] border border-[#24344A] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px] relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#101827] border-b border-[#24344A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <div className="w-full h-full bg-[#0A1120] rounded-[10px] flex items-center justify-center text-base">
                🤖
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#F8FAFC]">AI Student Copilot</h3>
              <p className="text-[11px] text-[#22D3EE]">
                Context: <span className="font-mono">{context?.chapterId?.toUpperCase() || 'PLAYGROUND'}</span>
                {context?.language && ` · ${context.language.toUpperCase()}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#131D2D] hover:bg-[#24344A] text-[#64748B] hover:text-white flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Action Chips */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#0d1420] border-b border-[#24344A] overflow-x-auto select-none no-scrollbar">
          {quickActions.map((act) => (
            <button
              key={act.key}
              onClick={() => handleSendMessage(act.label, act.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131D2D] hover:bg-[#24344A] border border-[#24344A] hover:border-[#22D3EE]/50 text-xs font-medium text-[#CBD5E1] whitespace-nowrap transition-all"
            >
              <span>{act.icon}</span>
              <span>{act.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#050914]/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed font-sans ${
                  msg.sender === 'user'
                    ? 'bg-[#22D3EE] text-[#050914] font-medium rounded-tr-none'
                    : 'bg-[#131D2D] text-[#F8FAFC] border border-[#24344A] rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[9px] mt-2 font-mono ${
                    msg.sender === 'user' ? 'text-[#050914]/70' : 'text-[#64748B]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-[#22D3EE] p-2 bg-[#131D2D]/40 rounded-lg w-fit border border-[#22D3EE]/20 animate-pulse">
              <span>🤖 Copilot is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-[#101827] border-t border-[#24344A] flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Copilot about DSA, code execution, or concepts..."
            className="flex-1 bg-[#050914] border border-[#24344A] rounded-xl py-3 px-4 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE] transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white font-bold text-xs rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            Send →
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICopilotModal;
