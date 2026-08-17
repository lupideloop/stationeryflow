import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function RequisitionItemRow({ item, onChange, onRemove, canRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <Input
        value={item.item_name}
        onChange={(e) => onChange("item_name", e.target.value)}
        placeholder="Item name"
        className="flex-1"
      />
      <Input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) => onChange("quantity", e.target.value)}
        placeholder="Qty"
        className="w-20"
      />
      {canRemove && (
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}