import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, CheckCircle2, Loader2 } from "lucide-react";
import RequisitionItemRow from "@/components/requisition/RequisitionItemRow";

export default function RequisitionForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const [departmentName, setDepartmentName] = useState("");
  const [linkError, setLinkError] = useState("");
  const [loadingLink, setLoadingLink] = useState(true);

  const [requesterName, setRequesterName] = useState("");
  const [items, setItems] = useState([{ item_name: "", quantity: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkLink = async () => {
      if (!token) {
        setLinkError("This requisition link is missing or invalid.");
        setLoadingLink(false);
        return;
      }
      try {
        const res = await base44.functions.invoke("getRequisitionLink", { token });
        setDepartmentName(res.data.department_name);
      } catch (e) {
        setLinkError("This requisition link is invalid or has been deactivated.");
      } finally {
        setLoadingLink(false);
      }
    };
    checkLink();
  }, [token]);

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  };

  const addRow = () => setItems((prev) => [...prev, { item_name: "", quantity: "" }]);
  const removeRow = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validItems = items.filter((it) => it.item_name.trim() && it.quantity);
    if (!requesterName.trim() || validItems.length === 0) {
      setError("Please enter your name and at least one item with a quantity.");
      return;
    }
    setSubmitting(true);
    try {
      await base44.functions.invoke("submitRequisition", {
        token,
        requester_name: requesterName.trim(),
        items: validItems.map((it) => ({ item_name: it.item_name.trim(), quantity: Number(it.quantity) })),
      });
      setSubmitted(true);
    } catch (e) {
      setError("Something went wrong submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingLink) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  if (linkError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full"><CardContent className="pt-6 text-center text-slate-600">{linkError}</CardContent></Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <p className="font-medium text-slate-800">Request submitted</p>
            <p className="text-sm text-slate-500">Your stationery requisition has been sent for review.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Stationery Requisition Form</CardTitle>
          <p className="text-sm text-slate-500">Department: <span className="font-medium text-slate-700">{departmentName}</span></p>
          <p className="text-xs text-slate-400">Date: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Your Name</Label>
              <Input value={requesterName} onChange={(e) => setRequesterName(e.target.value)} placeholder="Full name" />
            </div>

            <div className="space-y-2">
              <Label>Items Required</Label>
              {items.map((item, index) => (
                <RequisitionItemRow
                  key={index}
                  item={item}
                  onChange={(field, value) => updateItem(index, field, value)}
                  onRemove={() => removeRow(index)}
                  canRemove={items.length > 1}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addRow}>
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}