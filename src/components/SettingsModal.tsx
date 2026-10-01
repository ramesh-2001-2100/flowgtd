import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileJson, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { exportToJSON, exportToCSV, importFromJSON } from '../lib/export';
import { Task, Project } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  tasks: Task[];
  projects: Project[];
  onImport: (data: { tasks: Task[]; projects: Project[]; theme: 'light' | 'dark' }) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  tasks,
  projects,
  onImport,
}: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleExportJSON = () => {
    exportToJSON(tasks, projects, theme);
  };

  const handleExportCSV = () => {
    exportToCSV(tasks, projects);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('idle');
      setErrorMessage('');
      
      const data = await importFromJSON(file);
      if (data) {
        onImport(data);
        setImportStatus('success');
        setTimeout(() => {
          setImportStatus('idle');
          onClose();
        }, 2000);
      }
    } catch (error) {
      setImportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to import file');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-xl shadow-2xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-zinc-900 border-zinc-700'
            : 'bg-white border-zinc-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'
        }`}>
          <h2 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
          }`}>
            Data Management
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark'
                ? 'hover:bg-zinc-800 text-zinc-400'
                : 'hover:bg-zinc-100 text-zinc-500'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              Export Data
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleExportJSON}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <FileJson size={20} className="text-indigo-500" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Export as JSON</div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    Complete backup with all data
                  </div>
                </div>
                <Download size={16} className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} />
              </button>

              <button
                onClick={handleExportCSV}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
                    : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <FileSpreadsheet size={20} className="text-emerald-500" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Export as CSV</div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    Tasks only, for spreadsheet analysis
                  </div>
                </div>
                <Download size={16} className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} />
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              Import Data
            </h3>
            <button
              onClick={handleImportClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
                  : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <Upload size={20} className="text-amber-500" />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">Import from JSON</div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                }`}>
                  Restore from a backup file
                </div>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Status Messages */}
            {importStatus === 'success' && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={16} />
                <span className="text-sm">Data imported successfully!</span>
              </div>
            )}

            {importStatus === 'error' && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                <AlertCircle size={16} />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className={`p-3 rounded-lg text-xs ${
            theme === 'dark'
              ? 'bg-amber-500/10 text-amber-400'
              : 'bg-amber-50 text-amber-700'
          }`}>
            <strong>Note:</strong> Importing will replace all current data. Export your data first if you want to keep it.
          </div>
        </div>
      </div>
    </div>
  );
}
