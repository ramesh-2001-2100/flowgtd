import React, { useState } from 'react';
import {
  Plus,
  FolderKanban,
  ChevronRight,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  ArrowLeft,
} from 'lucide-react';
import { Task, Project } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  theme: 'light' | 'dark';
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  onSelectProject: (id: string | null) => void;
  onSelectTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddProject: (name: string, description: string) => void;
  onDeleteProject: (id: string) => void;
}

const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function ProjectsView({
  projects,
  tasks,
  theme,
  selectedProjectId,
  selectedTaskId,
  onSelectProject,
  onSelectTask,
  onCompleteTask,
  onDeleteTask,
  onAddProject,
  onDeleteProject,
}: ProjectsViewProps) {
  const [showNewProject, setShowNewProject] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const activeProjects = projects.filter((p) => !p.archived);

  const handleAddProject = () => {
    if (newName.trim()) {
      onAddProject(newName.trim(), newDesc.trim());
      setNewName('');
      setNewDesc('');
      setShowNewProject(false);
    }
  };

  // Project detail view
  if (selectedProjectId) {
    const project = projects.find((p) => p.id === selectedProjectId);
    if (!project) return null;

    const projectTasks = tasks
      .filter((t) => t.projectId === selectedProjectId && t.status !== 'completed')
      .sort((a, b) => a.order - b.order);

    const completedCount = tasks.filter(
      (t) => t.projectId === selectedProjectId && t.status === 'completed'
    ).length;

    const nextAction = projectTasks.find((t) => t.status === 'next_action');

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Project header */}
        <div className={`shrink-0 px-4 md:px-6 pt-5 pb-4 border-b ${
          theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <button
            onClick={() => onSelectProject(null)}
            className={`inline-flex items-center gap-1 text-sm mb-3 ${
              theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <ArrowLeft size={14} />
            Back to projects
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
            }`}>
              {project.name}
            </h2>
            <button
              onClick={() => onDeleteProject(project.id)}
              className={`ml-auto p-1.5 rounded-md transition-colors ${
                theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'
              }`}
            >
              <Trash2 size={14} />
            </button>
          </div>
          {project.description && (
            <p className={`text-sm mt-1.5 ${
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              {project.description}
            </p>
          )}
          <div className={`flex items-center gap-4 mt-3 text-xs ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            <span>{projectTasks.length} active tasks</span>
            <span>{completedCount} completed</span>
          </div>
        </div>

        {/* Next Action highlight */}
        {nextAction && (
          <div className={`shrink-0 mx-4 md:mx-6 mt-4 p-3 rounded-lg border ${
            theme === 'dark'
              ? 'bg-indigo-500/5 border-indigo-500/20'
              : 'bg-indigo-50 border-indigo-100'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                ★ Next Action
              </span>
            </div>
            <button
              onClick={() => onSelectTask(nextAction.id)}
              className={`text-sm font-medium text-left w-full ${
                theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
              }`}
            >
              {nextAction.title}
            </button>
          </div>
        )}

        {/* Task list */}
        <div className="flex-1 overflow-y-auto mt-4">
          {projectTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className={theme === 'dark' ? 'text-zinc-700' : 'text-zinc-300'} size={32} />
              <p className={`text-sm mt-2 ${
                theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                No active tasks in this project
              </p>
            </div>
          ) : (
            projectTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`flex items-center gap-3 px-4 md:px-6 py-3 border-b cursor-pointer transition-colors ${
                  selectedTaskId === task.id
                    ? theme === 'dark'
                      ? 'bg-zinc-800/80 border-zinc-700'
                      : 'bg-indigo-50/50 border-indigo-100'
                    : theme === 'dark'
                    ? 'border-zinc-800/50 hover:bg-zinc-800/40'
                    : 'border-zinc-100 hover:bg-zinc-50'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompleteTask(task.id);
                  }}
                  className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    theme === 'dark'
                      ? 'border-zinc-600 hover:border-indigo-400'
                      : 'border-zinc-300 hover:border-indigo-500'
                  }`}
                />
                <span className={`text-sm flex-1 ${
                  theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
                }`}>
                  {task.title}
                </span>
                {task.context && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded ${
                    theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {task.context}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Projects list view
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className={`shrink-0 px-4 md:px-6 pt-5 pb-3 border-b ${
        theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
            }`}>
              Projects
            </h2>
            <p className={`text-sm mt-0.5 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              Multi-step outcomes you're working toward
            </p>
          </div>
          <button
            onClick={() => setShowNewProject(!showNewProject)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <Plus size={18} />
          </button>
        </div>

        {/* New project form */}
        {showNewProject && (
          <div className={`mt-4 p-4 rounded-lg border ${
            theme === 'dark' ? 'border-zinc-700 bg-zinc-800/50' : 'border-zinc-200 bg-zinc-50'
          }`}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Project name..."
              className={`w-full px-3 py-2 rounded-lg text-sm border mb-2 ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-500'
                  : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400'
              } outline-none focus:ring-2 focus:ring-indigo-500/20`}
              autoFocus
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)..."
              rows={2}
              className={`w-full px-3 py-2 rounded-lg text-sm border resize-none mb-3 ${
                theme === 'dark'
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-500'
                  : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400'
              } outline-none focus:ring-2 focus:ring-indigo-500/20`}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddProject}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
              >
                Create Project
              </button>
              <button
                onClick={() => { setShowNewProject(false); setNewName(''); setNewDesc(''); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-700' : 'text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto">
        {activeProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FolderKanban className={theme === 'dark' ? 'text-zinc-700' : 'text-zinc-300'} size={40} />
            <p className={`text-sm mt-3 ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              No projects yet. Create one to get started.
            </p>
          </div>
        ) : (
          <div className="py-2">
            {activeProjects.map((project) => {
              const projectTaskCount = tasks.filter(
                (t) => t.projectId === project.id && t.status !== 'completed'
              ).length;
              const completedCount = tasks.filter(
                (t) => t.projectId === project.id && t.status === 'completed'
              ).length;

              return (
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className={`w-full flex items-center gap-4 px-4 md:px-6 py-4 text-left transition-colors border-b ${
                    theme === 'dark'
                      ? 'border-zinc-800/50 hover:bg-zinc-800/40'
                      : 'border-zinc-100 hover:bg-zinc-50'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
                    }`}>
                      {project.name}
                    </p>
                    {project.description && (
                      <p className={`text-xs mt-0.5 truncate ${
                        theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                      }`}>
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className={`text-xs shrink-0 ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    {projectTaskCount} active
                  </div>
                  <ChevronRight size={16} className={theme === 'dark' ? 'text-zinc-600' : 'text-zinc-300'} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
