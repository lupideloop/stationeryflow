import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NameListManager from "@/components/configuration/NameListManager";

export default function Configuration() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Set up your own departments and stock categories.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Departments</CardTitle></CardHeader>
        <CardContent><NameListManager entityName="Department" label="Department" /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Stock Categories</CardTitle></CardHeader>
        <CardContent><NameListManager entityName="Category" label="Category" /></CardContent>
      </Card>
    </div>
  );
}