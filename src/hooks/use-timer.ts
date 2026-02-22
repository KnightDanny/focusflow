"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "@/stores/timer-store";

export function useTimer() {
  const store = useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio("/sounds/bell.mp3");
    audioRef.current.volume = 0.5;
    return () => {
      audioRef.current = null;
    };
  }, []);

  // Tick interval
  useEffect(() => {
    if (store.state === "running" || store.state === "break") {
      intervalRef.current = setInterval(() => {
        store.tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [store.state]);

  // Handle timer completion
  useEffect(() => {
    if (
      store.timeRemaining === 0 &&
      (store.state === "running" || store.state === "break")
    ) {
      // Play sound
      audioRef.current
        ?.play()
        .catch(() => {});

      // Desktop notification
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          const isBreakEnd = store.state === "break";
          new Notification("FocusFlow", {
            body: isBreakEnd
              ? "Break is over! Ready to focus again?"
              : "Focus session complete! Time for a break.",
            icon: "/icons/icon-192.png",
          });
        }
      }

      if (store.state === "running") {
        // Log session then transition
        logSession();
        store.completeSession();
      } else {
        // Break ended, go idle
        store.reset();
      }
    }
  }, [store.timeRemaining, store.state]);

  const logSession = useCallback(async () => {
    const { mode, totalTime, timeRemaining, sessionStartedAt, linkedTaskId } =
      useTimerStore.getState();

    if (!sessionStartedAt) return;

    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:
            mode === "pomodoro"
              ? "POMODORO"
              : mode === "deepFocus"
                ? "DEEP_FOCUS"
                : "CUSTOM",
          duration: Math.floor(totalTime / 60),
          actualTime: totalTime - timeRemaining,
          status: timeRemaining === 0 ? "COMPLETED" : "INTERRUPTED",
          startedAt: sessionStartedAt.toISOString(),
          taskId: linkedTaskId,
        }),
      });
    } catch {
      // Silently fail — session will not be logged
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }
  }, []);

  return {
    ...store,
    logSession,
    requestNotificationPermission,
  };
}
