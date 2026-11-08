import React from 'react';
import {
  GraduationCap,
  CalendarCheck2,
  Timer,
  Video,
  ArrowRight,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  Subject,
  Chapter,
  PracticalItem,
  StudyTask,
  FocusSession,
  YouTubeItem,
  BlogPostItem,
  WorkspaceView,
  Language,
} from '../types';
import { t } from '../utils/translations';
import { PriorityBadge, CategoryBadge, ProgressRing } from './Badges';

interface DashboardViewProps {
  subjects: Subject[];
  chapters: Chapter[];
  practicals?: PracticalItem[];
  tasks: StudyTask[];
  focusSessions: FocusSession[];
  youtubeItems: YouTubeItem[];
  blogItems: BlogPostItem[];
  onNavigate: (view: WorkspaceView) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onOpenQuickTaskModal: () => void;
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  subjects,
  chapters,
  practicals = [],
  tasks,
  focusSessions,
  youtubeItems,
  blogItems,
  onNavigate,
  onToggleTaskComplete,
  onOpenQuickTaskModal,
  lang,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks for today
  const todaysTasks = tasks.filter((t) => t.date === todayStr);
  const pendingTasks = todaysTasks.filter((t) => !t.completed);
  const completedTasks = todaysTasks.filter((t) => t.completed);
  const taskCompletionRate = todaysTasks.length > 0
    ? Math.round((completedTasks.length / todaysTasks.length) * 100)
    : 0;

  // Focus time logged today
  const todaysFocusSessions = focusSessions.filter((s) => s.date === todayStr);
  const totalFocusMinutesToday = todaysFocusSessions.reduce(
    (acc, curr) => acc + (curr.durationMinutes || 0),
    0
  );
  // Target daily focus: 150 minutes
  const dailyFocusTargetMinutes = 150;
  const focusCompletionRate = Math.min(
    100,
    Math.round((totalFocusMinutesToday / dailyFocusTargetMinutes) * 100)
  );

  // Overall academic progress
  const totalChaptersCount = chapters.length;
  const completedChaptersCount = chapters.filter((c) => c.status === 'completed').length;
  const inProgressChaptersCount = chapters.filter((c) => c.status === 'in_progress').length;
  const overallAcademicPercent = totalChaptersCount > 0
    ? Math.round((completedChaptersCount / totalChaptersCount) * 100)
    : 0;

  // Practical stats
  const totalPracticalsCount = practicals.length;
  const completedPracticalsCount = practicals.filter((p) => p.completed).length;

  // Active creator pipelines
  const activeYTPipeline = youtubeItems.filter((y) => y.stage !== 'published');
  const publishedYTCount = youtubeItems.filter((y) => y.stage === 'published').length;
  const activeBlogPipeline = blogItems.filter((b) => b.stage !== 'published');
  const publishedBlogCount = blogItems.filter((b) => b.stage === 'published').length;
  const totalCreatorCount = youtubeItems.length + blogItems.length;
  const publishedCreatorCount = publishedYTCount + publishedBlogCount;
  const creatorProgressRate = totalCreatorCount > 0
    ? Math.round((publishedCreatorCount / totalCreatorCount) * 100)
    : (activeYTPipeline.length + activeBlogPipeline.length > 0 ? 40 : 0);

