"use client";

import { useMemo } from "react";
import { Lightbulb } from "lucide-react";

const suggestions = [
  "Stand up and stretch for 30 seconds",
  "Look at something 20 feet away for 20 seconds (20-20-20 rule)",
  "Drink a glass of water",
  "Do 10 jumping jacks or squats",
  "Take 5 deep breaths — in for 4, hold for 4, out for 4",
  "Walk around the room",
  "Roll your neck and shoulders to release tension",
  "Close your eyes and relax your face muscles",
  "Do a quick hand and wrist stretch",
  "Stand by a window and look outside for a moment",
];

export function BreakSuggestion() {
  const suggestion = useMemo(
    () => suggestions[Math.floor(Math.random() * suggestions.length)],
    []
  );

  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/50">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div>
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
          Break suggestion
        </p>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
          {suggestion}
        </p>
      </div>
    </div>
  );
}
