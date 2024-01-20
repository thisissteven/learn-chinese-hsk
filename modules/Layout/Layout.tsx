import { DesktopSidebar, MobileSidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-black text-white">
      <div className="mx-auto max-w-[1440px] flex gap-4">
        <DesktopSidebar />
        {children}
      </div>
    </div>
  );
}
