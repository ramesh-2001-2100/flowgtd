import React from 'react';
import {
  Inbox,
  Zap,
  FolderKanban,
  Clock,
  Lightbulb,
} from 'lucide-react';
import { ViewType } from '../types';

interface MobileNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  theme: 'light' | 'dark';
}

const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox size={20} /> },
  { id: 'next', label: 'Next', icon: <Zap size={20} /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
  { id: 'waiting', label: 'Waiting', icon: <Clock size={20} /> },
  { id: 'someday', label: 'Someday', icon: <Lightbulb size={20} /> },
];

export default function MobileNav({ currentView, onViewChange, theme }: MobileNavProps) {
  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${
        theme === 'dark'
          ? 'bg-zinc-900 border-zinc-800'
          : 'bg-white border-zinc-200'
      }`}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? theme === 'dark'
                    ? 'text-indigo-400'
                    : 'text-indigo-600'
                  : theme === 'dark'
                  ? 'text-zinc-500'
                  : 'text-zinc-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
