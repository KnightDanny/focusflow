import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="rounded-full bg-rose-50 p-4 dark:bg-rose-950">
        <BarChart3 className="h-8 w-8 text-rose-600 dark:text-rose-400" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        Analytics Coming Soon
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Productivity insights and charts will be available in a future update.
      </p>
    </div>
  );
}
