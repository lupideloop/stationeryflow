import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function RequisitionLinksSection() {
  const [departments, setDepartments] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = useCallback(async () => {
    const [deps, lnks] = await Promise.all([
      base44.entities.Department.list("name", 200),
      base44.entities.RequisitionLink.list("-created_date", 200),
    ]);
    setDepartments(deps);
    setLinks(lnks);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleGenerate = async () => {
    if (!selectedDept) return;
    const token = crypto.randomUUID();
    await base44.entities.RequisitionLink.create({ department_name: selectedDept, token, active: true });
    setSelectedDept("");
    load();
  };

  const handleCopy = (token) => {
    const url = `${window.location.origin}/requisition?token=${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied to clipboard" });
  };

  const handleToggleActive = async (link) => {
    await base44.entities.RequisitionLink.update(link.id, { active: !link.active });
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities.RequisitionLink.delete(id);
    load();
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      {departments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add departments in <Link to="/configuration" className="underline">Configuration</Link> first to generate requisition links.
        </p>
      ) : (
        <div className="flex gap-2">
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Select a department" /></SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={!selectedDept}>Generate Link</Button>
        </div>
      )}

      <div className="space-y-2">
        {links.length === 0 && <p className="text-sm text-muted-foreground">No requisition links yet.</p>}
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-md border bg-card">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{link.department_name}</p>
              <p className="text-xs text-muted-foreground truncate">{window.location.origin}/requisition?token={link.token}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Switch checked={link.active !== false} onCheckedChange={() => handleToggleActive(link)} />
              <Button variant="ghost" size="icon" onClick={() => handleCopy(link.token)}><Copy className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}