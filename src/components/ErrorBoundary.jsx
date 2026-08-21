import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// App-wide crash guard — catches render errors anywhere below it and shows
// a recoverable screen instead of a blank white page.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-background">
          <div className="text-center space-y-4 px-6">
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
              <p className="text-sm text-muted-foreground mt-1">Please reload the page to continue.</p>
            </div>
            <Button onClick={this.handleReload}>Reload</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}