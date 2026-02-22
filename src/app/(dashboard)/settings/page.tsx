import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
        <Settings className="h-8 w-8 text-slate-600 dark:text-slate-400" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        Settings Coming Soon
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Timer preferences, notifications, and account settings will be available
        soon.
      </p>
    </div>
  );
}
