"use client";

import { useState } from "react";
import {
  Circle,
  CheckCircle2,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";
import type { TaskWithRelations, Priority } from "@/types";

interface TaskItemProps {
  task: TaskWithRelations;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  onSelect: (task: TaskWithRelations) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  dragHandleProps?: Record<string, unknown>;
}

const priorityColors: Record<string, string> = {
  URGENT: "border-l-red-500",
  HIGH: "border-l-orange-500",
  MEDIUM: "border-l-blue-500",
  LOW: "border-l-slate-300 dark:border-l-slate-600",
};

const priorityLabels: Record<string, string> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onSelect,
  dragHandleProps,
}: TaskItemProps) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isDone = task.status === "DONE";
  const completedSubtasks = task.subtasks.filter(
    (s) => s.status === "DONE"
  ).length;

  return (
    <div
      className={cn(
        "group rounded-lg border border-l-4 border-slate-200 bg-white transition-all hover:shadow-sm dark:border-slate-800 dark:bg-slate-950",
        priorityColors[task.priority],
        isDone && "opacity-60"
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id, !isDone)}
          className="shrink-0"
        >
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="h-5 w-5 text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400" />
          )}
        </button>

        {/* Task content */}
        <button
          onClick={() => onSelect(task)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span
            className={cn(
              "text-sm text-slate-900 dark:text-white",
              isDone && "line-through text-slate-400 dark:text-slate-500"
            )}
          >
            {task.title}
          </span>
        </button>

        {/* Meta */}
        <div className="flex items-center gap-2">
          {/* Project badge */}
          {task.project && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${task.project.color}15`,
                color: task.project.color,
              }}
            >
              {task.project.name}
            </span>
          )}

          {/* Priority badge */}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              task.priority === "URGENT" &&
                "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
              task.priority === "HIGH" &&
                "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
              task.priority === "MEDIUM" &&
                "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
              task.priority === "LOW" &&
                "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            )}
          >
            {priorityLabels[task.priority]}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <span
              className={cn(
                "text-xs",
                isPast(new Date(task.dueDate)) && !isDone
                  ? "font-medium text-red-600 dark:text-red-400"
                  : isToday(new Date(task.dueDate))
                    ? "font-medium text-amber-600 dark:text-amber-400"
                    : "text-slate-400 dark:text-slate-500"
              )}
            >
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}

          {/* Subtask count */}
          {task.subtasks.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSubtasks(!showSubtasks);
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showSubtasks ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              {completedSubtasks}/{task.subtasks.length}
            </button>
          )}

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:text-slate-600 group-hover:opacity-100 dark:hover:text-slate-300"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks */}
      {showSubtasks && task.subtasks.length > 0 && (
        <div className="border-t border-slate-100 px-10 py-2 dark:border-slate-800">
          {task.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-2 py-1"
            >
              <button onClick={() => onToggle(subtask.id, subtask.status !== "DONE")}>
                {subtask.status === "DONE" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-300 hover:text-slate-500 dark:text-slate-600" />
                )}
              </button>
              <span
                className={cn(
                  "text-sm",
                  subtask.status === "DONE"
                    ? "text-slate-400 line-through dark:text-slate-500"
                    : "text-slate-700 dark:text-slate-300"
                )}
              >
                {subtask.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
