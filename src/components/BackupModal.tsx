import React, { useState } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { NexusDB } from '../db/indexedDb';
import { Language } from '../types';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReloaded: () => void;
  lang: Language;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onDataReloaded,
}) => {
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await NexusDB.exportBackup();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus_desk_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: 'Backup successfully exported! Keep this JSON file safe on your computer or Google Drive.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      setStatusMessage({ type: 'error', text: `Failed to export backup: ${msg}` });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.version || !parsed.subjects || !parsed.chapters) {
          throw new Error('Unrecognized JSON backup structure. File must be created by NEXUS DESK.');
        }

        await NexusDB.importBackup(parsed);
        setStatusMessage({
          type: 'success',
          text: 'Backup successfully restored into IndexedDB! Refreshing workspaces...',
        });
        setTimeout(() => {
          onDataReloaded();
          onClose();
        }, 1500);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid JSON file';
        setStatusMessage({ type: 'error', text: `Restore failed: ${msg}` });
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = async () => {
    try {
      await NexusDB.resetToDefaults();
      setShowResetConfirm(false);
      setStatusMessage({
        type: 'success',
        text: 'All workspaces restored to fresh verified CBSE Class 12 Syllabus!',
      });
      setTimeout(() => {
        onDataReloaded();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      setStatusMessage({ type: 'error', text: `Reset failed: ${msg}` });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0B1222] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Data Management & JSON Backup
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                IndexedDB Local Storage · 100% Offline & Private
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-200'
                : 'bg-red-950/80 border border-red-600 text-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Action 1: Export JSON Backup */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-cyan-400" />
              Export Full Workspace Backup (.json)
            </span>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Download JSON'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Exports all CBSE chapters, 7-step checklist progress, daily calendar tasks, focus session history, YouTube scripts, and universal notes into a readable JSON file.
          </p>
        </div>

        {/* Action 2: Import / Restore JSON */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-purple-400" />
              Restore from JSON Backup
            </span>
            <label className="px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/80 hover:bg-purple-900 border border-purple-800/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Select File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Validates and safely imports your previously exported NEXUS DESK backup file without requiring any cloud server.
          </p>
        </div>

        {/* Action 3: Factory Reset to Verified CBSE 12 Default */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-red-900/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-red-400" />
              Reset to Official CBSE 2026–27 Syllabus
            </span>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1 text-xs text-red-400 hover:text-red-300 border border-red-900/60 rounded hover:bg-red-950/60 transition-colors"
              >
                Reset Workspaces
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFactoryReset}
                  className="px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded"
                >
                  Confirm Reset
                </button>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Replaces all current progress with the fresh verified CBSE Class 12 Syllabus (Physics, Chemistry, Math, IP, Painting) and starter creative desks.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
