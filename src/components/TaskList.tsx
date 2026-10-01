import React, { useState } from 'react';
import {
  Zap,
  Filter,
  Calendar,
  Clock,
  Battery,
  BatteryLow,
  Plus,
} from 'lucide-react';
import { Task, Project, Context, TaskStatus } from '../types';
import { filterTasks } from '../store';
import TaskItem from './TaskItem';
import QuickAdd from './QuickAdd';

interface TaskListProps {
  title: string;
  subtitle?: string;
  tasks: Task[];
  projects: Project[];
  theme: 'light' | 'dark';
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (partial: Partial<Task>) => void;
  defaultStatus: TaskStatus;
  showFilters?: boolean;
  groupByContext?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

interface Filters {
  energy?: 'low' | 'high';
  time?: '5m' | '10m' | '30m';
  dueFilter?: 'overdue' | 'today' | 'upcoming';
}

export default function TaskList({
  title,
  subtitle,
  tasks,
  projects,
  theme,
  selectedTaskId,
  onSelectTask,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  defaultStatus,
  showFilters = false,
  groupByContext = false,
  emptyMessage = 'No tasks here',
  emptyIcon,
}: TaskListProps) {
  const [filters, setFilters] = useState<Filters>({});
  const [showFilterBar, setShowFilterBar] = useState(false);

  const filteredTasks = filterTasks(tasks, filters);

  const getProject = (projectId: string | null) =>
    projectId ? projects.find((p) => p.id === projectId) || null : null;

  const contexts: Context[] = ['@home', '@phone', '@computer', '@work', '@errands'];

  const toggleFilter = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const chipClass = (active: boolean) =>
    `px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
      active
        ? theme === 'dark'
          ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'
          : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
        : theme === 'dark'
        ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
    }`;

  const renderGrouped = () => {
    if (!groupByContext) return null;

    return contexts.map((ctx) => {
      const ctxTasks = filteredTasks.filter((t) => t.context === ctx);
      if (ctxTasks.length === 0) return null;
      return (
        <div key={ctx} className="mb-4">
          <h3 className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            {ctx}
          </h3>
          {ctxTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              project={getProject(task.projectId)}
              theme={theme}
              isSelected={selectedTaskId === task.id}
              onSelect={onSelectTask}
              onComplete={onCompleteTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      );
    });
  };

  const renderUngrouped = () =>
    filteredTasks.map((task) => (
      <TaskItem
        key={task.id}
        task={task}
        project={getProject(task.projectId)}
        theme={theme}
        isSelected={selectedTaskId === task.id}
        onSelect={onSelectTask}
        onComplete={onCompleteTask}
        onDelete={onDeleteTask}
      />
    ));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={`shrink-0 px-4 md:px-6 pt-5 pb-3 border-b ${
        theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
            }`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-sm mt-0.5 ${
                theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                {subtitle}
              </p>
            )}
          </div>
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filter toggle */}
        {showFilters && (
          <button
            onClick={() => setShowFilterBar(!showFilterBar)}
            className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              showFilterBar
                ? theme === 'dark'
                  ? 'bg-zinc-800 text-zinc-300'
                  : 'bg-zinc-100 text-zinc-700'
                : theme === 'dark'
                ? 'text-zinc-400 hover:bg-zinc-800'
                : 'text-zinc-500 hover:bg-zinc-100'
            }`}
          >
            <Filter size={12} />
            Filters
            {Object.values(filters).some(Boolean) && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </button>
        )}

        {/* Filter bar */}
        {showFilters && showFilterBar && (
          <div className="mt-3 space-y-2">
            {/* Energy */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'
              }`}>Energy</span>
              <button onClick={() => toggleFilter('energy', 'low')} className={chipClass(filters.energy === 'low')}>
                <BatteryLow size={10} className="inline mr-1" />Low
              </button>
              <button onClick={() => toggleFilter('energy', 'high')} className={chipClass(filters.energy === 'high')}>
                <Battery size={10} className="inline mr-1" />High
              </button>
            </div>
            {/* Time */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'
              }`}>Time</span>
              <button onClick={() => toggleFilter('time', '5m')} className={chipClass(filters.time === '5m')}>5m</button>
              <button onClick={() => toggleFilter('time', '10m')} className={chipClass(filters.time === '10m')}>10m</button>
              <button onClick={() => toggleFilter('time', '30m')} className={chipClass(filters.time === '30m')}>30m</button>
            </div>
            {/* Due */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'
              }`}>Due</span>
              <button onClick={() => toggleFilter('dueFilter', 'overdue')} className={chipClass(filters.dueFilter === 'overdue')}>
                Overdue
              </button>
              <button onClick={() => toggleFilter('dueFilter', 'today')} className={chipClass(filters.dueFilter === 'today')}>
                Today
              </button>
              <button onClick={() => toggleFilter('dueFilter', 'upcoming')} className={chipClass(filters.dueFilter === 'upcoming')}>
                Upcoming
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Add */}
      <QuickAdd
        projects={projects}
        theme={theme}
        defaultStatus={defaultStatus}
        onAdd={onAddTask}
      />

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className={`mb-3 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-300'}`}>
              {emptyIcon || <Zap size={40} />}
            </div>
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              {emptyMessage}
            </p>
          </div>
        ) : groupByContext ? (
          renderGrouped()
        ) : (
          renderUngrouped()
        )}
      </div>
    </div>
  );
}
