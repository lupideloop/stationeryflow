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
    <aside className="hidden md:flex md:flex-col w-64 bg-[#0f1115] text-slate-200 min-h-screen shrink-0 print:hidden">
      <div className="px-6 py-8">
        <h1 className="text-lg font-semibold tracking-tight text-white">Stationery Inventory</h1>
        <p className="text-xs text-slate-500 mt-1">Pro Edition</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-6 text-xs text-slate-600">© {new Date().getFullYear()}</div>
    </aside>
  );
}