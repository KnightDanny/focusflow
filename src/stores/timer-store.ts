import { create } from "zustand";
import type { TimerMode, TimerState, TimerConfig } from "@/types";

interface TimerStore {
  // State
  mode: TimerMode;
  state: TimerState;
  timeRemaining: number;
  totalTime: number;
  currentPomodoro: number;
  linkedTaskId: string | null;
  sessionStartedAt: Date | null;
  isMinimized: boolean;

  // Config
  config: TimerConfig;

  // Actions
  setMode: (mode: TimerMode) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  completeSession: () => void;
  linkTask: (taskId: string | null) => void;
  setMinimized: (minimized: boolean) => void;
  updateConfig: (config: Partial<TimerConfig>) => void;
  setCustomDuration: (minutes: number) => void;
}

const DEFAULT_CONFIG: TimerConfig = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  pomodorosBeforeLongBreak: 4,
  customDuration: 45,
};

function getDuration(mode: TimerMode, config: TimerConfig): number {
  switch (mode) {
    case "pomodoro":
      return config.workDuration * 60;
    case "deepFocus":
      return 90 * 60;
    case "custom":
      return config.customDuration * 60;
  }
}

function getBreakDuration(
  currentPomodoro: number,
  config: TimerConfig
): number {
  if (currentPomodoro % config.pomodorosBeforeLongBreak === 0) {
    return config.longBreak * 60;
  }
  return config.shortBreak * 60;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  mode: "pomodoro",
  state: "idle",
  timeRemaining: DEFAULT_CONFIG.workDuration * 60,
  totalTime: DEFAULT_CONFIG.workDuration * 60,
  currentPomodoro: 0,
  linkedTaskId: null,
  sessionStartedAt: null,
  isMinimized: false,
  config: DEFAULT_CONFIG,

  setMode: (mode) => {
    const config = get().config;
    const duration = getDuration(mode, config);
    set({
      mode,
      state: "idle",
      timeRemaining: duration,
      totalTime: duration,
      currentPomodoro: 0,
      sessionStartedAt: null,
    });
  },

  start: () => {
    const { mode, config } = get();
    const duration = getDuration(mode, config);
    set({
      state: "running",
      timeRemaining: duration,
      totalTime: duration,
      sessionStartedAt: new Date(),
    });
  },

  pause: () => set({ state: "paused" }),
  resume: () => set({ state: "running" }),

  reset: () => {
    const { mode, config } = get();
    const duration = getDuration(mode, config);
    set({
      state: "idle",
      timeRemaining: duration,
      totalTime: duration,
      sessionStartedAt: null,
    });
  },

  skip: () => {
    const { mode, config, state } = get();
    if (state === "break") {
      // Skip break, start new work session
      const duration = getDuration(mode, config);
      set({
        state: "idle",
        timeRemaining: duration,
        totalTime: duration,
        sessionStartedAt: null,
      });
    }
  },

  tick: () => {
    const { timeRemaining } = get();
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  completeSession: () => {
    const { mode, config, currentPomodoro } = get();
    if (mode === "pomodoro") {
      const newPomodoro = currentPomodoro + 1;
      const breakDuration = getBreakDuration(newPomodoro, config);
      set({
        state: "break",
        currentPomodoro: newPomodoro,
        timeRemaining: breakDuration,
        totalTime: breakDuration,
        sessionStartedAt: null,
      });
    } else {
      // Deep focus and custom just reset
      const duration = getDuration(mode, config);
      set({
        state: "idle",
        timeRemaining: duration,
        totalTime: duration,
        sessionStartedAt: null,
      });
    }
  },

  linkTask: (taskId) => set({ linkedTaskId: taskId }),
  setMinimized: (minimized) => set({ isMinimized: minimized }),

  updateConfig: (partial) => {
    const config = { ...get().config, ...partial };
    const { mode, state } = get();
    set({ config });
    if (state === "idle") {
      const duration = getDuration(mode, config);
      set({ timeRemaining: duration, totalTime: duration });
    }
  },

  setCustomDuration: (minutes) => {
    const config = { ...get().config, customDuration: minutes };
    set({ config });
    if (get().state === "idle" && get().mode === "custom") {
      set({ timeRemaining: minutes * 60, totalTime: minutes * 60 });
    }
  },
}));
