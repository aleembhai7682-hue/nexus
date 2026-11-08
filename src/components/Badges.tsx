import React from 'react';
import { AlertCircle, Clock, BookOpen, Sparkles } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const isHigh = priority === 'high';
  const isMedium = priority === 'medium';

  const baseClasses = size === 'sm'
    ? 'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 uppercase tracking-wider'
    : 'text-xs font-mono font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shrink-0 uppercase tracking-wider';

  if (isHigh) {
    return (
      <span className={`${baseClasses} bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-950/20`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        HIGH
      </span>
    );
  }

  if (isMedium) {
    return (
      <span className={`${baseClasses} bg-amber-500/15 text-amber-300 border border-amber-500/30`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        MED
      </span>
    );
  }

  return (
    <span className={`${baseClasses} bg-slate-500/15 text-slate-300 border border-slate-500/30`}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      LOW
    </span>
  );
};

interface CategoryBadgeProps {
  type: 'study_session' | 'chapter_deadline' | 'exam' | 'revision' | 'custom_task' | string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ type, size = 'sm' }) => {
  const baseClasses = size === 'sm'
    ? 'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 uppercase tracking-wider whitespace-nowrap'
    : 'text-xs font-mono font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shrink-0 uppercase tracking-wider whitespace-nowrap';

  switch (type) {
    case 'study_session':
      return (
        <span className={`${baseClasses} bg-cyan-500/15 text-cyan-300 border border-cyan-500/30`}>
          <BookOpen className="w-2.5 h-2.5" />
          STUDY SESSION
        </span>
      );
    case 'revision':
      return (
        <span className={`${baseClasses} bg-violet-500/15 text-violet-300 border border-violet-500/30`}>
          <Sparkles className="w-2.5 h-2.5" />
          REVISION
        </span>
      );
    case 'exam':
      return (
        <span className={`${baseClasses} bg-amber-500/15 text-amber-300 border border-amber-500/30`}>
          <AlertCircle className="w-2.5 h-2.5" />
          BOARD EXAM
        </span>
      );
    case 'chapter_deadline':
      return (
        <span className={`${baseClasses} bg-orange-500/15 text-orange-300 border border-orange-500/30`}>
          <Clock className="w-2.5 h-2.5" />
          DEADLINE
        </span>
      );
    case 'custom_task':
    default:
      return (
        <span className={`${baseClasses} bg-blue-500/15 text-blue-300 border border-blue-500/30`}>
          TASK
        </span>
      );
  }
};

interface ProgressRingProps {
  percent: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percent,
  color = '#06B6D4',
  size = 46,
  strokeWidth = 4,
  showText = true,
}) => {
  const safePercent = Math.min(Math.max(percent, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safePercent / 100) * circumference;

  return (
    <div className="relative shrink-0 flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800/80 fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="fill-none transition-all duration-700 ease-out"
        />
      </svg>
      {showText && (
        <span className="absolute text-[10px] font-mono font-bold text-slate-200">
          {safePercent}%
        </span>
      )}
    </div>
  );
};
