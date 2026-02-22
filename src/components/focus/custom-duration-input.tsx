"use client";

import { Minus, Plus } from "lucide-react";

interface CustomDurationInputProps {
  duration: number; // minutes
  onDurationChange: (minutes: number) => void;
  disabled?: boolean;
}

export function CustomDurationInput({
  duration,
  onDurationChange,
  disabled,
}: CustomDurationInputProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        Duration:
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDurationChange(Math.max(5, duration - 5))}
          disabled={disabled || duration <= 5}
          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-16 text-center text-lg font-semibold tabular-nums text-slate-900 dark:text-white">
          {duration}m
        </span>
        <button
          onClick={() => onDurationChange(Math.min(180, duration + 5))}
          disabled={disabled || duration >= 180}
          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
