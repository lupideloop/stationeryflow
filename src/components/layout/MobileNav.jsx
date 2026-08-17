import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarNav from "./SidebarNav";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center h-14 px-4 bg-sidebar sidebar-gradient text-sidebar-foreground shrink-0 print:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Open menu"
            className="p-2 -ml-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar sidebar-gradient text-sidebar-foreground border-none flex flex-col">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <h1 className="ml-3 text-base font-semibold tracking-tight text-sidebar-accent-foreground">Stationery Inventory</h1>
    </div>
  );
}