"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { TaskList } from "./task-list";
import { TaskFilters } from "./task-filters";
import { CreateTaskDialog } from "./create-task-dialog";
import { CreateProjectDialog } from "./create-project-dialog";
import type {
  TaskWithRelations,
  TaskStatus,
  Priority,
  Project,
} from "@/types";

export function TasksPageClient() {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  // Dialogs
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const fetchTasks = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    if (projectFilter) params.set("projectId", projectFilter);
    if (search) params.set("search", search);

    const res = await fetch(`/api/tasks?${params}`);
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
  }, [statusFilter, priorityFilter, projectFilter, search]);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchProjects()]).finally(() =>
      setLoading(false)
    );
  }, [fetchTasks, fetchProjects]);

  const handleCreateTask = async (task: {
    title: string;
    priority: Priority;
    projectId: string | null;
    dueDate: string | null;
  }) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (res.ok) {
      toast.success("Task created");
      fetchTasks();
    } else {
      toast.error("Failed to create task");
    }
  };

  const handleCreateProject = async (project: {
    name: string;
    color: string;
  }) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (res.ok) {
      toast.success("Project created");
      fetchProjects();
    } else {
      toast.error("Failed to create project");
    }
  };

  const handleToggle = async (id: string, done: boolean) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) return { ...t, status: done ? "DONE" : "TODO" };
        return {
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === id ? { ...s, status: done ? "DONE" : "TODO" } : s
          ),
        };
      })
    );

    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: done ? "DONE" : "TODO" }),
    });

    if (!res.ok) {
      toast.error("Failed to update task");
      fetchTasks(); // Revert
    }
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Task deleted");
    } else {
      toast.error("Failed to delete task");
      fetchTasks();
    }
  };

  const handleSelect = (task: TaskWithRelations) => {
    // TODO: Open task detail panel
    console.log("Selected task:", task.id);
  };

  const handleUpdatePriority = async (id: string, priority: Priority) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    });
    if (res.ok) fetchTasks();
  };

  // Keyboard shortcut: Cmd+N to create task
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setShowCreateTask(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            {tasks.filter((t) => t.status === "DONE").length > 0 &&
              ` \u00B7 ${tasks.filter((t) => t.status === "DONE").length} completed`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateProject(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <FolderPlus className="h-4 w-4" />
            Project
          </button>
          <button
            onClick={() => setShowCreateTask(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        projectId={projectFilter}
        onProjectChange={setProjectFilter}
        projects={projects}
      />

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSelect={handleSelect}
        onUpdatePriority={handleUpdatePriority}
      />

      {/* Dialogs */}
      <CreateTaskDialog
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onCreate={handleCreateTask}
        projects={projects}
      />
      <CreateProjectDialog
        open={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onCreate={handleCreateProject}
      />

      {/* Keyboard hint */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Press{" "}
        <kbd className="rounded border border-slate-300 px-1.5 py-0.5 text-xs dark:border-slate-700">
          Ctrl+N
        </kbd>{" "}
        to create a new task
      </p>
    </div>
  );
}