  // Urgent upcoming deadlines (tasks with priority 'high' or next 3 days)
  const upcomingDeadlines = tasks
    .filter((t) => !t.completed && t.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Actions Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900/90 via-[#0B1528] to-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>CBSE CLASS 12 · 2026–27</span>
            <span>·</span>
            <span>PCM + IP + PAINTING</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            NEXUS Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Today: {pendingTasks.length} pending tasks · {totalFocusMinutesToday} mins focused · {completedChaptersCount} of {totalChaptersCount} chapters · {completedPracticalsCount} of {totalPracticalsCount} practicals done
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenQuickTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('add_task', lang)}</span>
          </button>

          <button
            onClick={() => onNavigate('focus')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm shadow-cyan-900/40"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{t('start_session', lang)}</span>
          </button>
        </div>
      </div>

      {/* 4 Uniform SaaS KPI Cards with Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Board Exam Prep */}
        <div
          onClick={() => onNavigate('study')}
          className="p-4 rounded-xl bg-[#0B1222] border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all cursor-pointer group flex flex-col justify-between min-h-[136px]"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">Academic Completion</span>
            </div>
            <ProgressRing percent={overallAcademicPercent} color="#06B6D4" size={44} strokeWidth={3.5} />
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                {overallAcademicPercent}%
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">
                {completedChaptersCount}/{totalChaptersCount} Ch
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1">
              {completedPracticalsCount} of {totalPracticalsCount} lab experiments verified
            </p>
          </div>
        </div>

        {/* Metric 2: Today's Tasks */}
        <div
          onClick={() => onNavigate('planner')}
          className="p-4 rounded-xl bg-[#0B1222] border border-slate-800/80 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all cursor-pointer group flex flex-col justify-between min-h-[136px]"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">Today's Tasks</span>
            </div>
            <ProgressRing percent={taskCompletionRate} color="#F59E0B" size={44} strokeWidth={3.5} />
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                {pendingTasks.length}
              </span>
              <span className="text-[11px] text-amber-400 font-mono">
                pending
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1">
              {completedTasks.length} completed · {todaysTasks.length} total scheduled
            </p>
          </div>
        </div>

        {/* Metric 3: Focus Today */}
        <div
          onClick={() => onNavigate('focus')}
          className="p-4 rounded-xl bg-[#0B1222] border border-slate-800/80 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all cursor-pointer group flex flex-col justify-between min-h-[136px]"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Timer className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">Focus Time</span>
            </div>
            <ProgressRing percent={focusCompletionRate} color="#10B981" size={44} strokeWidth={3.5} />
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                {totalFocusMinutesToday}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                mins
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1">
              {todaysFocusSessions.length} sessions logged · Target: {dailyFocusTargetMinutes}m
            </p>
          </div>
        </div>

        {/* Metric 4: Creator Desks */}
        <div
          onClick={() => onNavigate('youtube')}
          className="p-4 rounded-xl bg-[#0B1222] border border-slate-800/80 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all cursor-pointer group flex flex-col justify-between min-h-[136px]"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Video className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300">Creator Pipeline</span>
            </div>
            <ProgressRing percent={creatorProgressRate} color="#A855F7" size={44} strokeWidth={3.5} />
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                {activeYTPipeline.length + activeBlogPipeline.length}
              </span>
              <span className="text-[11px] text-purple-400 font-mono">
                in pipeline
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1">
              {activeYTPipeline.length} YouTube · {activeBlogPipeline.length} Blogs active
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Left = Today's Timetable & Tasks; Right = Academic Progress & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Priorities & Timetable (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Priorities Card */}
          <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  {t('todays_priorities', lang)}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Open Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-lg">
                <p>No study tasks scheduled for today yet.</p>
                <button
                  onClick={onOpenQuickTaskModal}
                  className="mt-2 text-cyan-400 hover:underline font-medium inline-block"
                >
                  Schedule today's study session
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {todaysTasks.map((task) => {
                  const subject = subjects.find((s) => s.id === task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                        task.completed
                          ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                          : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => onToggleTaskComplete(task.id)}
                          className="shrink-0 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-600 hover:border-cyan-400" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`} title={task.title}>
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 truncate">
                            {subject && (
                              <span style={{ color: subject.color }} className="font-medium shrink-0">
                                {subject.name}
                              </span>
                            )}
                            {task.time && (
                              <>
                                <span>·</span>
                                <span className="font-mono">{task.time}</span>
                              </>
                            )}
                            <span>·</span>
                            <span className="font-mono">{task.durationMinutes}m</span>
                          </div>
                        </div>
                      </div>

                      {/* Redesigned Priority & Category Badge Pills */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {task.type && (
                          <CategoryBadge type={task.type} size="sm" />
                        )}
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Creator Workspaces Overview */}
          <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">
                Creator Desk Pipeline
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => onNavigate('youtube')}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  YouTube
                </button>
                <span className="text-slate-600">·</span>
                <button
                  onClick={() => onNavigate('blogs')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Blogs
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* YouTube Card */}
              <div
                onClick={() => onNavigate('youtube')}
                className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-medium text-slate-200">High-tech gamer</span>
                  <span className="font-mono text-purple-400">{activeYTPipeline.length} Active</span>
                </div>
                {youtubeItems[0] ? (
                  <div className="text-xs text-slate-300 truncate">
                    Next: <span className="text-slate-100">{youtubeItems[0].title}</span>
                    <span className="block text-[11px] text-purple-300/80 mt-0.5 capitalize">
                      Stage: {youtubeItems[0].stage}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No active video ideas</p>
                )}
              </div>

              {/* Blogs Card */}
              <div
                onClick={() => onNavigate('blogs')}
                className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-medium text-slate-200">NOVENTRA & Arena IQ</span>
                  <span className="font-mono text-cyan-400">{activeBlogPipeline.length} Active</span>
                </div>
                {blogItems[0] ? (
                  <div className="text-xs text-slate-300 truncate">
                    Next: <span className="text-slate-100">{blogItems[0].title}</span>
                    <span className="block text-[11px] text-cyan-300/80 mt-0.5 capitalize">
                      Stage: {blogItems[0].stage}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No active blog drafts</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 5 CBSE Subjects Mastery & Upcoming Deadlines (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 5 Subjects Progress Breakdown with Sleek Progress Bars */}
          <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  CBSE 12 Subject Mastery
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  5 Core Subjects · Board 2026–27
                </p>
              </div>
              <button
                onClick={() => onNavigate('study')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
              >
                <span>Study Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {subjects.map((sub) => {
                const subChapters = chapters.filter((c) => c.subjectId === sub.id);
                const subPracticals = practicals.filter((p) => p.subjectId === sub.id);
                const comp = subChapters.filter((c) => c.status === 'completed').length;
                const inProg = subChapters.filter((c) => c.status === 'in_progress').length;
                const completedLabs = subPracticals.filter((p) => p.completed).length;
                const pct = subChapters.length > 0
                  ? Math.round((comp / subChapters.length) * 100)
                  : 0;

                return (
                  <div
                    key={sub.id}
                    onClick={() => onNavigate('study')}
                    className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/90 cursor-pointer transition-all space-y-2 group"
                  >
                    {/* Top Row: Name + Target + Percentage */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {sub.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 border border-slate-700/60 text-slate-400">
                          Target: {sub.targetScore}%
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-200 tabular-nums">
                        {pct}%
                      </span>
                    </div>

                    {/* Sleek Visual Progress Bar */}
                    <div className="relative w-full bg-slate-800/90 h-2 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${sub.color}99, ${sub.color})`,
                          boxShadow: pct > 0 ? `0 0 10px ${sub.color}40` : 'none',
                        }}
                      />
                    </div>

                    {/* Bottom Metadata: Chapters and Labs */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{comp}/{subChapters.length} Chapters · {inProg} In Progress</span>
                      {subPracticals.length > 0 && (
                        <span>{completedLabs}/{subPracticals.length} Labs</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines & Key Dates with Redesigned Badges */}
          <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Upcoming Deadlines
              </h3>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                View planner
              </button>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No immediate deadlines in the next 7 days.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-200 truncate" title={task.title}>
                        {task.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Due: {task.date} {task.time ? `· ${task.time}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CategoryBadge type={task.type} size="sm" />
                      <PriorityBadge priority={task.priority} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
