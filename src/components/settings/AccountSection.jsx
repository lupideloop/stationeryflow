import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, UserCircle } from "lucide-react";

export default function AccountSection() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">You're not signed in yet.</p>
        <div className="flex gap-3">
          <Button asChild><Link to="/login">Log In</Link></Button>
          <Button asChild variant="outline"><Link to="/register">Create Account</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <UserCircle className="w-9 h-9 text-slate-400" />
        <div>
          <p className="text-sm font-medium text-slate-800">{user?.full_name || user?.email}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        {user?.role && <Badge variant="secondary" className="ml-2 capitalize">{user.role}</Badge>}
      </div>
      <Button variant="outline" onClick={() => logout()}>
        <LogOut className="w-4 h-4 mr-2" /> Log Out
      </Button>
    </div>
  );
}