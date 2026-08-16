import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const MCP_URL = new URL("/api/mcp", window.location.origin).toString();

function CopyUrlBox() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(MCP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
      <code className="flex-1 text-sm text-slate-700 break-all">{MCP_URL}</code>
      <Button size="sm" variant="outline" onClick={handleCopy}>
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}

const STEPS = {
  claude: [
    "Open Claude and go to your profile menu → Settings → Connectors.",
    'Click "Add custom connector".',
    "Give it a name (e.g. StationeryFlow).",
    "Paste the MCP URL above and click Add.",
  ],
  chatgpt: [
    "In ChatGPT, go to Apps and enable Developer mode (you'll see a risk warning — accept it).",
    'Click "Create app".',
    "Give it a name and paste the MCP URL above.",
    "Click Create, then enable the app from the chat composer before prompting it.",
  ],
  cursor: [
    "In Cursor, go to Settings → Tools & Integrations.",
    'Click "New MCP Server" — this opens mcp.json.',
    "Add an entry whose url is the MCP URL above, then save.",
    "Toggle the new server on.",
  ],
  custom: [
    "Copy the MCP URL above.",
    "In your AI client, add it as a streamable HTTP MCP server.",
    "Most clients only need a name and the URL.",
    "Reload the client to pick up the new tools.",
  ],
};

export default function Connect() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Connect an AI Assistant</h1>
        <p className="text-sm text-slate-500 mt-1">
          Point Claude, ChatGPT, Cursor, or any MCP-compatible client at this app's data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Server URL</CardTitle>
        </CardHeader>
        <CardContent>
          <CopyUrlBox />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="claude">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="claude">Claude</TabsTrigger>
              <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
              <TabsTrigger value="cursor">Cursor</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            {Object.entries(STEPS).map(([key, steps]) => (
              <TabsContent key={key} value={key}>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 mt-2">
                  {steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500">
        This server is public and read-only. After we ship changes to the app, refresh the connector in your AI client so it picks up the latest tools.
      </p>
    </div>
  );
}