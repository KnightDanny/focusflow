"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { TaskStatus, Priority, Project } from "@/types";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: TaskStatus | null;
  onStatusChange: (status: TaskStatus | null) => void;
  priority: Priority | null;
  onPriorityChange: (priority: Priority | null) => void;
  projectId: string | null;
  onProjectChange: (projectId: string | null) => void;
  projects: Project[];
}

export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  projectId,
  onProjectChange,
  projects,
}: TaskFiltersProps) {
  const statuses: { value: TaskStatus | null; label: string }[] = [
    { value: null, label: "All" },
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  const priorities: { value: Priority | null; label: string }[] = [
    { value: null, label: "All" },
    { value: "URGENT", label: "Urgent" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
  ];

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-slate-200 bg-transparent py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:text-white"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-4">
        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <div className="flex gap-1">
            {statuses.map(({ value, label }) => (
              <button
                key={label}
                onClick={() => onStatusChange(value)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  status === value
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority filter */}
        <div className="flex gap-1">
          {priorities.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => onPriorityChange(value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                priority === value
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Project filter */}
        {projects.length > 0 && (
          <select
            value={projectId || ""}
            onChange={(e) => onProjectChange(e.target.value || null)}
            className="rounded-md border border-slate-200 bg-transparent px-2 py-1 text-xs text-slate-600 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:text-slate-400"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
