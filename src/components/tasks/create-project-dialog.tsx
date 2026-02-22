"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (project: { name: string; color: string }) => void;
}

const colors = [
  "#6366f1", // indigo
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
];

export function CreateProjectDialog({
  open,
  onClose,
  onCreate,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), color });
    setName("");
    setColor(colors[0]);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-1/3 z-50 mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            New Project
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name (e.g., Anatomy, Side Project)"
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:text-white"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Color
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-transform ${color === c ? "scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900" : "hover:scale-105"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
