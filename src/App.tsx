import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Search, Menu, X } from 'lucide-react';
import { Task, Project, ViewType, TaskStatus, Context } from './types';
import { getInitialState, persistState, getTasksByStatus } from './store';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import ProjectsView from './components/ProjectsView';
import ContextsView from './components/ContextsView';
import CommandPalette from './components/CommandPalette';

function App() {
  // Load initial state
  const initial = getInitialState();
  const [tasks, setTasks] = useState<Task[]>(initial.tasks);
  const [projects, setProjects] = useState<Project[]>(initial.projects);
  const [theme, setTheme] = useState<'light' | 'dark'>(initial.theme);
  const [currentView, setCurrentView] = useState<ViewType>('inbox');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickCaptureText, setQuickCaptureText] = useState('');
  const [showQuickCapture, setShowQuickCapture] = useState(false);

  // Persist state
  useEffect(() => {
    persistState({ tasks, projects, theme });
  }, [tasks, projects, theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // New task
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
        e.preventDefault();
        setShowQuickCapture(true);
      }
      // Escape
      if (e.key === 'Escape') {
        setSelectedTaskId(null);
        setCommandPaletteOpen(false);
        setShowQuickCapture(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isInputFocused = () => {
    const el = document.activeElement;
    return el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.tagName === 'SELECT';
  };

  // Task CRUD
  const addTask = useCallback((title: string, status: TaskStatus = 'inbox') => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      notes: '',
      status,
      projectId: null,
      context: null,
      timeEstimate: null,
      energyLevel: null,
      dueDate: null,
      delegatedTo: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: tasks.filter((t) => t.status === status).length,
    };
    setTasks((prev) => [newTask, ...prev]);
  }, [tasks]);

  const addTaskFromPartial = useCallback((partial: Partial<Task>) => {
    if (!partial.title?.trim()) return;
    const status = partial.status || 'inbox';
    const newTask: Task = {
      id: uuidv4(),
      title: partial.title.trim(),
      notes: partial.notes || '',
      status,
      projectId: partial.projectId || null,
      context: partial.context || null,
      timeEstimate: partial.timeEstimate || null,
      energyLevel: partial.energyLevel || null,
      dueDate: partial.dueDate || null,
      delegatedTo: partial.delegatedTo || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === 'completed') {
          return { ...t, status: 'next_action' as TaskStatus, completedAt: null };
        }
        return { ...t, status: 'completed' as TaskStatus, completedAt: new Date().toISOString() };
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  }, [selectedTaskId]);

  // Project CRUD
  const addProject = useCallback((name: string, description: string) => {
    const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      color: colors[projects.length % colors.length],
      createdAt: new Date().toISOString(),
      archived: false,
    };
    setProjects((prev) => [...prev, newProject]);
  }, [projects]);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) =>
      prev.map((t) => (t.projectId === id ? { ...t, projectId: null } : t))
    );
    if (selectedProjectId === id) setSelectedProjectId(null);
  }, [selectedProjectId]);

  // Navigation
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSelectedTaskId(null);
    if (view !== 'projects') setSelectedProjectId(null);
  };

  const handleSelectTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setSelectedTaskId(id);
      // If task belongs to a project and we're in projects view, select that project
      if (task.projectId && currentView === 'projects') {
        setSelectedProjectId(task.projectId);
      }
    }
  };

  // Task counts
  const taskCounts = {
    inbox: tasks.filter((t) => t.status === 'inbox').length,
    next: tasks.filter((t) => t.status === 'next_action').length,
    projects: projects.filter((p) => !p.archived).length,
    waiting: tasks.filter((t) => t.status === 'waiting_for').length,
    someday: tasks.filter((t) => t.status === 'someday_maybe').length,
  };

  // Current view tasks
  const getCurrentTasks = (): Task[] => {
    switch (currentView) {
      case 'inbox':
        return getTasksByStatus(tasks, 'inbox');
      case 'next':
        return getTasksByStatus(tasks, 'next_action');
      case 'waiting':
        return getTasksByStatus(tasks, 'waiting_for');
      case 'someday':
        return getTasksByStatus(tasks, 'someday_maybe');
      default:
        return [];
    }
  };

  // Quick capture handler
  const handleQuickCapture = () => {
    if (quickCaptureText.trim()) {
      addTask(quickCaptureText, currentView === 'next' ? 'next_action' : currentView === 'waiting' ? 'waiting_for' : currentView === 'someday' ? 'someday_maybe' : 'inbox');
      setQuickCaptureText('');
      setShowQuickCapture(false);
    }
  };

  // Command palette handlers
  const handleCommandPaletteNavigate = (view: ViewType) => {
    handleViewChange(view);
  };

  const handleCommandPaletteSelectTask = (taskId: string) => {
    handleSelectTask(taskId);
  };

  const handleCommandPaletteQuickAdd = (title: string) => {
    addTask(title, 'inbox');
  };

  // Selected task
  const selectedTask = selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) || null : null;

  // View titles
  const viewTitles: Record<ViewType, { title: string; subtitle: string }> = {
    inbox: { title: 'Inbox', subtitle: 'Capture everything. Process later.' },
    next: { title: 'Next Actions', subtitle: 'What can you do right now?' },
    projects: { title: 'Projects', subtitle: '' },
    waiting: { title: 'Waiting For', subtitle: 'Delegated or blocked items' },
    someday: { title: 'Someday / Maybe', subtitle: 'Ideas for the future' },
    contexts: { title: 'Contexts', subtitle: '' },
  };

  // Render main content
  const renderMainContent = () => {
    if (currentView === 'projects') {
      return (
        <ProjectsView
          projects={projects}
          tasks={tasks}
          theme={theme}
          selectedProjectId={selectedProjectId}
          selectedTaskId={selectedTaskId}
          onSelectProject={setSelectedProjectId}
          onSelectTask={handleSelectTask}
          onCompleteTask={completeTask}
          onDeleteTask={deleteTask}
          onAddProject={addProject}
          onDeleteProject={deleteProject}
          onAddTask={addTaskFromPartial}
        />
      );
    }

    if (currentView === 'contexts') {
      return (
        <ContextsView
          tasks={tasks}
          projects={projects}
          theme={theme}
          selectedTaskId={selectedTaskId}
          onSelectTask={handleSelectTask}
          onCompleteTask={completeTask}
          onDeleteTask={deleteTask}
          onAddTask={addTaskFromPartial}
        />
      );
    }

    const { title, subtitle } = viewTitles[currentView];

    const defaultStatusMap: Record<ViewType, TaskStatus> = {
      inbox: 'inbox',
      next: 'next_action',
      waiting: 'waiting_for',
      someday: 'someday_maybe',
      projects: 'next_action',
      contexts: 'next_action',
    };

    return (
      <TaskList
        title={title}
        subtitle={subtitle}
        tasks={getCurrentTasks()}
        projects={projects}
        theme={theme}
        selectedTaskId={selectedTaskId}
        onSelectTask={handleSelectTask}
        onCompleteTask={completeTask}
        onDeleteTask={deleteTask}
        onAddTask={addTaskFromPartial}
        defaultStatus={defaultStatusMap[currentView]}
        showFilters={currentView === 'next'}
        groupByContext={currentView === 'next'}
        emptyMessage={
          currentView === 'inbox'
            ? 'Inbox zero! Great job.'
            : currentView === 'next'
            ? 'No next actions. Time to process your inbox!'
            : 'Nothing here yet.'
        }
      />
    );
  };

  return (
    <div className={`h-screen flex flex-col ${
      theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
    }`}>
      {/* Top bar (mobile) */}
      <header className={`md:hidden flex items-center justify-between px-4 h-14 border-b shrink-0 ${
        theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <h1 className={`text-lg font-semibold tracking-tight ${
          theme === 'dark' ? 'text-white' : 'text-zinc-900'
        }`}>
          FlowGTD
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'
            }`}
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'
            }`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          collapsed={!sidebarOpen}
          onToggleCollapse={() => setSidebarOpen(!sidebarOpen)}
          taskCounts={taskCounts}
        />

        {/* Main content area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Task list / view */}
          <div className={`flex-1 overflow-hidden ${
            selectedTask ? 'hidden md:block md:w-1/2 lg:w-3/5' : ''
          }`}>
            {renderMainContent()}
          </div>

          {/* Detail panel */}
          {selectedTask && (
            <div className={`w-full md:w-1/2 lg:w-2/5 absolute md:relative inset-0 z-30 md:z-auto ${
              theme === 'dark' ? 'bg-zinc-900' : 'bg-white'
            }`}>
              <TaskDetail
                task={selectedTask}
                projects={projects}
                theme={theme}
                onClose={() => setSelectedTaskId(null)}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowQuickCapture(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:bg-indigo-600 active:scale-95 transition-all"
      >
        <Plus size={24} />
      </button>

      {/* Mobile bottom nav */}
      <MobileNav
        currentView={currentView}
        onViewChange={handleViewChange}
        theme={theme}
      />

      {/* Quick capture modal */}
      {showQuickCapture && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowQuickCapture(false); setQuickCaptureText(''); }}
          />
          <div className={`relative w-full max-w-md mx-4 rounded-xl shadow-2xl border overflow-hidden ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'
          }`}>
            <div className={`flex items-center gap-3 px-4 border-b ${
              theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'
            }`}>
              <Plus size={18} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} />
              <input
                type="text"
                value={quickCaptureText}
                onChange={(e) => setQuickCaptureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleQuickCapture();
                  if (e.key === 'Escape') { setShowQuickCapture(false); setQuickCaptureText(''); }
                }}
                placeholder="Quick capture a task..."
                className={`flex-1 py-4 bg-transparent outline-none text-sm ${
                  theme === 'dark' ? 'text-zinc-200 placeholder:text-zinc-500' : 'text-zinc-800 placeholder:text-zinc-400'
                }`}
                autoFocus
              />
            </div>
            <div className={`px-4 py-3 flex items-center justify-between ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              <span className="text-xs">
                Will be added to <strong className={theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}>
                  {currentView === 'next' ? 'Next Actions' : currentView === 'waiting' ? 'Waiting For' : currentView === 'someday' ? 'Someday/Maybe' : 'Inbox'}
                </strong>
              </span>
              <button
                onClick={handleQuickCapture}
                disabled={!quickCaptureText.trim()}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        theme={theme}
        tasks={tasks}
        projects={projects}
        onNavigate={handleCommandPaletteNavigate}
        onSelectTask={handleCommandPaletteSelectTask}
        onQuickAdd={handleCommandPaletteQuickAdd}
      />
    </div>
  );
}

export default App;
