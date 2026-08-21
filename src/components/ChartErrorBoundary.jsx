import React from "react";
import { AlertTriangle } from "lucide-react";

// Scoped crash guard for a single chart card — if the chart throws, the rest
// of the page (and other cards) keep working.
export default class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center gap-2 border border-dashed border-border rounded-lg">
          <AlertTriangle className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">This chart couldn't be displayed.</p>
        </div>
      );
    }
    return this.props.children;
  }
}