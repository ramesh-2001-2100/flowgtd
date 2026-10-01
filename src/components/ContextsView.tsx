import React, { useState } from 'react';
import { AtSign, Home, Phone, Monitor, Briefcase, MapPin } from 'lucide-react';
import { Task, Project, Context } from '../types';
import TaskItem from './TaskItem';

interface ContextsViewProps {
  tasks: Task[];
  projects: Project[];
  theme: 'light' | 'dark';
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const contextConfig: { value: Context; label: string; icon: React.ReactNode; color: string }[] = [
  { value: '@home', label: '@home', icon: <Home size={18} />, color: '#10b981' },
  { value: '@phone', label: '@phone', icon: <Phone size={18} />, color: '#6366f1' },
  { value: '@computer', label: '@computer', icon: <Monitor size={18} />, color: '#f59e0b' },
  { value: '@work', label: '@work', icon: <Briefcase size={18} />, color: '#ef4444' },
  { value: '@errands', label: '@errands', icon: <MapPin size={18} />, color: '#8b5cf6' },
];

export default function ContextsView({
  tasks,
  projects,
  theme,
  selectedTaskId,
  onSelectTask,
  onCompleteTask,
  onDeleteTask,
}: ContextsViewProps) {
  const [activeContext, setActiveContext] = useState<Context | null>(null);

  const getProject = (projectId: string | null) =>
    projectId ? projects.find((p) => p.id === projectId) || null : null;

  const getContextTasks = (ctx: Context) =>
    tasks.filter(
      (t) => t.context === ctx && t.status !== 'completed' && t.status !== 'inbox' && t.status !== 'someday_maybe'
    );

  if (activeContext) {
    const ctxConfig = contextConfig.find((c) => c.value === activeContext)!;
    const ctxTasks = getContextTasks(activeContext);

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className={`shrink-0 px-4 md:px-6 pt-5 pb-3 border-b ${
          theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <button
            onClick={() => setActiveContext(null)}
            className={`inline-flex items-center gap-1 text-sm mb-3 ${
              theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            ← Back to contexts
          </button>
          <div className="flex items-center gap-3">
            <span style={{ color: ctxConfig.color }}>{ctxConfig.icon}</span>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
            }`}>
              {ctxConfig.label}
            </h2>
            <span className={`text-sm ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              {ctxTasks.length} task{ctxTasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {ctxTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                No tasks in this context
              </p>
            </div>
          ) : (
            ctxTasks.map((task) => (
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
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className={`shrink-0 px-4 md:px-6 pt-5 pb-3 border-b ${
        theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <h2 className={`text-xl font-bold tracking-tight ${
          theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
        }`}>
          Contexts
        </h2>
        <p className={`text-sm mt-0.5 ${
          theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
        }`}>
          Filter tasks by where or how you can do them
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contextConfig.map((ctx) => {
            const count = getContextTasks(ctx.value).length;
            return (
              <button
                key={ctx.value}
                onClick={() => setActiveContext(ctx.value)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-900'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: ctx.color + '15', color: ctx.color }}
                >
                  {ctx.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
                  }`}>
                    {ctx.label}
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    {count} task{count !== 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
