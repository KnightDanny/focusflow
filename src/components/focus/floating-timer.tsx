"use client";

import { useTimerStore } from "@/stores/timer-store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Timer } from "lucide-react";
import { formatTime } from "@/lib/utils";

export function FloatingTimer() {
  const { state, timeRemaining, mode, pause, resume } = useTimerStore();
  const pathname = usePathname();

  const isTimerActive = state === "running" || state === "paused" || state === "break";
  const isOnFocusPage = pathname === "/focus";
  const shouldShow = isTimerActive && !isOnFocusPage;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <Link
              href="/focus"
              className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white"
            >
              <Timer className="h-4 w-4 text-indigo-600" />
              <span className="tabular-nums">{formatTime(timeRemaining)}</span>
            </Link>

            {state === "running" ? (
              <button
                onClick={pause}
                className="rounded-full bg-amber-100 p-1.5 text-amber-700 transition-colors hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300"
              >
                <Pause className="h-3.5 w-3.5" />
              </button>
            ) : state === "paused" ? (
              <button
                onClick={resume}
                className="rounded-full bg-emerald-100 p-1.5 text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300"
              >
                <Play className="h-3.5 w-3.5" />
              </button>
            ) : null}

            <span className="text-xs text-slate-400">
              {state === "break" ? "Break" : mode === "deepFocus" ? "Deep" : "Focus"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
