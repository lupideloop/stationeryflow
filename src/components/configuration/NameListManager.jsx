import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

export default function NameListManager({ entityName, label }) {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await base44.entities[entityName].list("name", 200);
    setItems(data);
    setLoading(false);
  }, [entityName]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await base44.entities[entityName].create({ name: newName.trim() });
    setNewName("");
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities[entityName].delete(id);
    load();
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`New ${label.toLowerCase()} name`}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>
      <div className="space-y-1">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No {label.toLowerCase()}s added yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-3 py-2 rounded-md border bg-card">
            <span className="text-sm">{item.name}</span>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}