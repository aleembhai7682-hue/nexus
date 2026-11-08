import React, { useState } from 'react';
import {
  X,
  Sparkles,
  GraduationCap,
  CalendarCheck2,
  Video,
  Send,
  Loader2,
  Copy,
  Check,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { Language, StudyTask } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddTaskToPlanner?: (task: Omit<StudyTask, 'id'>) => void;
  initialContext?: 'study' | 'productivity' | 'creator';
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedTask?: {
    title: string;
    durationMinutes: number;
    type: StudyTask['type'];
  };
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  onAddTaskToPlanner,
  initialContext = 'study',
  initialPrompt = '',
}) => {
  const [context, setContext] = useState<'study' | 'productivity' | 'creator'>(initialContext);
  const [aiLang, setAiLang] = useState<'english' | 'hinglish'>(lang);
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedTaskId, setAppliedTaskId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text:
        aiLang === 'hinglish'
          ? 'Namaste! Main hoon aapka NEXUS AI Assistant. Study doubts (PCM, IP, Painting), daily timetable optimization, ya YouTube & Blog concepts me kaise help karoon?'
          : 'Welcome to NEXUS AI Assistant. I can assist with CBSE 12 conceptual breakdowns, smart schedule balancing, and gaming video or blog content strategies. How can I help today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = {
    study: [
      { en: "Explain Gauss's Law and its 2 applications in Hinglish", hi: "Gauss Law aur uski derivations Hinglish me explain karo" },
      { en: "5 high-yield CBSE board questions on Integration", hi: "Class 12 Math Integrals ke 5 important board questions do" },
      { en: "Explain Pandas DataFrame loc vs iloc with easy examples", hi: "IP: Pandas loc vs iloc ka difference simple code se samjhao" },
      { en: "Explain Maru Ragini painting key features (Painting 049)", hi: "Rajasthani school ki Maru Ragini painting ke key points batao" },
    ],
    productivity: [
      { en: "Break down an 8-hour Physics study plan for today", hi: "Aaj 4 ghante me Physics aur Chemistry kaise balance karein?" },
      { en: "Generate a realistic weekly review for Class 12 prep", hi: "Weekly board revision plan banao taaki backlogs na rahein" },
      { en: "How to balance YouTube uploads with CBSE board preparation?", hi: "Board exams aur YouTube video uploads ka time manage kaise karein?" },
    ],
    creator: [
      { en: "3 high-CTR titles for RTX 5080 gaming review", hi: "RTX 5080 hardware review ke liye 3 viral click-worthy titles do" },
      { en: "Thumbnail visual concept with high contrast for PC settings", hi: "Windows 11 FPS boost Short ke liye eye-catching thumbnail idea" },
      { en: "Blog outline for post-silicon 2nm architecture (NOVENTRA)", hi: "NOVENTRA blog ke liye 2nm chips par detailed technical outline do" },
    ],
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: prompt.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          prompt: prompt.trim(),
          language: aiLang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate AI response.');
      }

      // Check if response has suggested study task
      let suggestedTask: ChatMessage['suggestedTask'];
      if (context === 'productivity' || prompt.toLowerCase().includes('plan') || prompt.toLowerCase().includes('schedule')) {
        suggestedTask = {
          title: `Focus Session: ${prompt.slice(0, 35)}...`,
          durationMinutes: 60,
          type: 'study_session',
        };
      }

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTask,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Server connection failed.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `Error contacting Gemini AI: ${msg}\n\nNote: The rest of NEXUS DESK continues to work 100% offline. Ensure your GEMINI_API_KEY is configured in Settings > Secrets.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplySuggestedTask = (msgId: string, task: NonNullable<ChatMessage['suggestedTask']>) => {
    if (onAddTaskToPlanner) {
      onAddTaskToPlanner({
        title: task.title,
        type: task.type,
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        durationMinutes: task.durationMinutes,
        completed: false,
        priority: 'high',
        notes: 'Generated via Gemini Assistant',
        aiSuggested: true,
      });
      setAppliedTaskId(msgId);
      setTimeout(() => setAppliedTaskId(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl h-full bg-[#0B1222] border-l border-slate-800 flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  NEXUS Gemini Assistant
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/60">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Secure server-side AI with approval gate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <button
              onClick={() => setAiLang(aiLang === 'english' ? 'hinglish' : 'english')}
              className="px-2 py-1 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded transition-colors"
              title="Toggle English / Hinglish Output"
            >
              {aiLang === 'english' ? 'English' : 'Hinglish'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Specialized Context Bar */}
        <div className="p-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setContext('study')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              context === 'study'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Study Tutor</span>
          </button>

          <button
            onClick={() => setContext('productivity')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              context === 'productivity'
                ? 'bg-amber-950 text-amber-300 border border-amber-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Productivity</span>
          </button>

          <button
            onClick={() => setContext('creator')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              context === 'creator'
                ? 'bg-purple-950 text-purple-300 border border-purple-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>Creator Desk</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-xl space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white font-medium rounded-br-xs'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-sans">
                  {msg.text}
                </div>

                {/* AI Approval Gate: Suggested Task Button */}
                {msg.suggestedTask && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-cyan-400">
                      Suggested: {msg.suggestedTask.durationMinutes}m Study Block
                    </span>

                    <button
                      onClick={() => handleApplySuggestedTask(msg.id, msg.suggestedTask!)}
                      disabled={appliedTaskId === msg.id}
                      className="px-2.5 py-1 rounded text-[11px] font-medium bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      {appliedTaskId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Added to Planner!</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3 h-3" />
                          <span>Approve & Add</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500 font-mono">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-slate-300 transition-colors flex items-center gap-0.5"
                    title="Copy text"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Gemini is generating response...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {quickPrompts[context].map((qp, idx) => {
              const text = aiLang === 'hinglish' ? qp.hi : qp.en;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(text)}
                  className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/80 transition-colors shrink-0"
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                aiLang === 'hinglish'
                  ? 'Apna question ya topic likhein (e.g. Gauss Law proof)...'
                  : 'Type your study doubt, timetable goal, or creator topic...'
              }
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-sans"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
