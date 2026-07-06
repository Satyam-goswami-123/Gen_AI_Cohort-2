import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  BrainCircuit, 
  ShieldAlert, 
  LineChart, 
  FileSpreadsheet, 
  HeartHandshake, 
  Sparkles,
  CheckCircle,
  Clock,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const { examples } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-slate-50 dark:from-brand-950/20 dark:via-slate-950 dark:to-slate-900">
        
        {/* Decorative Grid and Blur Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold mb-6 dark:bg-brand-950/80 dark:text-brand-300">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Smarter Communities with AI
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Transform Raw Community Data into <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">Actionable Intelligence</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            DecisionAI combines conversational AI with powerful document parsing to help NGOs, schools, and city managers make evidence-based decisions, optimize budgets, and plan resource allocation.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
            >
              View Dashboard
            </Link>
          </div>

        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-card p-8 flex flex-col gap-4">
              <div className="p-3 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 w-fit rounded-2xl">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Conversational Decision-making</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Interact with your community data using natural language. Query citizen reports, survey responses, and budgetary spreadsheets to ask "What if?" questions.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 w-fit rounded-2xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dynamic Document Parsing</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Upload PDFs, CSVs, or TXT documents. Our system automatically processes structure, filters tables, extracts text, and maps variables.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 w-fit rounded-2xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Explainable Recommendation Engine</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Every AI output includes systematic reasoning, key priority levels, confidence indices, and potential consequences if ignored. No black boxes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Predefined Use Cases */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Instant Solution Templates
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Select one of our predefined real-world scenarios to immediately see DecisionAI's planning capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {examples.slice(0, 4).map((ex) => (
              <Link
                key={ex.id}
                to={`/analyze?template=${ex.id}`}
                className="glass-card p-6 flex flex-col justify-between hover:scale-[1.01] hover:border-brand-500/20"
              >
                <div>
                  <div className="text-4xl mb-4">{ex.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{ex.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {ex.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-brand-600 dark:text-brand-400 gap-1.5 group-hover:translate-x-1 transition-transform">
                  Launch Sandbox <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          {/* Footer of Predefined Templates */}
          <div className="mt-12 text-center">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
            >
              Explore all templates and upload custom datasets <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
