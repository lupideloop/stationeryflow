import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function NotificationSection() {
  const { toast } = useToast();
  const [settingsId, setSettingsId] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const rows = await base44.entities.AppSettings.list();
      if (rows.length) {
        setSettingsId(rows[0].id);
        setEmail(rows[0].notification_email || "");
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (settingsId) {
      await base44.entities.AppSettings.update(settingsId, { notification_email: email });
    } else {
      const created = await base44.entities.AppSettings.create({ notification_email: email });
      setSettingsId(created.id);
    }
    setSaving(false);
    toast({ title: "Notification email saved" });
  };

  if (loading) return null;

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium text-slate-800">Notification Email</Label>
        <p className="text-xs text-slate-500 mt-0.5 mb-2">Low stock alerts will also be sent to this address.</p>
        <div className="flex gap-2 max-w-md">
          <Input type="email" placeholder="alerts@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}