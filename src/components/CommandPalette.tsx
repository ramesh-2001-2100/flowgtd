import React, { useState, useEffect, useRef } from 'react';
import { Search, Inbox, Zap, FolderKanban, Clock, Lightbulb, ArrowRight } from 'lucide-react';
import { Task, Project, ViewType } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  tasks: Task[];
  projects: Project[];
  onNavigate: (view: ViewType) => void;
  onSelectTask: (taskId: string) => void;
  onQuickAdd: (title: string) => void;
}

type CommandItem = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
};

export default function CommandPalette({
  isOpen,
  onClose,
  theme,
  tasks,
  projects,
  onNavigate,
  onSelectTask,
  onQuickAdd,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigationCommands: CommandItem[] = [
    { id: 'nav-inbox', label: 'Go to Inbox', icon: <Inbox size={16} />, action: () => { onNavigate('inbox'); onClose(); } },
    { id: 'nav-next', label: 'Go to Next Actions', icon: <Zap size={16} />, action: () => { onNavigate('next'); onClose(); } },
    { id: 'nav-projects', label: 'Go to Projects', icon: <FolderKanban size={16} />, action: () => { onNavigate('projects'); onClose(); } },
    { id: 'nav-waiting', label: 'Go to Waiting For', icon: <Clock size={16} />, action: () => { onNavigate('waiting'); onClose(); } },
    { id: 'nav-someday', label: 'Go to Someday / Maybe', icon: <Lightbulb size={16} />, action: () => { onNavigate('someday'); onClose(); } },
  ];

  const taskCommands: CommandItem[] = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 10)
    .map((t) => ({
      id: t.id,
      label: t.title,
      description: t.context || undefined,
      icon: <ArrowRight size={16} />,
      action: () => { onSelectTask(t.id); onClose(); },
    }));

  const allCommands = [...navigationCommands, ...taskCommands];
  const filtered = query
    ? allCommands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  const showQuickAdd = query.length > 0 && !filtered.some((c) => c.label.toLowerCase() === query.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div
        className={`relative w-full max-w-lg mx-4 rounded-xl shadow-2xl border overflow-hidden ${
          theme === 'dark'
            ? 'bg-zinc-900 border-zinc-700'
            : 'bg-white border-zinc-200'
        }`}
      >
        {/* Search input */}
        <div className={`flex items-center gap-3 px-4 border-b ${
          theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'
        }`}>
          <Search size={18} className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className={`flex-1 py-4 bg-transparent outline-none text-sm ${
              theme === 'dark' ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-800 placeholder:text-zinc-400'
            }`}
          />
          <kbd className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border ${
            theme === 'dark' ? 'border-zinc-700 text-zinc-500' : 'border-zinc-300 text-zinc-400'
          }`}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && !showQuickAdd && (
            <div className={`px-4 py-8 text-center text-sm ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              No results found
            </div>
          )}

          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={cmd.action}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-zinc-800 text-zinc-300'
                  : 'hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              <span className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>
                {cmd.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{cmd.label}</p>
                {cmd.description && (
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>{cmd.description}</p>
                )}
              </div>
            </button>
          ))}

          {showQuickAdd && (
            <button
              onClick={() => { onQuickAdd(query); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-zinc-800 text-indigo-400'
                  : 'hover:bg-indigo-50 text-indigo-600'
              }`}
            >
              <span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}>
                <ArrowRight size={16} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">Add to Inbox: "{query}"</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
