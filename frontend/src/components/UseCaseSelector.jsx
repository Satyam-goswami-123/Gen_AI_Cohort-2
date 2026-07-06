import React from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Sparkles } from 'lucide-react';

export default function UseCaseSelector({ activeTemplate, onSelectTemplate }) {
  const { examples, isLoadingExamples } = useApp();

  if (isLoadingExamples) {
    return (
      <div className="flex items-center justify-center h-20">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Predefined Sandboxes (Instant Demo)
        </h3>
        {activeTemplate && (
          <button
            onClick={() => onSelectTemplate(null)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            Clear template
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {examples.map((ex) => {
          const isSelected = activeTemplate?.id === ex.id;
          return (
            <button
              key={ex.id}
              onClick={() => onSelectTemplate(ex)}
              type="button"
              className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between h-28 relative overflow-hidden ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-1 ring-brand-500 dark:bg-brand-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-750'
              }`}
            >
              {/* Highlight background dot */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-pulse"></div>
              )}
              
              <div className="text-2xl">{ex.icon}</div>
              
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {ex.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {ex.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
