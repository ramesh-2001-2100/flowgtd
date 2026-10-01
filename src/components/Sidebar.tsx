import React from 'react';
import {
  Inbox,
  Zap,
  FolderKanban,
  Clock,
  Lightbulb,
  AtSign,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  taskCounts: Record<string, number>;
  onSettingsClick?: () => void;
}

const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox size={20} /> },
  { id: 'next', label: 'Next Actions', icon: <Zap size={20} /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
  { id: 'waiting', label: 'Waiting For', icon: <Clock size={20} /> },
  { id: 'someday', label: 'Someday / Maybe', icon: <Lightbulb size={20} /> },
  { id: 'contexts', label: 'Contexts', icon: <AtSign size={20} /> },
];

export default function Sidebar({
  currentView,
  onViewChange,
  theme,
  onThemeToggle,
  collapsed,
  onToggleCollapse,
  taskCounts,
  onSettingsClick,
}: SidebarProps) {
  return (
    <aside
      className={`hidden md:flex flex-col h-full border-r transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } ${
        theme === 'dark'
          ? 'bg-zinc-900 border-zinc-800'
          : 'bg-white border-zinc-200'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} h-14 border-b ${
        theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        {!collapsed && (
          <h1 className={`text-lg font-semibold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}>
            FlowGTD
          </h1>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark'
              ? 'hover:bg-zinc-800 text-zinc-400'
              : 'hover:bg-zinc-100 text-zinc-500'
          }`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const count = taskCounts[item.id] || 0;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'bg-indigo-50 text-indigo-700'
                  : theme === 'dark'
                  ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-indigo-100 text-indigo-600'
                        : theme === 'dark'
                        ? 'bg-zinc-800 text-zinc-500'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-2 py-3 border-t space-y-1 ${
        theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
      }`}>
        <button
          onClick={onThemeToggle}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            theme === 'dark'
              ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          } ${collapsed ? 'justify-center' : ''}`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === 'dark'
                ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            <Settings size={20} />
            {!collapsed && <span>Import / Export</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
