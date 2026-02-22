import { Calendar } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="rounded-full bg-amber-50 p-4 dark:bg-amber-950">
        <Calendar className="h-8 w-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        Calendar Coming Soon
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Google Calendar integration will be available in a future update.
      </p>
    </div>
  );
}
