import React, { useState } from 'react';
import {
  FileEdit,
  Plus,
  BookOpen,
  Tag,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { BlogPostItem, BlogStage, Language } from '../types';

interface BlogStudioViewProps {
  items: BlogPostItem[];
  onSaveItem: (item: BlogPostItem) => void;
  onDeleteItem: (id: string) => void;
  onAskCreatorAI: (blogName: string, title: string) => void;
  lang: Language;
}

export const BlogStudioView: React.FC<BlogStudioViewProps> = ({
  items,
  onSaveItem,
  onDeleteItem,
  onAskCreatorAI,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);
  const [blogFilter, setBlogFilter] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // New post state
  const [newBlogName, setNewBlogName] = useState('NOVENTRA');
  const [newTitle, setNewTitle] = useState('');

  const STAGES: { id: BlogStage; label: string }[] = [
    { id: 'idea', label: '1. Idea' },
    { id: 'research', label: '2. Research' },
    { id: 'outline', label: '3. Outline' },
    { id: 'draft', label: '4. Draft' },
    { id: 'editing', label: '5. Editing' },
    { id: 'ready', label: '6. Ready' },
    { id: 'published', label: '7. Published' },
  ];

  const uniqueBlogs = Array.from(new Set(items.map((i) => i.blogName).concat(['NOVENTRA', 'Arena IQ'])));

  const filteredItems = items.filter((item) => {
    if (blogFilter === 'all') return true;
    return item.blogName === blogFilter;
  });

  const activeItem = items.find((i) => i.id === selectedId) || filteredItems[0];

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BlogPostItem = {
      id: `blog_${Date.now()}`,
      blogName: newBlogName,
      title: newTitle.trim(),
      seoKeywords: ['tech', 'architecture'],
      metaDescription: '',
      stage: 'idea',
      outline: '',
      draftContent: '',
      editingChecklist: [
        { id: 'b1', task: 'Check technical accuracy and source citations', done: false },
        { id: 'b2', task: 'Optimize H2 headings with primary SEO keywords', done: false },
        { id: 'b3', task: 'Write meta description under 160 characters', done: false },
      ],
      updatedAt: new Date().toISOString(),
    };

    onSaveItem(newItem);
    setSelectedId(newItem.id);
    setNewTitle('');
    setShowNewModal(false);
  };

  const handleToggleChecklist = (checkId: string) => {
    if (!activeItem) return;
    const updated = activeItem.editingChecklist.map((c) =>
      c.id === checkId ? { ...c, done: !c.done } : c
    );
    onSaveItem({ ...activeItem, editingChecklist: updated });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900/95 via-[#0A1A22] to-slate-900/95 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>EDITORIAL DESK</span>
            <span>·</span>
            <span>PUBLICATIONS: NOVENTRA & ARENA IQ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Blog & Technical Writing Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dedicated workspace for high-depth tech essays, cognitive science articles, and SEO content publishing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm shadow-cyan-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
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
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-sm'
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

      {/* Main 2-Column Split: Articles List (4 cols) | Full Editorial Canvas (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Publications & Articles */}
        <div className="lg:col-span-4 space-y-3">
          {/* Publication Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setBlogFilter('all')}
              className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-colors ${
                blogFilter === 'all'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Blogs
            </button>
            {uniqueBlogs.map((b) => (
              <button
                key={b}
                onClick={() => setBlogFilter(b)}
                className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  blogFilter === b
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b}
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
                      ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/20'
                      : 'bg-[#0B1222] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                      {item.blogName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">
                      {item.stage}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-2">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                    <span className="truncate max-w-[140px]">
                      {item.seoKeywords.slice(0, 2).join(', ')}
                    </span>
                    {item.scheduledDate && <span>Due: {item.scheduledDate}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Article Editorial Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {activeItem ? (
            <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-5">
              {/* Header: Title & Stage */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                    <span>{activeItem.blogName.toUpperCase()}</span>
                    <span>·</span>
                    <span className="capitalize">{activeItem.stage}</span>
                  </div>
                  <input
                    type="text"
                    value={activeItem.title}
                    onChange={(e) => onSaveItem({ ...activeItem, title: e.target.value })}
                    className="w-full bg-transparent font-bold text-base text-slate-100 border-b border-transparent hover:border-slate-700 focus:border-cyan-500 focus:outline-none py-0.5"
                  />
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
                    <span>
                      Publication:{' '}
                      <input
                        type="text"
                        value={activeItem.blogName}
                        onChange={(e) =>
                          onSaveItem({ ...activeItem, blogName: e.target.value })
                        }
                        className="bg-slate-900 border border-slate-800 text-cyan-300 rounded px-1.5 py-0.5 text-xs"
                      />
                    </span>
                    <span>·</span>
                    <span>
                      Target Date:{' '}
                      <input
                        type="date"
                        value={activeItem.scheduledDate || ''}
                        onChange={(e) =>
                          onSaveItem({ ...activeItem, scheduledDate: e.target.value })
                        }
                        className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-1 py-0.5 text-[11px]"
                      />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskCreatorAI(activeItem.blogName, activeItem.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-800/70 hover:bg-cyan-900 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SEO & Outline AI</span>
                  </button>

                  <button
                    onClick={() => onDeleteItem(activeItem.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SEO Keywords & Meta Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 uppercase">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    SEO Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={activeItem.seoKeywords.join(', ')}
                    onChange={(e) =>
                      onSaveItem({
                        ...activeItem,
                        seoKeywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="e.g. GAAFET, TSMC 2nm, backside power"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 uppercase">
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    Meta Description ({activeItem.metaDescription.length}/160)
                  </label>
                  <input
                    type="text"
                    value={activeItem.metaDescription}
                    onChange={(e) =>
                      onSaveItem({ ...activeItem, metaDescription: e.target.value })
                    }
                    placeholder="Google search summary snippet (under 160 chars)..."
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Article Outline & Full Draft Writing Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Outline */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 uppercase">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    Structured Outline & Headings
                  </label>
                  <textarea
                    value={activeItem.outline}
                    onChange={(e) =>
                      onSaveItem({ ...activeItem, outline: e.target.value })
                    }
                    placeholder="1. Introduction: The physics wall of FinFETs&#10;2. GAAFET Nanosheet Architecture&#10;3. Backside Power Delivery (PowerVia)..."
                    rows={8}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                {/* Draft Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5 uppercase">
                    <FileEdit className="w-3.5 h-3.5 text-cyan-400" />
                    Draft Article Content
                  </label>
                  <textarea
                    value={activeItem.draftContent}
                    onChange={(e) =>
                      onSaveItem({ ...activeItem, draftContent: e.target.value })
                    }
                    placeholder="Begin writing your article draft here..."
                    rows={8}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Editing Checklist */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase">
                  Editorial & SEO Quality Checklist
                </h4>
                <div className="space-y-1.5">
                  {activeItem.editingChecklist.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleChecklist(task.id)}
                      className="p-2 rounded bg-slate-900/60 border border-slate-800/80 text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        readOnly
                        className="rounded text-cyan-600 focus:ring-0 cursor-pointer"
                      />
                      <span className={task.done ? 'line-through text-slate-400' : 'text-slate-200'}>
                        {task.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Published URL Record */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Published Article URL:</span>
                  <input
                    type="text"
                    value={activeItem.publishedUrl || ''}
                    onChange={(e) =>
                      onSaveItem({ ...activeItem, publishedUrl: e.target.value })
                    }
                    placeholder="https://noventra.tech/posts/..."
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-72 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Autosaved at {new Date(activeItem.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
              No article selected. Click "New Article" to begin writing.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Article */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0B1222] border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-slate-100">
              Create New Blog Article
            </h3>
            <form onSubmit={handleCreateNew} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Publication / Blog Name
                </label>
                <select
                  value={newBlogName}
                  onChange={(e) => setNewBlogName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="NOVENTRA">NOVENTRA (Deep Tech & Computing)</option>
                  <option value="Arena IQ">Arena IQ (Cognitive Science & Productivity)</option>
                  <option value="Custom Publication">Custom Publication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Computing: Beyond Silicon"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
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
                  className="px-4 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg"
                >
                  Create Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
