import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function ImportData() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleImport = async () => {
    if (!url.trim()) {
      toast({ title: "Enter a link", description: "Paste your Google Sheets URL first.", variant: "destructive" });
      return;
    }
    setImporting(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke("importGoogleSheet", { spreadsheetUrl: url.trim() });
      setResult(res.data);
      toast({ title: "Import complete" });
    } catch (error) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
    }
    setImporting(false);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Import from Google Sheets</h1>
        <p className="text-sm text-slate-500 mt-1">
          Bring in your Master Stock, Purchase Log, and Transfer Log tabs from your existing spreadsheet.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader><CardTitle className="text-base font-semibold">Spreadsheet Link</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Google Sheets URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
            <p className="text-xs text-slate-400">
              Make sure the sheet has tabs named exactly "Master Stock", "Purchase Log", and "Transfer Log".
            </p>
          </div>
          <Button onClick={handleImport} disabled={importing} className="w-full gap-2">
            <UploadCloud className="w-4 h-4" /> {importing ? "Importing..." : "Import Data"}
          </Button>

          {result && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" /> Import summary
              </div>
              <p className="text-sm text-emerald-800">{result.masterStock} new items added to Master Stock</p>
              <p className="text-sm text-emerald-800">{result.purchases} purchase records imported</p>
              <p className="text-sm text-emerald-800">{result.transfers} transfer records imported</p>
              {result.skippedItems > 0 && (
                <p className="text-sm text-emerald-700">{result.skippedItems} items skipped (Item ID already exists)</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}