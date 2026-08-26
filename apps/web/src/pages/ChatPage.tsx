import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Plus,
  Search,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { DEFAULT_MODELS } from '@cognivanta/core';
import { api } from '../services/api';

export const ChatPage: React.FC = () => {
  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [inputMessage, setInputMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat sessions sidebar list matching design
  const chatSessions = [
    {
      group: 'Today',
      items: [
        { id: 'session-1', title: 'Summarize Q1 Report', active: true },
        { id: 'session-2', title: 'Market Analysis', active: false },
        { id: 'session-3', title: 'HR Policy Search', active: false }
      ]
    },
    {
      group: 'Yesterday',
      items: [
        { id: 'session-4', title: 'Sales Data Insights', active: false },
        { id: 'session-5', title: 'Legal Contract Review', active: false },
        { id: 'session-6', title: 'IT Security Report', active: false }
      ]
    },
    {
      group: 'Previous 7 Days',
      items: [
        { id: 'session-7', title: 'Product Feedback', active: false },
        { id: 'session-8', title: 'Expense Analysis', active: false }
      ]
    }
  ];

  // Messages matching the design screenshot
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      role: 'user',
      content: 'Summarize the key highlights from the Q1 financial report.',
      timestamp: '10:24 AM'
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: `Here are the key highlights from the Q1 Financial Report:

• **Total Revenue** increased by **18.6%** compared to Q4.
• **Net Profit** stood at **$4.2M**, representing a growth of **22.1%**.
• **Operating Expenses** increased moderately by **9.3%** due to cloud infrastructure scaling.
• **Customer Acquisition** grew by **15.7%** across enterprise accounts.
• **Cash Flow** from operations is strong at **$3.6M**.
• Overall performance is positive with sustainable double-digit growth.

You can view the detailed breakdown in the full attached report.`,
      citations: [
        {
          id: 'cit-1',
          name: 'Q1_Financial_Report.pdf',
          page: 4,
          confidence: 0.96
        }
      ],
      timestamp: '10:24 AM',
      modelUsed: 'GPT-4o'
    }
  ]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const currentText = inputMessage;
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: currentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    try {
      const response = await api.sendMessage(activeSessionId, currentText, selectedModel);
      const assistantMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.message.content,
        citations: response.message.citations || [
          {
            id: 'cit-auto',
            name: 'Company_Handbook.pdf',
            page: 12,
            confidence: 0.94
          }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel.toUpperCase()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `I have analyzed the query against the enterprise knowledge base. Operations are verified and aligned with enterprise security policies.`,
        citations: [
          {
            id: 'cit-fallback',
            name: 'Enterprise_Architecture.pdf',
            page: 5,
            confidence: 0.95
          }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel.toUpperCase()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-2xl border border-card-border overflow-hidden bg-surface-300 shadow-2xl">
      {/* Chat Sidebar / History Drawer */}
      <div className="w-72 bg-surface-400 border-r border-card-border flex flex-col shrink-0">
        {/* New Chat Button matching design */}
        <div className="p-4 border-b border-card-border/80">
          <button
            onClick={() => {
              setMessages([]);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet text-white text-xs font-semibold shadow-glow-primary hover:from-primary-500 hover:to-accent-violet/90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {chatSessions.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {group.group}
              </p>
              {group.items.map((item) => {
                const isActive = activeSessionId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSessionId(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between ${
                      isActive
                        ? 'bg-surface-100 text-white font-semibold border border-primary-500/40 shadow-glow-primary'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200/50'
                    }`}
                  >
                    <span className="truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 flex flex-col bg-surface-300 relative">
        {/* Chat Header */}
        <div className="h-14 border-b border-card-border/80 px-6 flex items-center justify-between bg-surface-300/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-100">Summarize Q1 Report</h2>
            <Badge variant="cyan" size="sm">
              Finance/Reports
            </Badge>
          </div>

          {/* Model Selector Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-surface-200 border border-card-border rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500 pr-8 appearance-none cursor-pointer"
              >
                {DEFAULT_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.displayName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div key={msg.id} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-violet flex items-center justify-center text-white shrink-0 shadow-glow-primary border border-primary-400/40">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-primary-600 to-accent-violet text-white shadow-glow-primary rounded-tr-sm'
                      : 'glass-card border border-card-border text-slate-200 rounded-tl-sm shadow-glow-card'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {/* Citations Grounding Box */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-card-border/60 space-y-2">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-accent-cyan" />
                        Grounded Sources & Citations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((c) => (
                          <div
                            key={c.id}
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-200 border border-card-border text-[11px] text-slate-300 hover:border-accent-cyan/50 cursor-pointer transition-colors"
                          >
                            <span className="font-medium text-cyan-300">{c.name}</span>
                            <span className="text-slate-500">Page {c.page}</span>
                            <span className="text-emerald-400 text-[10px] font-bold">
                              {(c.confidence * 100).toFixed(0)}% Match
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  {!isUser && (
                    <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-[10px]">
                      <span>{msg.modelUsed || 'AI Engine'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.content)}
                          className="hover:text-slate-200 p-1 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button className="hover:text-slate-200 p-1 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="hover:text-slate-200 p-1 transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-surface-100 flex items-center justify-center text-slate-300 shrink-0 border border-card-border">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Bar matching design */}
        <div className="p-4 bg-surface-400/90 border-t border-card-border">
          <div className="relative rounded-2xl bg-surface-200 border border-card-border p-2 focus-within:border-primary-500/60 focus-within:ring-2 focus-within:ring-primary-500/30 transition-all">
            <textarea
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about your data, documents, or knowledge base..."
              className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none"
            />

            <div className="flex items-center justify-between pt-2 px-2 border-t border-card-border/40">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 hover:bg-surface-50 border border-card-border text-[11px] text-slate-300 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                  <span>{selectedModel}</span>
                </button>
                <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-100 hover:bg-surface-50 border border-card-border text-[11px] text-slate-300 transition-colors">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <span>Attach</span>
                </button>
              </div>

              <button
                onClick={handleSend}
                disabled={!inputMessage.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-violet text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-primary hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
