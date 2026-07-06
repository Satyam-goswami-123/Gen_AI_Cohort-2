import React from 'react';
import { BrainCircuit } from 'lucide-react';

export default function LoadingAnimation({ message = "AI is processing decision vectors..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        {/* Animated Pulse Ring */}
        <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl animate-ping scale-150"></div>
        <div className="relative p-6 bg-brand-600 rounded-3xl text-white shadow-xl animate-bounce">
          <BrainCircuit className="w-10 h-10 animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{message}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Synthesizing documents, running inference models, and generating explainable insights.
      </p>
    </div>
  );
}
