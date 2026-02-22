import { auth } from "@/lib/auth";
import { Timer, CheckSquare, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {getGreeting()}, {session?.user?.name?.split(" ")[0] || "there"}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ready to focus? Here&apos;s your productivity overview.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            href: "/focus",
            icon: Timer,
            label: "Start Focus Session",
            description: "Pomodoro or deep focus timer",
            color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
            iconColor: "text-indigo-600 dark:text-indigo-400",
          },
          {
            href: "/tasks",
            icon: CheckSquare,
            label: "Manage Tasks",
            description: "View and organize your to-dos",
            color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
            iconColor: "text-emerald-600 dark:text-emerald-400",
          },
          {
            href: "/calendar",
            icon: Calendar,
            label: "View Calendar",
            description: "Check your schedule",
            color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
            iconColor: "text-amber-600 dark:text-amber-400",
          },
          {
            href: "/analytics",
            icon: BarChart3,
            label: "View Analytics",
            description: "Track your productivity",
            color: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
            iconColor: "text-rose-600 dark:text-rose-400",
          },
        ].map(({ href, icon: Icon, label, description, color, iconColor }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
          >
            <div
              className={`mb-3 inline-flex rounded-lg p-2.5 ${color}`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {label}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </Link>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Today&apos;s Tasks
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No tasks yet. Create your first task to get started.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Recent Focus Sessions
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No sessions yet. Start a focus session to begin tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
