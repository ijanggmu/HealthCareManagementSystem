"use client"

import React from 'react';
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

function ErrorFallback() {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "An error occurred",
      description: "We're sorry, but something went wrong. Please try again later.",
      variant: "destructive",
    });
  }, [toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="mb-4">We're sorry, but an error occurred. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    </div>
  );
}

export default ErrorBoundary;