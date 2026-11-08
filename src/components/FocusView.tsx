import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Sliders,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { FocusSession, Subject, Chapter, Language } from '../types';
import { t } from '../utils/translations';

interface FocusViewProps {
  subjects: Subject[];
  chapters: Chapter[];
  focusSessions: FocusSession[];
  onCompleteSession: (session: Omit<FocusSession, 'id'>) => void;
  lang: Language;
}

export const FocusView: React.FC<FocusViewProps> = ({
  subjects,
  chapters,
  focusSessions,
  onCompleteSession,
  lang,
}) => {
  const [timerMode, setTimerMode] = useState<'25_5' | '50_10' | 'custom'>('25_5');
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Time remaining in seconds
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialDurationSeconds, setInitialDurationSeconds] = useState(25 * 60);

  // Custom durations (minutes)
  const [customWorkMinutes, setCustomWorkMinutes] = useState(30);
  const [customBreakMinutes, setCustomBreakMinutes] = useState(5);

  // Linkage
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState('');

  // Audio tone option
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filtered chapters for current selected subject
  const currentSubjectChapters = chapters.filter((c) => c.subjectId === selectedSubjectId);

  // Sound chime synthesizer (native Web Audio API, zero external file dependency)
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext muted/unsupported
    }
  };

  // Switch timer presets
  const handleSelectMode = (mode: '25_5' | '50_10' | 'custom') => {
    setIsRunning(false);
    setIsBreak(false);
    setTimerMode(mode);

    let secs = 25 * 60;
    if (mode === '50_10') secs = 50 * 60;
    if (mode === 'custom') secs = customWorkMinutes * 60;

    setTimeLeft(secs);
    setInitialDurationSeconds(secs);
  };

  // Timer interval effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playChime();
      setIsRunning(false);

      if (!isBreak) {
        // Complete Work Session
        const durationMin = Math.round(initialDurationSeconds / 60);
        onCompleteSession({
          timestamp: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0],
          durationMinutes: durationMin,
          mode: timerMode,
          subjectId: selectedSubjectId || undefined,
          chapterId: selectedChapterId || undefined,
          completed: true,
          notes: sessionNotes.trim() || undefined,
        });

        // Switch to Break
        setIsBreak(true);
        let breakSecs = 5 * 60;
        if (timerMode === '50_10') breakSecs = 10 * 60;
        if (timerMode === 'custom') breakSecs = customBreakMinutes * 60;
        setTimeLeft(breakSecs);
        setInitialDurationSeconds(breakSecs);
      } else {
        // End of Break -> Back to Work session
        setIsBreak(false);
        let workSecs = 25 * 60;
        if (timerMode === '50_10') workSecs = 50 * 60;
        if (timerMode === 'custom') workSecs = customWorkMinutes * 60;
        setTimeLeft(workSecs);
        setInitialDurationSeconds(workSecs);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, initialDurationSeconds, timerMode, selectedSubjectId, selectedChapterId, sessionNotes, customBreakMinutes, customWorkMinutes, onCompleteSession]);

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    let secs = 25 * 60;
    if (timerMode === '50_10') secs = 50 * 60;
    if (timerMode === 'custom') secs = customWorkMinutes * 60;
    setTimeLeft(secs);
    setInitialDurationSeconds(secs);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressRatio = initialDurationSeconds > 0 ? (initialDurationSeconds - timeLeft) / initialDurationSeconds : 0;

  // Calculate historical focus stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSessions = focusSessions.filter((s) => s.date === todayStr);
  const totalMinutesToday = todaysSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  // SVG circular radius math
  const strokeDashoffset = 440 - 440 * progressRatio;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900/95 via-[#0A1628] to-slate-900/95 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>DEEP WORK & CALM FOCUS</span>
            <span>·</span>
            <span>ZERO DISTRACTIONS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            {t('focus_headline', lang)}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pomodoro cycles designed for CBSE problem solving and creator deep sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            <span>Chime {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Focus Control Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Big Timer Dial & Controls (7 cols) */}
        <div className="md:col-span-7 rounded-2xl bg-[#0B1222] border border-slate-800/80 p-6 flex flex-col items-center justify-center space-y-6">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => handleSelectMode('25_5')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                timerMode === '25_5'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>25/5 Pomodoro</span>
            </button>

            <button
              onClick={() => handleSelectMode('50_10')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                timerMode === '50_10'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>50/10 Deep Work</span>
            </button>

            <button
              onClick={() => handleSelectMode('custom')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                timerMode === 'custom'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom</span>
            </button>
          </div>

          {/* Circular Timer Visual Display */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-900"
                fill="none"
              />
              {/* Animated Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={isBreak ? '#34D399' : '#06B6D4'}
                strokeWidth="8"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                fill="none"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-[11px] font-mono tracking-widest uppercase mb-1 ${isBreak ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {isBreak ? 'Break Time' : 'Focus Session'}
              </span>
              <span className="text-5xl font-bold font-mono tracking-tight text-slate-100 tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] text-slate-400 mt-2 font-mono">
                {isBreak ? 'Rest eyes & hydrate' : 'Stay on one task'}
              </span>
            </div>
          </div>

          {/* Primary Action Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-3 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/50'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Linkage & Session Log (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          {/* Tagging / Subject Association */}
          <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Session Association
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Link to CBSE Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedChapterId('');
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} (Code {sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Link to Chapter (Optional)
              </label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- No specific chapter --</option>
                {currentSubjectChapters.map((chap) => (
                  <option key={chap.id} value={chap.id}>
                    Ch {chap.chapterNumber}: {chap.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Session Focus Intention
              </label>
              <input
                type="text"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="e.g. Solving NCERT Questions 1.1 to 1.8"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Today's Focus Summary Card */}
          <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Focused Today</span>
              <span className="font-mono text-cyan-400 font-bold text-sm tabular-nums">
                {totalMinutesToday} mins
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Sessions Completed Today</span>
              <span className="font-mono text-slate-200 font-semibold tabular-nums">
                {todaysSessions.length}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
                Recent Completed Sessions
              </span>
              {focusSessions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No completed sessions logged yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {focusSessions.slice(0, 4).map((s) => {
                    const sub = subjects.find((sub) => sub.id === s.subjectId);
                    return (
                      <div
                        key={s.id}
                        className="p-2 rounded bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between"
                      >
                        <div className="truncate">
                          <span className="font-medium text-slate-200 truncate block">
                            {s.notes || (sub ? `${sub.name} Study` : 'Deep Work Session')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {s.date} · {s.mode.replace('_', '/')}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 shrink-0 font-medium">
                          +{s.durationMinutes}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
