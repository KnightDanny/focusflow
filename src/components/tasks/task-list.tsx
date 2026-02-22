"use client";

import { TaskItem } from "./task-item";
import type { TaskWithRelations, Priority } from "@/types";

interface TaskListProps {
  tasks: TaskWithRelations[];
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  onSelect: (task: TaskWithRelations) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
}

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  onSelect,
  onUpdatePriority,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No tasks yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onSelect={onSelect}
          onUpdatePriority={onUpdatePriority}
        />
      ))}
    </div>
  );
}
