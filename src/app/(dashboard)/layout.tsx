import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { FloatingTimer } from "@/components/focus/floating-timer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar user={session.user} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
      <FloatingTimer />
    </div>
  );
}
