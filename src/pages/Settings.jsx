import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import AccountSection from "@/components/settings/AccountSection";
import AppearanceSection from "@/components/settings/AppearanceSection";
import NotificationSection from "@/components/settings/NotificationSection";
import RequisitionLinksSection from "@/components/settings/RequisitionLinksSection";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, appearance and notification preferences.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
        <CardContent><AccountSection /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
        <CardContent><AppearanceSection /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent><NotificationSection /></CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Data Setup</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/configuration"><Settings2 className="w-4 h-4 mr-2" />Configure Departments & Categories</Link>
          </Button>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Set up your own departments and stock categories used for requisition links.</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Requisition Links</CardTitle></CardHeader>
        <CardContent><RequisitionLinksSection /></CardContent>
      </Card>
    </div>
  );
}