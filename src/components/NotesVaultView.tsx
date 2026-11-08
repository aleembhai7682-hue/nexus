import React, { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  Tag,
  BookOpen,
  Trash2,
  Save,
  Check,
} from 'lucide-react';
import { UniversalNote, Subject, Language } from '../types';

interface NotesVaultViewProps {
  notes: UniversalNote[];
  subjects: Subject[];
  onSaveNote: (note: UniversalNote) => void;
  onDeleteNote: (id: string) => void;
  lang: Language;
}

export const NotesVaultView: React.FC<NotesVaultViewProps> = ({
  notes,
  subjects,
  onSaveNote,
  onDeleteNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // All unique tags across notes
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags || [])));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const activeNote = notes.find((n) => n.id === selectedNoteId) || filteredNotes[0];

  const handleCreateNote = () => {
    const newNote: UniversalNote = {
      id: `note_${Date.now()}`,
      title: 'Untitled Study Note',
      content: '## Key Concepts\n- Point 1\n- Point 2\n\n### Formulas\n- Formula here...',
      tags: ['Study'],
      updatedAt: new Date().toISOString(),
    };
    onSaveNote(newNote);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateActiveNote = (updates: Partial<UniversalNote>) => {
    if (!activeNote) return;
    const updated = {
      ...activeNote,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    onSaveNote(updated);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900/95 via-[#0C1525] to-slate-900/95 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>UNIVERSAL KNOWLEDGE VAULT</span>
            <span>·</span>
            <span>MARKDOWN & FORMULA ARCHIVE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Universal Notes Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-referenced personal notes linking CBSE 12 formulas, derivations, gaming concepts, and tech essays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm shadow-cyan-950/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Notes List (4 cols) | Note Editor (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Search & Notes List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes or tags..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Tags Filter Strip */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  selectedTag === null
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors shrink-0 ${
                    selectedTag === tag
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              const linkedSubject = subjects.find((s) => s.id === note.linkedSubjectId);

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/20'
                      : 'bg-[#0B1222] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {note.title || 'Untitled Note'}
                    </span>
                    {linkedSubject && (
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0"
                        style={{
                          backgroundColor: `${linkedSubject.color}15`,
                          color: linkedSubject.color,
                        }}
                      >
                        {linkedSubject.name}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {note.content.replace(/[#*`_]/g, '')}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <div className="flex items-center gap-1 truncate max-w-[150px]">
                      {note.tags.map((t) => (
                        <span key={t}>#{t}</span>
                      ))}
                    </div>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Editor */}
        <div className="lg:col-span-8 space-y-4">
          {activeNote ? (
            <div className="rounded-xl bg-[#0B1222] border border-slate-800/80 p-5 space-y-4">
              {/* Note Header & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                  placeholder="Note Title..."
                  className="bg-transparent font-bold text-base text-slate-100 border-b border-transparent hover:border-slate-700 focus:border-cyan-500 focus:outline-none py-0.5 w-full max-w-md"
                />

                <div className="flex items-center gap-2">
                  {justSaved && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Autosaved
                    </span>
                  )}

                  <button
                    onClick={() => onDeleteNote(activeNote.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject Association & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Linked CBSE Subject:
                  </label>
                  <select
                    value={activeNote.linkedSubjectId || ''}
                    onChange={(e) =>
                      handleUpdateActiveNote({
                        linkedSubjectId: e.target.value || undefined,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- General Note (No subject) --</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Code {s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Tags (comma separated):
                  </label>
                  <input
                    type="text"
                    value={activeNote.tags.join(', ')}
                    onChange={(e) =>
                      handleUpdateActiveNote({
                        tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Physics, Formula, Derivations..."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Markdown Content Editor */}
              <div>
                <textarea
                  value={activeNote.content}
                  onChange={(e) => handleUpdateActiveNote({ content: e.target.value })}
                  rows={18}
                  placeholder="Write your study notes, derivations, or project ideas in Markdown..."
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                <span>{activeNote.content.length} characters · Markdown supported</span>
                <span>Last updated {new Date(activeNote.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
              Select or create a note to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
