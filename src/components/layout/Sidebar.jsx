import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, ArrowLeftRight, BarChart3, ClipboardCheck, UploadCloud, Bot, LineChart, Settings } from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Master Stock", path: "/master-stock", icon: Package },
  { name: "Purchases", path: "/purchases", icon: ShoppingCart },
  { name: "Transfers", path: "/transfers", icon: ArrowLeftRight },
  { name: "Monthly Summary", path: "/monthly-summary", icon: BarChart3 },
  { name: "Stock Take", path: "/stock-take", icon: ClipboardCheck },
  { name: "Reports", path: "/reports", icon: LineChart },
  { name: "Import Data", path: "/import", icon: UploadCloud },
  { name: "Connect AI", path: "/connect", icon: Bot },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-sidebar sidebar-gradient text-sidebar-foreground min-h-screen shrink-0 print:hidden">
      <div className="px-6 py-8">
        <h1 className="text-lg font-semibold tracking-tight text-sidebar-accent-foreground">Stationery Inventory</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Pro Edition</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-6 text-xs text-sidebar-foreground/40">© {new Date().getFullYear()}</div>
    </aside>
  );
}