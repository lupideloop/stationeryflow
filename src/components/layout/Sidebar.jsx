import React from "react";
import SidebarNav from "./SidebarNav";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-sidebar sidebar-gradient text-sidebar-foreground h-screen shrink-0 overflow-y-auto print:hidden">
      <SidebarNav />
    </aside>
  );
}