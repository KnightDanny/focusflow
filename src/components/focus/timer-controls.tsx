"use client";

import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import type { TimerState } from "@/types";

interface TimerControlsProps {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({
  state,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Reset */}
      {state !== "idle" && (
        <button
          onClick={onReset}
          className="rounded-full p-3 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      )}

      {/* Main action */}
      {state === "idle" && (
        <button
          onClick={onStart}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/40"
          title="Start"
        >
          <Play className="h-6 w-6 pl-0.5" />
        </button>
      )}

      {state === "running" && (
        <button
          onClick={onPause}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600"
          title="Pause"
        >
          <Pause className="h-6 w-6" />
        </button>
      )}

      {state === "paused" && (
        <button
          onClick={onResume}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-700"
          title="Resume"
        >
          <Play className="h-6 w-6 pl-0.5" />
        </button>
      )}

      {state === "break" && (
        <button
          onClick={onSkip}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700"
          title="Skip Break"
        >
          <SkipForward className="h-6 w-6" />
        </button>
      )}

      {/* Skip break (small button) */}
      {state === "break" && (
        <button
          onClick={onReset}
          className="rounded-full p-3 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="End session"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
