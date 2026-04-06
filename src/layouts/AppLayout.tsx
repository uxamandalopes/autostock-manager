import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import porscheLogo from "@/assets/porsche-logo.svg";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="h-14 border-b flex items-center px-6 shrink-0" style={{ backgroundColor: "#010101" }}>
          <img src={porscheLogo} alt="Porsche" className="h-8 object-contain" />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
