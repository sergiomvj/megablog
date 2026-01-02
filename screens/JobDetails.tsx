
import React from 'react';
import { Screen, LogEntry } from '../types';

interface JobDetailsProps {
  jobId: string;
  onNavigate: (screen: Screen) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobId, onNavigate }) => {
  const logs: LogEntry[] = [
    { time: '10:42:01', level: 'Success', message: 'Keyword analysis complete' },
    { time: '10:42:02', level: 'Info', message: 'Loading templates for "How-to"...' },
    { time: '10:42:05', level: 'Info', message: 'Generating outline via GPT-4...' },
    { time: '10:42:12', level: 'Warn', message: 'Long response time detected' },
    { time: '10:42:15', level: 'Info', message: 'Drafting Section 1: Introduction...' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background-dark">
      <header className="flex items-center bg-background-dark p-4 justify-between border-b border-slate-800 z-10">
        <button onClick={() => onNavigate(Screen.QUEUE)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-800">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-base font-bold">Job #{jobId}</h2>
          <span className="text-[10px] text-slate-400">SEO Guide</span>
        </div>
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-800">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 p-4">
        <div className="flex flex-col gap-4 rounded-xl bg-surface-dark p-4 shadow-sm border border-slate-800 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/30 text-blue-300 uppercase tracking-wider w-fit mb-1">Processing</span>
              <h3 className="text-lg font-bold">AutoWriter Engine</h3>
              <p className="text-slate-400 text-sm">Target: blog.techsite.com</p>
            </div>
            <div className="size-16 rounded-lg bg-[url('https://picsum.photos/200/200?blur=2')] bg-cover border border-slate-700"></div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-300">Generating Content</span>
              <span className="text-xs text-primary font-bold">75%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center w-full relative">
            <div className="absolute top-[15px] left-0 w-full h-0.5 bg-slate-800 -z-0 rounded"></div>
            {[
              { label: 'Init', done: true },
              { label: 'Outline', done: true },
              { label: 'Draft', active: true },
              { label: 'Publish', pending: true }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2 z-10 relative">
                <div className={`size-8 rounded-full flex items-center justify-center border-4 border-background-dark shadow-sm ${
                  step.done ? 'bg-primary text-white' : 
                  step.active ? 'bg-surface-dark border-primary' : 'bg-slate-800 text-slate-500'
                }`}>
                  {step.done ? (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  ) : step.active ? (
                    <div className="size-2.5 rounded-full bg-primary animate-pulse"></div>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">circle</span>
                  )}
                </div>
                <span className={`text-[10px] bg-background-dark px-1 ${
                  step.active ? 'font-bold text-primary' : 'font-medium text-slate-400'
                }`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <details className="group rounded-xl bg-surface-dark border border-slate-800 overflow-hidden shadow-sm mb-6">
          <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 hover:bg-slate-800 transition-colors select-none">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">tune</span>
              <p className="text-sm font-medium">Job Parameters</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
          </summary>
          <div className="px-4 pb-4 pt-0">
            <div className="h-px w-full bg-slate-700 mb-4"></div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Keyword</p>
                <p className="text-sm font-medium">automated seo</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Type</p>
                <p className="text-sm font-medium">How-to Guide</p>
              </div>
            </div>
          </div>
        </details>

        <div className="rounded-xl bg-black border border-slate-800 overflow-hidden shadow-md">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Logs</h4>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] text-green-500 font-medium">Running</span>
            </div>
          </div>
          <div className="p-3 font-mono text-[10px] space-y-2 max-h-[300px] overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 text-slate-500">
                <span className="shrink-0 text-slate-600">[{log.time}]</span>
                <span className={
                  log.level === 'Success' ? 'text-green-400' : 
                  log.level === 'Warn' ? 'text-yellow-400' : 
                  log.level === 'Error' ? 'text-rose-400' : 'text-blue-400'
                }>{log.level}:</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
            <div className="flex gap-2 text-slate-500 bg-white/5 p-1 -mx-1 rounded">
              <span className="shrink-0 text-slate-600">[10:42:15]</span>
              <span className="text-blue-400">Info:</span>
              <span className="text-white">Drafting Section 1: Introduction...</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
          <div className="px-2 py-2 bg-slate-900 border-t border-slate-800 flex justify-end">
            <button className="flex items-center gap-1 px-2 py-1 hover:bg-slate-800 rounded text-[10px] text-slate-400">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
              View Full Audit
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-8 max-w-md mx-auto z-40">
        <div className="flex gap-3">
          <button className="flex-1 h-12 rounded-lg bg-surface-dark border border-slate-700 text-white font-semibold shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">pause</span>
            Pause
          </button>
          <button className="flex-[2] h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Retry Step
          </button>
        </div>
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default JobDetails;
