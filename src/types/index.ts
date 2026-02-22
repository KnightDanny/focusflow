import type {
  Task,
  Project,
  FocusSession,
  Note,
  Tag,
  UserSettings,
} from "@prisma/client";

// ─── Database Types with Relations ───────────────────────────

export type TaskWithRelations = Task & {
  project: Project | null;
  subtasks: Task[];
  tags: Tag[];
  notes: Note[];
};

export type ProjectWithTasks = Project & {
  tasks: Task[];
};

export type FocusSessionWithTask = FocusSession & {
  task: Task | null;
  notes: Note[];
};

// ─── Timer Types ─────────────────────────────────────────────

export type TimerMode = "pomodoro" | "deepFocus" | "custom";
export type TimerState = "idle" | "running" | "paused" | "break";

export interface TimerConfig {
  workDuration: number; // minutes
  shortBreak: number;
  longBreak: number;
  pomodorosBeforeLongBreak: number;
  customDuration: number;
}

// ─── Task Types ──────────────────────────────────────────────

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "ARCHIVED";
export type Priority = "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type SessionType = "POMODORO" | "DEEP_FOCUS" | "CUSTOM";
export type SessionStatus = "COMPLETED" | "INTERRUPTED" | "ABANDONED";

export type TaskView = "list" | "board" | "eisenhower";

export interface TaskFilter {
  status: TaskStatus | null;
  priority: Priority | null;
  projectId: string | null;
  search: string;
}

// ─── Re-exports ──────────────────────────────────────────────

export type {
  Task,
  Project,
  FocusSession,
  Note,
  Tag,
  UserSettings,
};
