import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { computeDerivedFields } from "@/lib/stockCalculations";
import { useToast } from "@/components/ui/use-toast";

export default function StockItemFormDialog({ item, open, onOpenChange, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ details: "", category: "", minimum_stock_level: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({ details: item.details, category: item.category, minimum_stock_level: String(item.minimum_stock_level ?? "") });
    }
  }, [item]);

  const handleSave = async () => {
    setSaving(true);
    const minimum_stock_level = Number(form.minimum_stock_level) || 0;
    const derived = computeDerivedFields({ ...item, minimum_stock_level });
    await base44.entities.StockItem.update(item.id, {
      details: form.details,
      category: form.category,
      minimum_stock_level,
      status: derived.status,
    });
    setSaving(false);
    toast({ title: "Item updated" });
    onSaved?.();
    onOpenChange(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {item.item_id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Details</Label>
            <Input value={form.details} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Minimum Stock Level</Label>
            <Input type="number" value={form.minimum_stock_level} onChange={(e) => setForm((f) => ({ ...f, minimum_stock_level: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}