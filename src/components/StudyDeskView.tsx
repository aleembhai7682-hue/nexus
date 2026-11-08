import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Undo2,
  Plus,
  ChevronRight,
  Timer,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
  FlaskConical,
  FileCheck2,
  Award,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';
import { Subject, Chapter, ChecklistItem, PracticalItem, Language } from '../types';
import { makeDefaultChecklistItems } from '../data/defaultSyllabus';
import { t } from '../utils/translations';
import { PriorityBadge } from './Badges';

interface StudyDeskViewProps {
  subjects: Subject[];
  chapters: Chapter[];
  practicals: PracticalItem[];
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (subjectId: string, title: string, estimatedHours: number) => void;
  onUpdatePractical: (practical: PracticalItem) => void;
  onStartFocusForChapter: (subjectId: string, chapterId: string) => void;
  onAskAIForChapter: (subjectName: string, chapterTitle: string) => void;
  lang: Language;
}

export const StudyDeskView: React.FC<StudyDeskViewProps> = ({
  subjects,
  chapters,
  practicals,
  onUpdateChapter,
  onAddChapter,
  onUpdatePractical,
  onStartFocusForChapter,
  onAskAIForChapter,
  lang,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || 'sub_physics'
  );
  const [activeTab, setActiveTab] = useState<'theory' | 'practicals'>('theory');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterHours, setNewChapterHours] = useState(6);
  const [completionCelebration, setCompletionCelebration] = useState<string | null>(null);

  // Custom Checklist Item State
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
  const [newChecklistLabel, setNewChecklistLabel] = useState('');

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectChapters = chapters.filter((c) => c.subjectId === selectedSubjectId);
  const subjectPracticals = practicals.filter((p) => p.subjectId === selectedSubjectId);

  // Status-filtered chapters
  const filteredChapters = subjectChapters.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const activeChapter =
    chapters.find((c) => c.id === activeChapterId) || filteredChapters[0] || subjectChapters[0];

  // Subject completion stats (theory)
  const completedCount = subjectChapters.filter((c) => c.status === 'completed').length;
  const inProgressCount = subjectChapters.filter((c) => c.status === 'in_progress').length;
  const totalSubjectChapters = subjectChapters.length;
  const subjectTheoryPercent = totalSubjectChapters > 0
    ? Math.round((completedCount / totalSubjectChapters) * 100)
    : 0;

  // Practical completion stats
  const completedPracticals = subjectPracticals.filter((p) => p.completed).length;
  const signedPracticals = subjectPracticals.filter((p) => p.teacherSigned).length;
  const totalSubjectPracticals = subjectPracticals.length;
  const subjectPracticalPercent = totalSubjectPracticals > 0
    ? Math.round((completedPracticals / totalSubjectPracticals) * 100)
    : 0;

  // Active chapter's checklist items (custom or default fallback)
  const activeChecklistItems: ChecklistItem[] = activeChapter
    ? activeChapter.customChecklist && activeChapter.customChecklist.length > 0
      ? activeChapter.customChecklist
      : makeDefaultChecklistItems(activeChapter.checklist)
    : [];

  // Toggle individual checklist item
  const handleToggleChecklistItem = (itemId: string) => {
    if (!activeChapter) return;

    const updatedItems = activeChecklistItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const allChecked = updatedItems.length > 0 && updatedItems.every((i) => i.completed);
    const anyChecked = updatedItems.some((i) => i.completed);

    let newStatus = activeChapter.status;
    let completedDate = activeChapter.completedDate;

    if (allChecked) {
      newStatus = 'completed';
      completedDate = new Date().toISOString().split('T')[0];
    } else if (anyChecked && activeChapter.status === 'not_started') {
      newStatus = 'in_progress';
    } else if (!allChecked && activeChapter.status === 'completed') {
      newStatus = 'in_progress';
      completedDate = undefined;
    }

    onUpdateChapter({
      ...activeChapter,
      customChecklist: updatedItems,
      status: newStatus,
      completedDate,
    });
  };

  // Add custom checklist item to active chapter
  const handleAddCustomChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChapter || !newChecklistLabel.trim()) return;

    const newItem: ChecklistItem = {
      id: `chk_${Date.now()}`,
      label: newChecklistLabel.trim(),
      completed: false,
      isDefault: false,
    };

    const updated = [...activeChecklistItems, newItem];
    onUpdateChapter({
      ...activeChapter,
      customChecklist: updated,
      status: activeChapter.status === 'completed' ? 'in_progress' : activeChapter.status,
    });

    setNewChecklistLabel('');
    setShowAddChecklistModal(false);
  };

  // Delete custom checklist item
  const handleDeleteChecklistItem = (itemId: string) => {
    if (!activeChapter) return;
    const updated = activeChecklistItems.filter((i) => i.id !== itemId);
    onUpdateChapter({
      ...activeChapter,
      customChecklist: updated,
    });
  };

  // Mark Chapter Complete button
  const handleMarkComplete = () => {
    if (!activeChapter) return;
    const allCheckedItems = activeChecklistItems.map((item) => ({ ...item, completed: true }));

    onUpdateChapter({
      ...activeChapter,
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
      customChecklist: allCheckedItems,
    });

    setCompletionCelebration(
      `Chapter ${activeChapter.chapterNumber}: "${activeChapter.title}" marked completed! Outstanding work.`
    );
    setTimeout(() => setCompletionCelebration(null), 4000);
  };

  // Undo Completion
  const handleUndoComplete = () => {
    if (!activeChapter) return;
    const reverted = activeChecklistItems.map((item) =>
      item.id === 'chk_final' ? { ...item, completed: false } : item
    );

    onUpdateChapter({
      ...activeChapter,
      status: 'in_progress',
      completedDate: undefined,
      customChecklist: reverted,
    });
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    onAddChapter(selectedSubjectId, newChapterTitle.trim(), Number(newChapterHours) || 6);
    setNewChapterTitle('');
    setShowAddModal(false);
  };

  // Group practicals by section
  const practicalSections = Array.from(new Set(subjectPracticals.map((p) => p.section)));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Academic Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900/95 via-[#0C152B] to-slate-900/95 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>OFFICIAL CBSE CLASS XII CURRICULUM</span>
            <span>·</span>
            <span>SESSION 2026–27</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Study Desk — Academic Command
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Physics (042: 70T+30P) · Chemistry (043: 70T+30P) · Mathematics (041: 80T+20I) · IP (065: 70T+30P) · Painting (049: 30T+70P)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-right">
            <div className="text-[11px] text-slate-400">Total CBSE Theory Chapters</div>
            <div className="text-sm font-mono font-bold text-cyan-300">
              {chapters.filter((c) => c.status === 'completed').length} / {chapters.length} Completed
            </div>
          </div>

          <div className="px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-lg text-right">
            <div className="text-[11px] text-slate-400">CBSE Lab Practicals</div>
            <div className="text-sm font-mono font-bold text-emerald-400">
              {practicals.filter((p) => p.completed).length} / {practicals.length} Performed
            </div>
          </div>
        </div>
      </div>

      {/* Completion Toast Notification */}
      {completionCelebration && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-lg text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{completionCelebration}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300">Target Score: 95%+</span>
        </div>
      )}

      {/* 5 Subject Tabs with Custom Color Borders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {subjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          const subChaps = chapters.filter((c) => c.subjectId === sub.id);
          const comp = subChaps.filter((c) => c.status === 'completed').length;
          const pct = subChaps.length > 0 ? Math.round((comp / subChaps.length) * 100) : 0;

          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubjectId(sub.id);
                const first = chapters.find((c) => c.subjectId === sub.id);
                if (first) setActiveChapterId(first.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/70 shadow-lg shadow-cyan-950/20'
                  : 'bg-[#0B1222] border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-[11px]" style={{ color: sub.color }}>
                  Code {sub.code}
                </span>
                <span className="font-mono text-[11px] text-slate-300 tabular-nums">
                  {pct}%
                </span>
              </div>
              <div className="font-semibold text-xs text-slate-100 truncate">
                {sub.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {sub.totalChapters} Ch · {sub.theoryMarks}T / {sub.practicalMarks}P
              </div>
              <div className="w-full bg-slate-800/90 h-1.5 rounded-full mt-2.5 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${sub.color}99, ${sub.color})`,
                    boxShadow: pct > 0 ? `0 0 6px ${sub.color}40` : 'none',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Subject Sub-tab: Theory Chapters vs Practicals & Labs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'theory'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              Theory Chapters ({subjectChapters.length}) · {currentSubject.theoryMarks} Marks
            </span>
          </button>

          {currentSubject.hasPracticals && (
            <button
              onClick={() => setActiveTab('practicals')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'practicals'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Practicals & Lab Work ({subjectPracticals.length}) · {currentSubject.practicalMarks} Marks
              </span>
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          {activeTab === 'theory'
            ? `${completedCount}/${totalSubjectChapters} Chapters Mastered (${subjectTheoryPercent}%)`
            : `${completedPracticals}/${totalSubjectPracticals} Practicals Done (${subjectPracticalPercent}%)`}
        </div>
      </div>

      {/* TAB CONTENT 1: THEORY CHAPTERS & CUSTOMIZABLE CHECKLISTS */}
      {activeTab === 'theory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Chapters Filter & List */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filter Bar & Add Chapter Button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                {(['all', 'in_progress', 'completed', 'not_started'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      statusFilter === filter
                        ? 'bg-slate-800 text-cyan-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter === 'all'
                      ? 'All'
                      : filter === 'in_progress'
                      ? 'In Progress'
                      : filter === 'completed'
                      ? 'Done'
                      : 'To Do'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="p-1.5 text-xs text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                title="Add Custom Chapter or Unit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Chapter</span>
              </button>
            </div>

            {/* Chapters Scrollable List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredChapters.map((chap) => {
                const isActive = activeChapter?.id === chap.id;
                const items = chap.customChecklist && chap.customChecklist.length > 0
                  ? chap.customChecklist
                  : makeDefaultChecklistItems(chap.checklist);
                const compItemsCount = items.filter((i) => i.completed).length;

                return (
                  <div
                    key={chap.id}
                    onClick={() => setActiveChapterId(chap.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive
                        ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/20'
                        : 'bg-[#0B1222] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-cyan-400 font-medium">
                          {String(chap.chapterNumber).padStart(2, '0')}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-100 leading-snug">
                          {chap.title}
                        </h4>
                      </div>
                      {chap.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                            chap.status === 'in_progress'
                              ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
                              : 'text-slate-400 bg-slate-900 border-slate-800'
                          }`}
                        >
                          {compItemsCount}/{items.length} done
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {chap.estimatedHours}h est
                        </span>
                        {chap.targetDate && (
                          <>
                            <span>·</span>
                            <span>Due {chap.targetDate}</span>
                          </>
                        )}
                      </div>
                      <PriorityBadge priority={chap.priority} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chapter Detail & Customizable Checklist */}
          <div className="lg:col-span-7 space-y-4">
            {activeChapter ? (
              <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-5">
                {/* Header: Title, Status, and Direct Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                      <span>{currentSubject.name.toUpperCase()}</span>
                      <span>·</span>
                      <span>CHAPTER {activeChapter.chapterNumber}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100">
                      {activeChapter.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <span className="font-mono">
                        Status:{' '}
                        <span
                          className={
                            activeChapter.status === 'completed'
                              ? 'text-emerald-400 font-semibold'
                              : 'text-cyan-300'
                          }
                        >
                          {activeChapter.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </span>
                      {activeChapter.completedDate && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-emerald-400">
                            Completed on {activeChapter.completedDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onStartFocusForChapter(activeChapter.subjectId, activeChapter.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-lg transition-colors"
                      title="Launch Pomodoro Timer tagged with this chapter"
                    >
                      <Timer className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Focus Timer</span>
                    </button>

                    <button
                      onClick={() => onAskAIForChapter(currentSubject.name, activeChapter.title)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-800/70 hover:bg-cyan-900 rounded-lg transition-colors"
                      title="Ask Gemini Study Assistant for explanations and questions"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Tutor</span>
                    </button>
                  </div>
                </div>

                {/* Customizable Mastery Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                      Customizable Chapter Checklist ({activeChecklistItems.filter((i) => i.completed).length}/{activeChecklistItems.length} steps)
                    </h4>

                    <button
                      onClick={() => setShowAddChecklistModal(true)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium font-mono"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Custom Step</span>
                    </button>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2">
                    {activeChecklistItems.map((item) => {
                      const isChecked = item.completed;

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                            isChecked
                              ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                              : 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-slate-700'
                          }`}
                        >
                          <div
                            onClick={() => handleToggleChecklistItem(item.id)}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <div className="shrink-0">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                              )}
                            </div>
                            <span className={`text-xs font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                              {item.label}
                            </span>
                          </div>

                          {!item.isDefault && (
                            <button
                              onClick={() => handleDeleteChecklistItem(item.id)}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                              title="Delete custom step"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verified Subtopics Breakdown */}
                {activeChapter.subtopics && activeChapter.subtopics.length > 0 && (
                  <div className="pt-3 border-t border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-2">
                      Verified Syllabus Subtopics (CBSE 2026–27)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeChapter.subtopics.map((sub, i) => (
                        <div
                          key={i}
                          className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5"
                        >
                          <span className="text-cyan-400 font-mono text-[10px] mt-0.5">
                            {i + 1}.
                          </span>
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal Notes Snippet for Chapter */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                    Chapter Quick Notes & Weak Points
                  </h4>
                  <textarea
                    value={activeChapter.personalNotes || ''}
                    onChange={(e) =>
                      onUpdateChapter({
                        ...activeChapter,
                        personalNotes: e.target.value,
                      })
                    }
                    placeholder="Record your formula revisions, tricky derivation steps, or NCERT doubts here (autosaves)..."
                    rows={3}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 font-mono"
                  />
                </div>

                {/* Mark Complete or Undo Controls */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  {activeChapter.status === 'completed' ? (
                    <button
                      onClick={handleUndoComplete}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('undo_complete', lang)}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleMarkComplete}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-md shadow-emerald-950/40"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('mark_complete', lang)}</span>
                    </button>
                  )}

                  <div className="text-[11px] text-slate-400 font-mono">
                    Priority: <span className="capitalize text-slate-200">{activeChapter.priority}</span> · {activeChapter.estimatedHours}h est
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                Select a chapter from the left to view its checklist and verified syllabus.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PRACTICALS & LAB WORK TRACKING */}
      {activeTab === 'practicals' && (
        <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <span>CBSE CLASS 12 LABORATORY CURRICULUM</span>
                <span>·</span>
                <span>{currentSubject.name.toUpperCase()} ({currentSubject.practicalMarks} MARKS)</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">
                Official CBSE Practical Experiments, Record Files & Viva
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track hands-on lab experiments, written practical notebooks, and teacher verification signatures.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="text-emerald-400 font-bold">{completedPracticals}</span> / {totalSubjectPracticals} Performed ·{' '}
                <span className="text-cyan-400 font-bold">{signedPracticals}</span> Certified
              </div>
            </div>
          </div>

          {/* Practical Sections */}
          <div className="space-y-6">
            {practicalSections.map((sectionName) => {
              const sectionPracticals = subjectPracticals.filter((p) => p.section === sectionName);

              return (
                <div key={sectionName} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {sectionName}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {sectionPracticals.filter((p) => p.completed).length} / {sectionPracticals.length} done
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sectionPracticals.map((prac) => (
                      <div
                        key={prac.id}
                        className={`p-4 rounded-xl border transition-all ${
                          prac.completed
                            ? 'bg-slate-900/40 border-slate-800/80'
                            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h5 className="text-xs font-bold text-slate-100 leading-snug">
                            {prac.title}
                          </h5>
                          {prac.marksWeightage && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 shrink-0">
                              {prac.marksWeightage} Marks
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                          {prac.aimOrDescription}
                        </p>

                        {/* Practical Action Checkboxes */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={prac.completed}
                              onChange={(e) =>
                                onUpdatePractical({
                                  ...prac,
                                  completed: e.target.checked,
                                })
                              }
                              className="rounded text-emerald-600 focus:ring-0 cursor-pointer"
                            />
                            <span className={`text-[11px] ${prac.completed ? 'text-emerald-300 font-medium' : 'text-slate-400'}`}>
                              Experiment Performed
                            </span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={prac.recordFileWritten}
                              onChange={(e) =>
                                onUpdatePractical({
                                  ...prac,
                                  recordFileWritten: e.target.checked,
                                })
                              }
                              className="rounded text-cyan-600 focus:ring-0 cursor-pointer"
                            />
                            <span className={`text-[11px] ${prac.recordFileWritten ? 'text-cyan-300 font-medium' : 'text-slate-400'}`}>
                              Record Written
                            </span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={prac.teacherSigned}
                              onChange={(e) =>
                                onUpdatePractical({
                                  ...prac,
                                  teacherSigned: e.target.checked,
                                })
                              }
                              className="rounded text-purple-600 focus:ring-0 cursor-pointer"
                            />
                            <span className={`text-[11px] ${prac.teacherSigned ? 'text-purple-300 font-medium' : 'text-slate-400'}`}>
                              Teacher Certified
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add Custom Chapter */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0B1222] border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-100">
              Add New Chapter / Unit to {currentSubject.name}
            </h3>
            <form onSubmit={handleCreateChapter} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Chapter / Unit Title
                </label>
                <input
                  type="text"
                  required
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="e.g. Modern Physics Numerical Practice"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Estimated Study Time (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={newChapterHours}
                  onChange={(e) => setNewChapterHours(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg"
                >
                  Add Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Checklist Step */}
      {showAddChecklistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0B1222] border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-100">
              Add Custom Step for "{activeChapter?.title}"
            </h3>
            <form onSubmit={handleAddCustomChecklistItem} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Checklist Step Description
                </label>
                <input
                  type="text"
                  required
                  value={newChecklistLabel}
                  onChange={(e) => setNewChecklistLabel(e.target.value)}
                  placeholder="e.g. HC Verma Exercise Q1-Q15 / PYQ 2024 Set 1"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChecklistModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg"
                >
                  Add Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
