import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

export default function NewItemForm({ items, onCreated }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ item_id: "", details: "", category: "", minimum_stock_level: "", unit_cost: "" });
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.item_id || !form.details || !form.category) {
      toast({ title: "Missing fields", description: "Item ID, details and category are required.", variant: "destructive" });
      return;
    }
    if (items.some((i) => i.item_id.toLowerCase() === form.item_id.toLowerCase())) {
      toast({ title: "Duplicate Item ID", description: "This Item ID already exists in Master Stock.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const unit_cost = Number(form.unit_cost) || 0;
    const minimum_stock_level = Number(form.minimum_stock_level) || 0;
    await base44.entities.StockItem.create({
      item_id: form.item_id,
      details: form.details,
      category: form.category,
      qty_in: 0,
      qty_out: 0,
      stock_level: 0,
      unit_cost,
      total_value: 0,
      minimum_stock_level,
      status: minimum_stock_level > 0 ? "Low Stock" : "OK",
    });
    setSaving(false);
    setForm({ item_id: "", details: "", category: "", minimum_stock_level: "", unit_cost: "" });
    toast({ title: "Item registered", description: `${form.item_id} added to Master Stock.` });
    onCreated?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Item ID</Label>
          <Input value={form.item_id} onChange={(e) => update("item_id", e.target.value)} placeholder="STA-001" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Category</Label>
          <Select value={form.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Details</Label>
        <Input value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Item description" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Minimum Stock Level</Label>
          <Input type="number" value={form.minimum_stock_level} onChange={(e) => update("minimum_stock_level", e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Starting Unit Cost</Label>
          <Input type="number" value={form.unit_cost} onChange={(e) => update("unit_cost", e.target.value)} placeholder="0.00" />
        </div>
      </div>
      <Button type="submit" disabled={saving} className="w-full gap-2">
        <Plus className="w-4 h-4" /> {saving ? "Registering..." : "Register Item"}
      </Button>
    </form>
  );
}