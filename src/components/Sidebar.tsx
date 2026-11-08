import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Timer,
  Video,
  FileEdit,
  FolderOpen,
  Database,
  Building2,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { WorkspaceView, Language, AcademicProfile } from '../types';
import { t } from '../utils/translations';

interface SidebarProps {
  currentView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  activeProfile: AcademicProfile;
  lang: Language;
  onOpenAI: () => void;
  inProgressChaptersCount: number;
  pendingTasksCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  activeProfile,
  lang,
  onOpenAI,
  inProgressChaptersCount,
  pendingTasksCount,
  isCollapsed: externalCollapsed,
  onToggleCollapse: externalToggle,
}) => {
  // Support either controlled or local state
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (externalToggle) {
      externalToggle();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const navItems = [
    {
      id: 'dashboard' as WorkspaceView,
      label: t('nav_dashboard', lang),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'study' as WorkspaceView,
      label: t('nav_study', lang),
      icon: GraduationCap,
      badge: inProgressChaptersCount > 0 ? inProgressChaptersCount : null,
      badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-800/80',
    },
    {
      id: 'planner' as WorkspaceView,
      label: t('nav_planner', lang),
      icon: CalendarDays,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800/80',
    },
    {
      id: 'focus' as WorkspaceView,
      label: t('nav_focus', lang),
      icon: Timer,
      badge: null,
    },
    {
      id: 'youtube' as WorkspaceView,
      label: t('nav_youtube', lang),
      icon: Video,
      sublabel: 'High-tech',
    },
    {
      id: 'blogs' as WorkspaceView,
      label: t('nav_blogs', lang),
      icon: FileEdit,
      sublabel: 'NOVENTRA · IQ',
    },
    {
      id: 'notes' as WorkspaceView,
      label: t('nav_notes', lang),
      icon: FolderOpen,
      badge: null,
    },
    {
      id: 'college' as WorkspaceView,
      label: t('nav_college', lang),
      icon: Building2,
      badge: null,
    },
    {
      id: 'backup' as WorkspaceView,
      label: t('nav_backup', lang),
      icon: Database,
      badge: null,
    },
  ];

  return (
    <aside
      className={`shrink-0 flex flex-col h-screen bg-[#0B1222] border-r border-slate-800/80 select-none transition-all duration-200 z-30 ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header & Collapse Toggle */}
      <div className="p-3.5 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              onClick={() => onSelectView('dashboard')}
              title="NEXUS DESK Dashboard"
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
            >
              <span className="font-mono font-bold text-base text-white tracking-wider">N</span>
            </div>

            {!isCollapsed && (
              <div className="truncate">
                <span className="font-bold text-slate-100 text-sm tracking-wider font-mono block">
                  NEXUS DESK
                </span>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {activeProfile.name}
                </p>
              </div>
            )}
          </div>

          {/* Toggle Collapse Button */}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Academic Session Strip (Expanded Only) */}
        {!isCollapsed && (
          <div className="mt-2.5 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Session</span>
            <span className="font-mono font-medium text-cyan-400">{activeProfile.sessionYear}</span>
          </div>
        )}
      </div>

      {/* Primary Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {!isCollapsed && (
          <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Workspaces
          </div>
        )}

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onSelectView(item.id)}
                title={item.label}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
                } text-xs font-medium rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : 'truncate'}`}>
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && (
                    <div className="truncate">
                      <span className="block truncate">{item.label}</span>
                      {item.sublabel && (
                        <span className="block text-[10px] text-slate-400 truncate -mt-0.5">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {!isCollapsed && item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      item.badgeColor || 'text-slate-300 bg-slate-800 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Dot Indicator */}
                {isCollapsed && item.badge !== null && item.badge !== undefined && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </button>

              {/* Floating Tooltip in Collapsed Mode */}
              {isCollapsed && (
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-xs font-medium text-slate-100 rounded-md shadow-xl whitespace-nowrap z-50 transition-opacity duration-150 flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.sublabel && (
                    <span className="text-[10px] text-slate-400">({item.sublabel})</span>
                  )}
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="text-[10px] font-mono text-cyan-400">[{item.badge}]</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* AI Assistant Quick Trigger Banner */}
      <div className="p-2.5 border-t border-slate-800/80 space-y-2">
        <div className="relative group">
          <button
            onClick={onOpenAI}
            title={t('ask_ai', lang)}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
            } rounded-lg bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border border-cyan-800/50 text-cyan-300 hover:border-cyan-500/60 transition-all text-xs font-medium group`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform shrink-0" />
              {!isCollapsed && <span>{t('ask_ai', lang)}</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] text-cyan-400/80 font-mono">Gemini 3.8</span>
            )}
          </button>

          {isCollapsed && (
            <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-xs font-medium text-cyan-300 rounded-md shadow-xl whitespace-nowrap z-50 transition-opacity duration-150">
              {t('ask_ai', lang)} (Gemini 3.8)
            </div>
          )}
        </div>

        {/* Offline & Desktop Status */}
        <div
          className={`flex items-center ${
            isCollapsed ? 'justify-center py-1' : 'justify-between px-1 pt-1'
          } text-[11px] text-slate-400`}
          title="Storage: IndexedDB Local (100% Offline Capable)"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
            {!isCollapsed && <span>IndexedDB Local</span>}
          </span>
          {!isCollapsed && <span className="font-mono text-[10px] text-slate-400">v1.0 Win</span>}
        </div>
      </div>
    </aside>
  );
};
