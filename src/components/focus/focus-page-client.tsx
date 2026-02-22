"use client";

import { useEffect } from "react";
import { useTimer } from "@/hooks/use-timer";
import { CircularTimer } from "./circular-timer";
import { TimerControls } from "./timer-controls";
import { ModeSelector } from "./mode-selector";
import { AmbientSounds } from "./ambient-sounds";
import { BreakSuggestion } from "./break-suggestions";
import { CustomDurationInput } from "./custom-duration-input";

export function FocusPageClient() {
  const timer = useTimer();

  const isActive = timer.state !== "idle";

  // Request notification permission on mount
  useEffect(() => {
    timer.requestNotificationPermission();
  }, []);

  // Update page title with timer
  useEffect(() => {
    if (isActive) {
      const mins = Math.floor(timer.timeRemaining / 60);
      const secs = timer.timeRemaining % 60;
      document.title = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")} - FocusFlow`;
    } else {
      document.title = "Focus Timer - FocusFlow";
    }
    return () => {
      document.title = "FocusFlow";
    };
  }, [timer.timeRemaining, isActive]);

  // Keyboard shortcut: Space to start/pause
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (timer.state === "idle") timer.start();
        else if (timer.state === "running") timer.pause();
        else if (timer.state === "paused") timer.resume();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [timer.state]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode Selector */}
      <ModeSelector
        mode={timer.mode}
        onModeChange={timer.setMode}
        disabled={isActive}
      />

      {/* Custom Duration Input */}
      {timer.mode === "custom" && !isActive && (
        <CustomDurationInput
          duration={timer.config.customDuration}
          onDurationChange={timer.setCustomDuration}
        />
      )}

      {/* Timer */}
      <CircularTimer
        timeRemaining={timer.timeRemaining}
        totalTime={timer.totalTime}
        state={timer.state}
        mode={timer.mode}
        currentPomodoro={timer.currentPomodoro}
      />

      {/* Controls */}
      <TimerControls
        state={timer.state}
        onStart={timer.start}
        onPause={timer.pause}
        onResume={timer.resume}
        onReset={timer.reset}
        onSkip={timer.skip}
      />

      {/* Break Suggestion */}
      {timer.state === "break" && (
        <div className="w-full max-w-md">
          <BreakSuggestion />
        </div>
      )}

      {/* Ambient Sounds */}
      <div className="w-full max-w-md">
        <AmbientSounds />
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Press <kbd className="rounded border border-slate-300 px-1.5 py-0.5 text-xs dark:border-slate-700">Space</kbd> to start/pause
      </p>
    </div>
  );
}
