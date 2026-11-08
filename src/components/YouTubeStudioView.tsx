import React, { useState } from 'react';
import {
  Video,
  Plus,
  Tv,
  Smartphone,
  CheckCircle2,
  ListTodo,
  FileText,
  Image,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { YouTubeItem, ContentStage, Language } from '../types';

interface YouTubeStudioViewProps {
  items: YouTubeItem[];
  onSaveItem: (item: YouTubeItem) => void;
  onDeleteItem: (id: string) => void;
  onAskCreatorAI: (channelName: string, title: string) => void;
  lang: Language;
}

export const YouTubeStudioView: React.FC<YouTubeStudioViewProps> = ({
  items,
  onSaveItem,
  onDeleteItem,
  onAskCreatorAI,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);
  const [formatFilter, setFormatFilter] = useState<'all' | 'long_form' | 'short'>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState<'long_form' | 'short'>('long_form');

  const STAGES: { id: ContentStage; label: string }[] = [
    { id: 'idea', label: '1. Idea' },
    { id: 'research', label: '2. Research' },
    { id: 'script', label: '3. Script' },
    { id: 'recording', label: '4. Recording' },
    { id: 'editing', label: '5. Editing' },
    { id: 'thumbnail', label: '6. Thumbnail' },
    { id: 'scheduled', label: '7. Scheduled' },
    { id: 'published', label: '8. Published' },
  ];

  const filteredItems = items.filter((item) => {
    if (formatFilter === 'all') return true;
    return item.format === formatFilter;
  });

  const activeItem = items.find((i) => i.id === selectedId) || filteredItems[0];

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: YouTubeItem = {
      id: `yt_${Date.now()}`,
      channelName: 'High-tech gamer',
      title: newTitle.trim(),
      format: newFormat,
      stage: 'idea',
      researchNotes: '',
      scriptContent: '',
      recordingChecklist: [
        { id: 'r1', task: 'Prepare recording space & lighting', done: false },
        { id: 'r2', task: 'Check mic levels & OBS bitrate', done: false },
      ],
      editingChecklist: [
        { id: 'e1', task: 'A-roll cut & jump cuts', done: false },
        { id: 'e2', task: 'B-roll benchmarks & graphics', done: false },
      ],
      thumbnailConcept: '',
      updatedAt: new Date().toISOString(),
    };

    onSaveItem(newItem);
    setSelectedId(newItem.id);
    setNewTitle('');
    setShowNewModal(false);
  };

  const handleToggleChecklist = (
    type: 'recording' | 'editing',
    checkId: string
  ) => {
    if (!activeItem) return;
    if (type === 'recording') {
      const updated = activeItem.recordingChecklist.map((c) =>
        c.id === checkId ? { ...c, done: !c.done } : c
      );
      onSaveItem({ ...activeItem, recordingChecklist: updated });
    } else {
      const updated = activeItem.editingChecklist.map((c) =>
        c.id === checkId ? { ...c, done: !c.done } : c
      );
      onSaveItem({ ...activeItem, editingChecklist: updated });
    }
  };

  const handleAddChecklistTask = (type: 'recording' | 'editing', taskText: string) => {
    if (!activeItem || !taskText.trim()) return;
    const newTask = { id: `chk_${Date.now()}`, task: taskText.trim(), done: false };
    if (type === 'recording') {
      onSaveItem({
        ...activeItem,
        recordingChecklist: [...activeItem.recordingChecklist, newTask],
      });
    } else {
      onSaveItem({
        ...activeItem,
        editingChecklist: [...activeItem.editingChecklist, newTask],
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900/95 via-[#130E26] to-slate-900/95 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>YOUTUBE CREATOR STUDIO</span>
            <span>·</span>
            <span>CHANNEL: HIGH-TECH GAMER</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            High-tech gamer Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full 8-stage production pipeline for long-form PC hardware reviews and gaming shorts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-sm shadow-purple-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Video Project</span>
          </button>
        </div>
      </div>

      {/* Stage Flow Indicator Strip */}
      <div className="p-3 bg-[#0B1222] border border-slate-800/80 rounded-xl overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {STAGES.map((s, idx) => {
            const count = items.filter((i) => i.stage === s.id).length;
            const isCurrentActive = activeItem?.stage === s.id;

            return (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (activeItem) {
                      onSaveItem({ ...activeItem, stage: s.id });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                    isCurrentActive
                      ? 'bg-purple-950 text-purple-300 border border-purple-700 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{s.label}</span>
                  {count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {count}
                    </span>
                  )}
                </button>
                {idx < STAGES.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-700 mx-1 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split: Video Pipeline List (4 cols) | Video Production Canvas (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Projects List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Format Filter */}
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {(['all', 'long_form', 'short'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  formatFilter === fmt
                    ? 'bg-slate-800 text-purple-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fmt === 'all' ? 'All Videos' : fmt === 'long_form' ? 'Long-Form' : 'Shorts'}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = activeItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500/80 shadow-md shadow-purple-950/20'
                      : 'bg-[#0B1222] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-purple-400 uppercase flex items-center gap-1">
                      {item.format === 'short' ? (
                        <>
                          <Smartphone className="w-3 h-3" />
                          Short (9:16)
                        </>
                      ) : (
                        <>
                          <Tv className="w-3 h-3" />
                          Video (16:9)
                        </>
                      )}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">
                      {item.stage}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-2">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                    <span>{item.channelName}</span>
                    {item.targetDate && <span>Target: {item.targetDate}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Production Workspace for Selected Video */}
        <div className="lg:col-span-8 space-y-4">
          {activeItem ? (
            <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-5">
              {/* Top Title & Stage Controls */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
                    <span>HIGH-TECH GAMER</span>
                    <span>·</span>
                    <span className="capitalize">{activeItem.format.replace('_', ' ')}</span>
                  </div>
                  <input
                    type="text"
                    value={activeItem.title}
                    onChange={(e) => onSaveItem({ ...activeItem, title: e.target.value })}
                    className="w-full bg-transparent font-bold text-base text-slate-100 border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none py-0.5"
                  />
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
                    <span>
                      Current Stage:{' '}
                      <select
                        value={activeItem.stage}
                        onChange={(e) =>
                          onSaveItem({ ...activeItem, stage: e.target.value as ContentStage })
                        }
                        className="bg-slate-900 border border-slate-800 text-purple-300 rounded px-1.5 py-0.5"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span>·</span>
                    <span>
                      Target:{' '}
                      <input
                        type="date"
                        value={activeItem.targetDate || ''}
                        onChange={(e) =>
                          onSaveItem({ ...activeItem, targetDate: e.target.value })
                        }
                        className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-1 py-0.5 text-[11px]"
                      />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskCreatorAI(activeItem.channelName, activeItem.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-950/80 border border-purple-800/70 hover:bg-purple-900 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Creator Assist</span>
                  </button>

                  <button
                    onClick={() => onDeleteItem(activeItem.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                    title="Delete Video Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Research Notes & Script Canvas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Research Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 uppercase">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    Research & Benchmarks
                  </label>
                  <textarea
                    value={activeItem.researchNotes}
                    onChange={(e) =>
                      onSaveItem({ ...activeItem, researchNotes: e.target.value })
                    }
                    placeholder="Hardware specs, 1% low benchmarks, driver versions, Reddit source links..."
                    rows={7}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                {/* Script Canvas */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 uppercase">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    Video Script Outline / Teleprompter
                  </label>
                  <textarea
                    value={activeItem.scriptContent}
                    onChange={(e) =>
                      onSaveItem({ ...activeItem, scriptContent: e.target.value })
                    }
                    placeholder="Hook (0:00-0:30): What everyone got wrong...&#10;Segment 1: The test bench setup...&#10;Call to Action..."
                    rows={7}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              {/* Thumbnail Concept Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 uppercase">
                  <Image className="w-3.5 h-3.5 text-cyan-400" />
                  Thumbnail Visual Concept & Text Overlay
                </label>
                <input
                  type="text"
                  value={activeItem.thumbnailConcept}
                  onChange={(e) =>
                    onSaveItem({ ...activeItem, thumbnailConcept: e.target.value })
                  }
                  placeholder="e.g. Split screen: Glowing RTX 5080 card with 'DON'T BUY YET' in bold yellow neon font."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Checklists: Recording Checklist & Editing Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                {/* Recording Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase">
                    Recording Checklist
                  </h4>
                  <div className="space-y-1.5">
                    {activeItem.recordingChecklist.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleChecklist('recording', task.id)}
                        className="p-2 rounded bg-slate-900/60 border border-slate-800/80 text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={task.done}
                          readOnly
                          className="rounded text-purple-600 focus:ring-0 cursor-pointer"
                        />
                        <span className={task.done ? 'line-through text-slate-400' : 'text-slate-200'}>
                          {task.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editing Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase">
                    Editing Checklist
                  </h4>
                  <div className="space-y-1.5">
                    {activeItem.editingChecklist.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleChecklist('editing', task.id)}
                        className="p-2 rounded bg-slate-900/60 border border-slate-800/80 text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={task.done}
                          readOnly
                          className="rounded text-purple-600 focus:ring-0 cursor-pointer"
                        />
                        <span className={task.done ? 'line-through text-slate-400' : 'text-slate-200'}>
                          {task.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Published URL Record (if published) */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Published URL:</span>
                  <input
                    type="text"
                    value={activeItem.videoUrl || ''}
                    onChange={(e) =>
                      onSaveItem({ ...activeItem, videoUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-64 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Last updated {new Date(activeItem.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
              No video selected. Click "New Video Project" to start an idea.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Video Project */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0B1222] border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-100">
              Create New High-tech gamer Video Project
            </h3>
            <form onSubmit={handleCreateNew} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Video / Short Working Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best Settings for RTX 5070 in 2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Video Format
                </label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value as 'long_form' | 'short')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="long_form">Long-Form Landscape (16:9)</option>
                  <option value="short">YouTube Short / Reel (9:16)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
