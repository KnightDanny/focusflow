import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Timer, CheckSquare, BarChart3, Calendar } from "lucide-react";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="w-full max-w-md space-y-8 px-6">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <Timer className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
            FocusFlow
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Your productivity companion for focused work and study
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Timer, label: "Focus Timer" },
            { icon: CheckSquare, label: "Task Management" },
            { icon: Calendar, label: "Calendar Sync" },
            { icon: BarChart3, label: "Analytics" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2.5"
            >
              <Icon className="h-4 w-4 text-indigo-400" />
              <span className="text-xs text-slate-300">{label}</span>
            </div>
          ))}
        </div>

        {/* Google Sign in */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </form>

        {/* Dev-only quick login */}
        {isDev && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-500">DEV MODE</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>
            <form
              action={async (formData: FormData) => {
                "use server";
                await signIn("credentials", {
                  email: formData.get("email") as string,
                  redirectTo: "/",
                });
              }}
            >
              <div className="space-y-3">
                <input
                  name="email"
                  type="email"
                  defaultValue="dev@focusflow.local"
                  placeholder="Email for dev login"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Quick Dev Login
                </button>
              </div>
            </form>
          </>
        )}

        <p className="text-center text-xs text-slate-500">
          Sign in to sync your data across devices and connect Google Calendar
        </p>
      </div>
    </div>
  );
}
