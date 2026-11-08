import React from 'react';
import {
  Sun,
  Moon,
  Languages,
  Sparkles,
  Database,
  Search,
  ChevronRight,
} from 'lucide-react';
import { WorkspaceView, Language, Theme } from '../types';
import { t } from '../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  currentView: WorkspaceView;
  lang: Language;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenAI: () => void;
  onOpenBackup: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  onOpenAI,
  onOpenBackup,
  searchQuery,
  onSearchChange,
}) => {
  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return t('nav_dashboard', lang);
      case 'study':
        return `${t('nav_study', lang)} · CBSE 12`;
      case 'planner':
        return t('nav_planner', lang);
      case 'focus':
        return t('nav_focus', lang);
      case 'youtube':
        return 'YouTube Studio';
      case 'blogs':
        return 'Blog Studio';
      case 'notes':
        return t('nav_notes', lang);
      case 'college':
        return t('nav_college', lang);
      case 'backup':
        return t('nav_backup', lang);
      default:
        return 'NEXUS DESK';
    }
  };

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#0B1222]/90 backdrop-blur-md px-6 flex items-center justify-between gap-6 shrink-0 select-none">
      {/* Zone 1: Breadcrumb Title */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-mono font-bold text-cyan-400">NEXUS</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <h1 className="text-sm font-semibold text-slate-100 tracking-tight whitespace-nowrap">
          {getBreadcrumbTitle()}
        </h1>
      </div>

      {/* Zone 2: Central Search Action Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-auto">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chapters, topics, tasks, notes..."
            className="w-full bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-400 pl-8 pr-12 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 px-1 py-0.2 rounded bg-slate-800/60 border border-slate-700/60 pointer-events-none">
            Ctrl+K
          </span>
        </div>
      </div>

      {/* Zone 3: Unified Action Bar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Date Display */}
        <span className="hidden xl:inline-flex items-center text-[11px] font-mono text-slate-400 px-2.5 py-1 bg-slate-900/60 rounded-md border border-slate-800/80">
          {todayStr}
        </span>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Backup Quick Button */}
        <button
          onClick={onOpenBackup}
          title="Backup & Restore JSON Data"
          className="h-8 px-2.5 flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[11px]">Backup</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={onToggleLang}
          title={`Switch language (Current: ${lang.toUpperCase()})`}
          className="h-8 flex items-center gap-1.5 px-2.5 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
        >
          <Languages className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lang === 'english' ? 'EN' : 'HI-EN'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={`Switch theme (Current: ${theme})`}
          className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 border border-slate-800/80 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Gemini AI Assistant Button */}
        <button
          onClick={onOpenAI}
          title="Open Gemini AI Assistant"
          className="h-8 flex items-center gap-1.5 px-3 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-sm transition-all shadow-cyan-900/30 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>{t('ask_ai', lang)}</span>
        </button>
      </div>
    </header>
  );
};
