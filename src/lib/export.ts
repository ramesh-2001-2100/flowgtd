import { Task, Project } from '../types';

interface ExportData {
  version: string;
  exportedAt: string;
  tasks: Task[];
  projects: Project[];
  theme: 'light' | 'dark';
}

// Export to JSON
export function exportToJSON(tasks: Task[], projects: Project[], theme: 'light' | 'dark'): void {
  const data: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    tasks,
    projects,
    theme,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `flowgtd-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import from JSON
export async function importFromJSON(file: File): Promise<{
  tasks: Task[];
  projects: Project[];
  theme: 'light' | 'dark';
} | null> {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as ExportData;

    // Validate structure
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Invalid file: missing tasks array');
    }
    if (!data.projects || !Array.isArray(data.projects)) {
      throw new Error('Invalid file: missing projects array');
    }

    // Validate each task has required fields
    for (const task of data.tasks) {
      if (!task.id || !task.title || !task.status) {
        throw new Error('Invalid file: task missing required fields');
      }
    }

    // Validate each project has required fields
    for (const project of data.projects) {
      if (!project.id || !project.name) {
        throw new Error('Invalid file: project missing required fields');
      }
    }

    return {
      tasks: data.tasks,
      projects: data.projects,
      theme: data.theme || 'light',
    };
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}

// Export to CSV (tasks only)
export function exportToCSV(tasks: Task[], projects: Project[]): void {
  const headers = [
    'Title',
    'Status',
    'Project',
    'Context',
    'Time Estimate',
    'Energy Level',
    'Due Date',
    'Delegated To',
    'Notes',
    'Created At',
    'Completed At',
  ];

  const rows = tasks.map((task) => {
    const project = task.projectId
      ? projects.find((p) => p.id === task.projectId)?.name || ''
      : '';

    return [
      escapeCSV(task.title),
      task.status,
      escapeCSV(project),
      task.context || '',
      task.timeEstimate || '',
      task.energyLevel || '',
      task.dueDate ? task.dueDate.split('T')[0] : '',
      escapeCSV(task.delegatedTo || ''),
      escapeCSV(task.notes || ''),
      new Date(task.createdAt).toLocaleDateString(),
      task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '',
    ];
  });

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `flowgtd-tasks-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper to escape CSV values
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
