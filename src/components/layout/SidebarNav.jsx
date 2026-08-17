import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, ArrowLeftRight, BarChart3, ClipboardCheck, UploadCloud, Bot, LineChart, Settings, Inbox } from "lucide-react";
import { base44 } from "@/api/base44Client";

export const NAV_ITEMS = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Requisitions", path: "/requisitions", icon: Inbox },
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

export default function SidebarNav({ onNavigate }) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadPendingCount = async () => {
      const pending = await base44.entities.Requisition.filter({ status: "Pending" });
      setPendingCount(pending.length);
    };
    loadPendingCount();

    const unsubscribe = base44.entities.Requisition.subscribe(() => {
      loadPendingCount();
    });
    return unsubscribe;
  }, []);

  return (
    <>
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
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span className="flex-1">{item.name}</span>
            {item.path === "/requisitions" && pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-6 text-xs text-sidebar-foreground/40">© {new Date().getFullYear()}</div>
    </>
  );
}