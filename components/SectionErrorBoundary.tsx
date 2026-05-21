"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  sectionLabel: string;
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class SectionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[SectionErrorBoundary] error caught in "${this.props.sectionLabel}":`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50/50 border border-red-200/60 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm animate-[slideUp_0.2s_ease-out]">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-red-800 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Module Error
            </h4>
            <p className="text-xs text-red-700/80 leading-relaxed font-medium">
              We couldn't render the <strong>{this.props.sectionLabel}</strong> module. This can happen if configuration details are temporarily out of sync.
            </p>
            {this.state.error?.message && (
              <p className="text-[10px] font-mono text-red-650/70 bg-red-100/30 px-2 py-1 rounded max-w-lg truncate">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.handleRetry}
            className="self-start sm:self-center px-4 py-2 border border-red-200 hover:border-red-850 hover:bg-white text-red-700 hover:text-black text-xs font-semibold rounded-xl transition cursor-pointer select-none"
          >
            Attempt Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
