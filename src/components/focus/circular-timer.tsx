"use client";

import { motion } from "framer-motion";
import { formatTime } from "@/lib/utils";
import type { TimerMode, TimerState } from "@/types";

interface CircularTimerProps {
  timeRemaining: number;
  totalTime: number;
  state: TimerState;
  mode: TimerMode;
  currentPomodoro: number;
}

const SIZE = 280;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getProgressColor(progress: number, state: TimerState): string {
  if (state === "break") return "#10b981"; // emerald
  if (progress > 0.6) return "#6366f1"; // indigo
  if (progress > 0.3) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

function getModeLabel(mode: TimerMode, state: TimerState): string {
  if (state === "break") return "Break";
  switch (mode) {
    case "pomodoro":
      return "Focus";
    case "deepFocus":
      return "Deep Focus";
    case "custom":
      return "Custom";
  }
}

export function CircularTimer({
  timeRemaining,
  totalTime,
  state,
  mode,
  currentPomodoro,
}: CircularTimerProps) {
  const progress = totalTime > 0 ? timeRemaining / totalTime : 1;
  const offset = CIRCUMFERENCE * (1 - progress);
  const color = getProgressColor(progress, state);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          className="text-slate-200 dark:text-slate-800"
        />

        {/* Progress circle */}
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {getModeLabel(mode, state)}
        </span>
        <span className="text-5xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
          {formatTime(timeRemaining)}
        </span>
        {mode === "pomodoro" && state !== "break" && (
          <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Session {currentPomodoro + 1}
          </span>
        )}
      </div>
    </div>
  );
}
