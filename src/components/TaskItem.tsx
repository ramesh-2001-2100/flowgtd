import React from 'react';
import { Check, Trash2, MoreHorizontal, Calendar, Clock, Zap, User } from 'lucide-react';
import { Task, Project } from '../types';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

interface TaskItemProps {
  task: Task;
  project?: Project | null;
  theme: 'light' | 'dark';
  isSelected: boolean;
  onSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

function getDueDateLabel(dateStr: string): { label: string; className: string } {
  const date = parseISO(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isToday(date)) return { label: 'Today', className: 'text-amber-600 dark:text-amber-400' };
  if (isTomorrow(date)) return { label: 'Tomorrow', className: 'text-blue-600 dark:text-blue-400' };
  if (isPast(date)) return { label: format(date, 'MMM d'), className: 'text-red-600 dark:text-red-400' };
  return { label: format(date, 'MMM d'), className: 'text-zinc-500 dark:text-zinc-400' };
}

export default function TaskItem({
  task,
  project,
  theme,
  isSelected,
  onSelect,
  onComplete,
  onDelete,
}: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const dueInfo = task.dueDate ? getDueDateLabel(task.dueDate) : null;

  return (
    <div
      onClick={() => onSelect(task.id)}
      className={`group flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-all duration-150 ${
        isSelected
          ? theme === 'dark'
            ? 'bg-zinc-800/80 border-zinc-700'
            : 'bg-indigo-50/50 border-indigo-100'
          : theme === 'dark'
          ? 'border-zinc-800/50 hover:bg-zinc-800/40'
          : 'border-zinc-100 hover:bg-zinc-50'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete(task.id);
        }}
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          isCompleted
            ? 'bg-emerald-500 border-emerald-500'
            : theme === 'dark'
            ? 'border-zinc-600 hover:border-indigo-400'
            : 'border-zinc-300 hover:border-indigo-500'
        }`}
      >
        {isCompleted && <Check size={12} className="text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            isCompleted
              ? 'line-through text-zinc-400 dark:text-zinc-500'
              : theme === 'dark'
              ? 'text-zinc-200'
              : 'text-zinc-800'
          }`}
        >
          {task.title}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {project && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: project.color + '15',
                color: project.color,
              }}
            >
              {project.name}
            </span>
          )}
          {task.context && (
            <span className={`text-[11px] px-1.5 py-0.5 rounded ${
              theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
            }`}>
              {task.context}
            </span>
          )}
          {task.timeEstimate && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              <Clock size={10} />
              {task.timeEstimate}
            </span>
          )}
          {task.energyLevel && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] ${
              task.energyLevel === 'high'
                ? 'text-orange-500'
                : 'text-blue-500'
            }`}>
              <Zap size={10} />
              {task.energyLevel}
            </span>
          )}
          {dueInfo && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${dueInfo.className}`}>
              <Calendar size={10} />
              {dueInfo.label}
            </span>
          )}
          {task.delegatedTo && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              <User size={10} />
              {task.delegatedTo}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={`shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark'
              ? 'hover:bg-zinc-700 text-zinc-500 hover:text-red-400'
              : 'hover:bg-zinc-200 text-zinc-400 hover:text-red-500'
          }`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
