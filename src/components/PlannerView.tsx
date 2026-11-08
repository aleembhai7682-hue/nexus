import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Sparkles,
  CalendarDays,
  ListTodo,
  Edit2,
} from 'lucide-react';
import { StudyTask, Subject, Language } from '../types';
import { t } from '../utils/translations';
import { PriorityBadge, CategoryBadge } from './Badges';

interface PlannerViewProps {
  tasks: StudyTask[];
  subjects: Subject[];
  onAddTask: (task: Omit<StudyTask, 'id'>) => void;
  onUpdateTask: (task: StudyTask) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  lang: Language;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  tasks,
  subjects,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  lang,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<StudyTask | null>(null);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<StudyTask['type']>('study_session');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = useState('16:00');
  const [taskDuration, setTaskDuration] = useState(60);
  const [taskSubjectId, setTaskSubjectId] = useState(subjects[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState<StudyTask['priority']>('medium');
  const [taskNotes, setTaskNotes] = useState('');

  // AI suggestions list (safe suggestions requiring approval)
  const [aiSuggestions, setAiSuggestions] = useState<
    { title: string; type: StudyTask['type']; durationMinutes: number; reason: string }[]
  >([
    {
      title: 'Physics: Ray Optics Prism Formula & Telescope Derivations',
      type: 'study_session',
      durationMinutes: 75,
      reason: 'High board exam weightage; not revised recently',
    },
    {
      title: 'Chemistry: Electrochemistry Nernst Equation Practice',
      type: 'revision',
      durationMinutes: 60,
      reason: 'Frequent numerical question in Section C',
    },
    {
      title: 'IP: SQL GROUP BY & HAVING Practice Test',
      type: 'study_session',
      durationMinutes: 45,
      reason: 'Direct scoring section for board exams',
    },
  ]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(formatted);
  };

  const openAddTaskForDate = (dateStr: string) => {
    setTaskToEdit(null);
    setSelectedDateStr(dateStr);
    setTaskDate(dateStr);
    setTaskTitle('');
    setTaskNotes('');
    setTaskDuration(60);
    setTaskTime('16:00');
    setTaskType('study_session');
    setTaskPriority('medium');
    setTaskSubjectId(subjects[0]?.id || '');
    setShowAddModal(true);
  };

  const openEditTask = (task: StudyTask) => {
    setTaskToEdit(task);
    setSelectedDateStr(task.date);
    setTaskDate(task.date);
    setTaskTitle(task.title);
    setTaskType(task.type);
    setTaskTime(task.time || '16:00');
    setTaskDuration(task.durationMinutes);
    setTaskSubjectId(task.subjectId || subjects[0]?.id || '');
    setTaskPriority(task.priority);
    setTaskNotes(task.notes || '');
    setShowAddModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (taskToEdit) {
      onUpdateTask({
        ...taskToEdit,
        title: taskTitle.trim(),
        type: taskType,
        date: taskDate,
        time: taskTime,
        durationMinutes: Number(taskDuration) || 60,
        subjectId: taskSubjectId || undefined,
        priority: taskPriority,
        notes: taskNotes.trim() || undefined,
      });
      setTaskToEdit(null);
    } else {
      onAddTask({
        title: taskTitle.trim(),
        type: taskType,
        date: taskDate,
        time: taskTime,
        durationMinutes: Number(taskDuration) || 60,
        subjectId: taskSubjectId || undefined,
        completed: false,
        priority: taskPriority,
        notes: taskNotes.trim() || undefined,
      });
    }

    setShowAddModal(false);
  };

  // Safe approval of AI suggestion
  const handleApplyAISuggestion = (suggestion: typeof aiSuggestions[0]) => {
    onAddTask({
      title: suggestion.title,
      type: suggestion.type,
      date: selectedDateStr,
      time: '17:00',
      durationMinutes: suggestion.durationMinutes,
      subjectId: subjects[0]?.id,
      completed: false,
      priority: 'high',
      notes: `Suggested by AI: ${suggestion.reason}`,
      aiSuggested: true,
    });

    // Remove from pending list
    setAiSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
  };

  // Filter tasks for selected date
  const selectedDateTasks = tasks.filter((t) => t.date === selectedDateStr);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900/95 via-[#0B1528] to-slate-900/95 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>SMART TIMETABLE & CALENDAR</span>
            <span>·</span>
            <span>CBSE 12 BOARD PACING</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Interactive Daily & Monthly Planner
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any calendar day to schedule study sessions, deadlines, or revision milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Month / Week / Day Switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'month' ? 'Month' : mode === 'week' ? 'Week' : 'Day'}
              </button>
            ))}
          </div>

          <button
            onClick={() => openAddTaskForDate(selectedDateStr)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm shadow-cyan-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Layout: 7 Cols Calendar Grid + 5 Cols Daily Agenda & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Calendar Grid */}
        <div className="lg:col-span-7 rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-4">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
              {monthNames[month]} {year}
            </h3>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDateStr(new Date().toISOString().split('T')[0]);
                }}
                className="px-2 py-1 text-xs font-mono text-cyan-400 hover:bg-slate-800 rounded"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono font-medium text-slate-400 pb-2 border-b border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 rounded-lg bg-slate-900/20 border border-transparent" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dayDateStr;
              const isToday = new Date().toISOString().split('T')[0] === dayDateStr;

              // Tasks on this day
              const dayTasks = tasks.filter((t) => t.date === dayDateStr);

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  onDoubleClick={() => openAddTaskForDate(dayDateStr)}
                  className={`h-20 p-1.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-sm shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                      : isToday
                      ? 'bg-slate-900/90 border-cyan-500/50'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isToday ? 'text-cyan-400' : isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task Indicators */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => {
                      const subject = subjects.find((s) => s.id === t.subjectId);
                      return (
                        <div
                          key={t.id}
                          className="text-[10px] truncate px-1 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: subject?.color || '#38BDF8' }}
                          />
                          <span className="truncate">{t.title}</span>
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <div className="text-[9px] text-slate-400 pl-1 font-mono">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-xs text-slate-400 font-mono text-center">
            Double click any day to quickly add a study session or deadline.
          </div>
        </div>

        {/* Right Column: Selected Day Agenda & AI Suggestions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selected Date Agenda */}
          <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase">
                  Daily Agenda
                </span>
                <h3 className="text-sm font-bold text-slate-100">
                  {selectedDateStr}
                </h3>
              </div>
              <button
                onClick={() => openAddTaskForDate(selectedDateStr)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900 rounded"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {selectedDateTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                <p>No study tasks scheduled for {selectedDateStr}.</p>
                <button
                  onClick={() => openAddTaskForDate(selectedDateStr)}
                  className="mt-2 text-cyan-400 hover:underline font-medium inline-block"
                >
                  Schedule first session
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {selectedDateTasks.map((task) => {
                  const subject = subjects.find((s) => s.id === task.subjectId);

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                        task.completed
                          ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                          : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <button
                          onClick={() => onToggleComplete(task.id)}
                          className="shrink-0 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600 hover:border-cyan-400" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div
                            onClick={() => openEditTask(task)}
                            className={`text-xs font-medium cursor-pointer hover:text-cyan-300 truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}
                            title={task.title}
                          >
                            {task.title}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                            {subject && (
                              <span style={{ color: subject.color }} className="font-medium shrink-0">
                                {subject.name}
                              </span>
                            )}
                            {task.time && (
                              <>
                                <span>·</span>
                                <span>{task.time}</span>
                              </>
                            )}
                            <span>·</span>
                            <span>{task.durationMinutes}m</span>
                          </div>

                          {task.notes && (
                            <p className="text-[11px] text-slate-400 mt-0.5 italic truncate" title={task.notes}>
                              {task.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <CategoryBadge type={task.type} size="sm" />
                        <PriorityBadge priority={task.priority} size="sm" />

                        <div className="flex items-center ml-1 border-l border-slate-800 pl-1.5">
                          <button
                            onClick={() => openEditTask(task)}
                            className="p-1 text-slate-400 hover:text-cyan-400 rounded transition-colors"
                            title="Edit & Reschedule Task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Smart Planner Recommendations (Approval Pattern) */}
          <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-mono uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Schedule Suggestions
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Requires Approval
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Gemini analyzed your Class 12 CBSE progress and recommends these high-impact study blocks:
            </p>

            <div className="space-y-2">
              {aiSuggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-slate-100">
                      {sug.title}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                      {sug.durationMinutes}m
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    Reason: {sug.reason}
                  </p>
                  <button
                    onClick={() => handleApplyAISuggestion(sug)}
                    className="w-full py-1 text-xs font-medium text-cyan-300 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/70 rounded transition-colors"
                  >
                    Approve & Add to {selectedDateStr}
                  </button>
                </div>
              ))}
              {aiSuggestions.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">
                  All current AI study suggestions approved and added.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add or Edit Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0B1222] border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-100">
              {taskToEdit ? 'Edit & Reschedule Study Task' : `Schedule Study Task for ${taskDate}`}
            </h3>

            <form onSubmit={handleSaveTask} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Chemistry: Nernst Equation Numericals"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Task Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as StudyTask['type'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="study_session">Study Session</option>
                    <option value="chapter_deadline">Chapter Deadline</option>
                    <option value="exam">Pre-Board / Exam</option>
                    <option value="revision">Revision Cycle</option>
                    <option value="custom_task">Custom Task</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subject Link
                  </label>
                  <select
                    value={taskSubjectId}
                    onChange={(e) => setTaskSubjectId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Duration (m)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={360}
                    step={15}
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(parseInt(e.target.value, 10) || 60)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as StudyTask['priority'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Task Notes & Focus Goal
                </label>
                <textarea
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="Target questions, derivations to practice, or page ranges..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
