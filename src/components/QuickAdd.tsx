import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  X,
  Calendar,
  Clock,
  Zap,
  AtSign,
  FolderKanban,
  ChevronDown,
} from 'lucide-react';
import { Task, Project, TaskStatus, Context, TimeEstimate, EnergyLevel } from '../types';

interface QuickAddProps {
  projects: Project[];
  theme: 'light' | 'dark';
  defaultStatus: TaskStatus;
  onAdd: (task: Partial<Task>) => void;
}

const contextOptions: { value: Context; label: string }[] = [
  { value: '@home', label: '@home' },
  { value: '@phone', label: '@phone' },
  { value: '@computer', label: '@computer' },
  { value: '@work', label: '@work' },
  { value: '@errands', label: '@errands' },
];

const timeOptions: { value: TimeEstimate; label: string }[] = [
  { value: '5m', label: '5m' },
  { value: '10m', label: '10m' },
  { value: '30m', label: '30m' },
];

const energyOptions: { value: EnergyLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'high', label: 'High' },
];

export default function QuickAdd({ projects, theme, defaultStatus, onAdd }: QuickAddProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [context, setContext] = useState<Context | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [timeEstimate, setTimeEstimate] = useState<TimeEstimate | null>(null);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [expanded]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      status: defaultStatus,
      context,
      projectId,
      dueDate,
      timeEstimate,
      energyLevel,
    });
    // Reset
    setTitle('');
    setContext(null);
    setProjectId(null);
    setDueDate(null);
    setTimeEstimate(null);
    setEnergyLevel(null);
    // Keep expanded so user can add another
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setExpanded(false);
      setTitle('');
    }
  };

  const hasActiveFilters = context || projectId || dueDate || timeEstimate || energyLevel;

  const chipClass = (active: boolean) =>
    `px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
      active
        ? theme === 'dark'
          ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
          : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
        : theme === 'dark'
        ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
    }`;

  // Collapsed state
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={`w-full flex items-center gap-3 px-4 md:px-6 py-3 border-b text-left transition-colors ${
          theme === 'dark'
            ? 'border-zinc-800 hover:bg-zinc-800/40 text-zinc-500'
            : 'border-zinc-100 hover:bg-zinc-50 text-zinc-400'
        }`}
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300'
        }`}>
          <Plus size={12} />
        </div>
        <span className="text-sm">Add a task…</span>
        <span className={`ml-auto text-[10px] hidden sm:inline ${
          theme === 'dark' ? 'text-zinc-600' : 'text-zinc-300'
        }`}>
          Press <kbd className={`px-1 py-0.5 rounded border ${
            theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'
          }`}>N</kbd>
        </span>
      </button>
    );
  }

  // Expanded state
  return (
    <div className={`border-b ${
      theme === 'dark' ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50/50'
    }`}>
      {/* Title input */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
          theme === 'dark' ? 'border-indigo-500/50' : 'border-indigo-400'
        }`}>
          <Plus size={12} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className={`flex-1 bg-transparent outline-none text-sm ${
            theme === 'dark'
              ? 'text-zinc-100 placeholder:text-zinc-500'
              : 'text-zinc-900 placeholder:text-zinc-400'
          }`}
        />
        <button
          onClick={() => { setExpanded(false); setTitle(''); }}
          className={`p-1 rounded transition-colors ${
            theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-zinc-200 text-zinc-400'
          }`}
        >
          <X size={14} />
        </button>
      </div>

      {/* Pickers */}
      <div className={`px-4 md:px-6 pb-3 pl-12 space-y-2.5`}>
        {/* Context */}
        <div className="flex items-center gap-2 flex-wrap">
          <AtSign size={12} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} />
          <button
            onClick={() => setContext(null)}
            className={chipClass(!context)}
          >
            None
          </button>
          {contextOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setContext(context === opt.value ? null : opt.value)}
              className={chipClass(context === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Project */}
        {projects.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <FolderKanban size={12} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} />
            <button
              onClick={() => setProjectId(null)}
              className={chipClass(!projectId)}
            >
              No project
            </button>
            {projects.filter(p => !p.archived).map((p) => (
              <button
                key={p.id}
                onClick={() => setProjectId(projectId === p.id ? null : p.id)}
                className={chipClass(projectId === p.id)}
                style={projectId === p.id ? {
                  backgroundColor: p.color + '20',
                  color: p.color,
                  boxShadow: `inset 0 0 0 1px ${p.color}40`,
                } : undefined}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Due date + Time + Energy row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} />
            <input
              type="date"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value || null)}
              className={`text-[11px] px-2 py-1 rounded-md border outline-none ${
                theme === 'dark'
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  : 'bg-white border-zinc-200 text-zinc-700'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={12} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} />
            <button
              onClick={() => setTimeEstimate(null)}
              className={chipClass(!timeEstimate)}
            >
              —
            </button>
            {timeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeEstimate(timeEstimate === opt.value ? null : opt.value)}
                className={chipClass(timeEstimate === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Zap size={12} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'} />
            <button
              onClick={() => setEnergyLevel(null)}
              className={chipClass(!energyLevel)}
            >
              —
            </button>
            {energyOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setEnergyLevel(energyLevel === opt.value ? null : opt.value)}
                className={chipClass(energyLevel === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className={`text-[11px] ${
            theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            ↵ to add · esc to cancel
            {hasActiveFilters && ' · options set'}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
}
