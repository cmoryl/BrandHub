
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  title: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class StudioBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Studio Protocol Fault [${this.props.title}]:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-red-600 dark:text-red-400 uppercase tracking-tight">Studio Node Fragmented</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed uppercase font-bold tracking-widest">
              A structural fault occurred in the {this.props.title} protocol. Node isolated to prevent system-wide contamination.
            </p>
          </div>
          <button 
            // Fix: Reference class member using 'this'
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Initialize Node
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default StudioBoundary;