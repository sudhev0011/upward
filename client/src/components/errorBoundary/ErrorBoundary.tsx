import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical Application Crash:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {/* Icon Banner */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>

            {/* Context Heading */}
            <h1 className="text-center text-2xl font-bold tracking-tight">Application Error</h1>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Something unexpected went wrong while loading this page.
            </p>

            {/* Exact Error Informer Box */}
            <div className="mt-5 rounded-lg bg-slate-100 p-4 font-mono text-xs dark:bg-slate-800">
              <div className="font-semibold text-red-500 dark:text-red-400 mb-1">
                {this.state.error?.name || "Error"}:
              </div>
              <div className="break-words text-slate-700 dark:text-slate-300">
                {this.state.error?.message || "An unknown runtime exception occurred."}
              </div>
            </div>

            {/* Recovery Actions */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;