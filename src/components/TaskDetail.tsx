import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Zap,
  AtSign,
  FolderKanban,
  User,
  AlignLeft,
  CheckCircle2,
  Circle,
  Inbox,
  Lightbulb,
  Timer,
} from 'lucide-react';
import { Task, Project, TaskStatus, Context, TimeEstimate, EnergyLevel } from '../types';

interface TaskDetailProps {
  task: Task;
  projects: Project[];
  theme: 'light' | 'dark';
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusOptions: { value: TaskStatus; label: string; icon: React.ReactNode }[] = [
  { value: 'inbox', label: 'Inbox', icon: <Inbox size={14} /> },
  { value: 'next_action', label: 'Next Action', icon: <CheckCircle2 size={14} /> },
  { value: 'waiting_for', label: 'Waiting For', icon: <Timer size={14} /> },
  { value: 'someday_maybe', label: 'Someday / Maybe', icon: <Lightbulb size={14} /> },
  { value: 'completed', label: 'Completed', icon: <Circle size={14} /> },
];

const contextOptions: { value: Context; label: string }[] = [
  { value: '@home', label: '@home' },
  { value: '@phone', label: '@phone' },
  { value: '@computer', label: '@computer' },
  { value: '@work', label: '@work' },
  { value: '@errands', label: '@errands' },
];

const timeOptions: { value: TimeEstimate; label: string }[] = [
  { value: '5m', label: '5 min' },
  { value: '10m', label: '10 min' },
  { value: '30m', label: '30 min' },
];

const energyOptions: { value: EnergyLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'high', label: 'High' },
];

export default function TaskDetail({
  task,
  projects,
  theme,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleChange = (field: keyof Task, value: any) => {
    const updated = { ...editedTask, [field]: value };
    if (field === 'status' && value === 'completed') {
      updated.completedAt = new Date().toISOString();
    } else if (field === 'status' && value !== 'completed') {
      updated.completedAt = null;
    }
    setEditedTask(updated);
    onUpdate(updated);
  };

  const inputClass = `w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
    theme === 'dark'
      ? 'bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-indigo-500'
      : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:border-indigo-400'
  } outline-none focus:ring-2 focus:ring-indigo-500/20`;

  const selectClass = `px-3 py-2 rounded-lg text-sm border transition-colors ${
    theme === 'dark'
      ? 'bg-zinc-800 border-zinc-700 text-zinc-200 focus:border-indigo-500'
      : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-400'
  } outline-none focus:ring-2 focus:ring-indigo-500/20`;

  const labelClass = `text-xs font-medium uppercase tracking-wider ${
    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
  }`;

  return (
    <div
      className={`h-full flex flex-col border-l overflow-hidden ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 h-14 border-b shrink-0 ${
        theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <h3 className={`text-sm font-semibold ${
          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'
        }`}>
          Task Details
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDelete(task.id)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              theme === 'dark'
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-red-500 hover:bg-red-50'
            }`}
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-md transition-colors ${
              theme === 'dark'
                ? 'hover:bg-zinc-800 text-zinc-400'
                : 'hover:bg-zinc-100 text-zinc-500'
            }`}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Title */}
        <div>
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full text-base font-medium bg-transparent border-none outline-none ${
              theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
            }`}
            placeholder="Task title..."
          />
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange('status', opt.value)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  editedTask.status === opt.value
                    ? theme === 'dark'
                      ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                    : theme === 'dark'
                    ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Delegated To (shown when waiting_for) */}
        {editedTask.status === 'waiting_for' && (
          <div>
            <label className={labelClass}>Delegated To</label>
            <div className="mt-1.5 relative">
              <User size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
              }`} />
              <input
                type="text"
                value={editedTask.delegatedTo || ''}
                onChange={(e) => handleChange('delegatedTo', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="Who is responsible?"
              />
            </div>
          </div>
        )}

        {/* Project */}
        <div>
          <label className={labelClass}>Project</label>
          <div className="mt-1.5 relative">
            <FolderKanban size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`} />
            <select
              value={editedTask.projectId || ''}
              onChange={(e) => handleChange('projectId', e.target.value || null)}
              className={`${selectClass} pl-9 w-full appearance-none`}
            >
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Context */}
        <div>
          <label className={labelClass}>Context</label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <button
              onClick={() => handleChange('context', null)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                !editedTask.context
                  ? theme === 'dark'
                    ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                  : theme === 'dark'
                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              None
            </button>
            {contextOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange('context', opt.value)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  editedTask.context === opt.value
                    ? theme === 'dark'
                      ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                    : theme === 'dark'
                    ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time & Energy */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Time</label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                onClick={() => handleChange('timeEstimate', null)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  !editedTask.timeEstimate
                    ? theme === 'dark'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-indigo-50 text-indigo-700'
                    : theme === 'dark'
                    ? 'bg-zinc-800 text-zinc-400'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                —
              </button>
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleChange('timeEstimate', opt.value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    editedTask.timeEstimate === opt.value
                      ? theme === 'dark'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-indigo-50 text-indigo-700'
                      : theme === 'dark'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Energy</label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                onClick={() => handleChange('energyLevel', null)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  !editedTask.energyLevel
                    ? theme === 'dark'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-indigo-50 text-indigo-700'
                    : theme === 'dark'
                    ? 'bg-zinc-800 text-zinc-400'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                —
              </button>
              {energyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleChange('energyLevel', opt.value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    editedTask.energyLevel === opt.value
                      ? theme === 'dark'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-indigo-50 text-indigo-700'
                      : theme === 'dark'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className={labelClass}>Due Date</label>
          <div className="mt-1.5 relative">
            <Calendar size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`} />
            <input
              type="date"
              value={editedTask.dueDate ? editedTask.dueDate.split('T')[0] : ''}
              onChange={(e) => handleChange('dueDate', e.target.value || null)}
              className={`${selectClass} pl-9 w-full`}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={editedTask.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={4}
            className={`${inputClass} mt-1.5 resize-none`}
            placeholder="Add notes..."
          />
        </div>

        {/* Timestamps */}
        <div className={`text-xs space-y-1 pt-2 border-t ${
          theme === 'dark' ? 'border-zinc-800 text-zinc-600' : 'border-zinc-100 text-zinc-400'
        }`}>
          <p>Created: {new Date(editedTask.createdAt).toLocaleDateString()}</p>
          {editedTask.completedAt && (
            <p>Completed: {new Date(editedTask.completedAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
