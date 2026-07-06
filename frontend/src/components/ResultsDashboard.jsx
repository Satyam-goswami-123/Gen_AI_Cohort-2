import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  ShieldAlert, 
  CheckSquare, 
  Users2, 
  Gauge, 
  BrainCircuit, 
  HelpCircle, 
  Calendar, 
  User, 
  ChevronRight,
  TrendingUp,
  Download,
  Check,
  MessageSquare,
  PenTool,
  RotateCcw
} from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

export default function ResultsDashboard({ result }) {
  if (!result || !result.analysis) return null;

  const { analysis } = result;
  
  const [deliberations, setDeliberations] = useState(analysis.agent_deliberations || []);
  const [selectedAgentIdx, setSelectedAgentIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [feedback, setFeedback] = useState('');

  // Helpers for priority badges
  const getPriorityStyle = (score) => {
    switch (score?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-900/30';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-900/30';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/30';
      case 'low':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/30';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-350 border-slate-200 dark:border-slate-800/30';
    }
  };

  const confidenceData = [
    { name: 'Confidence', value: analysis.confidence_level || 50, fill: '#6366f1' }
  ];

  // Report download builder
  const downloadReport = () => {
    const textData = `
========================================
DECISIONAI COMMUNITY ANALYSIS REPORT
========================================
ID: ${result.id}
Timestamp: ${result.timestamp}
Query: ${result.query}
Category: ${analysis.category}
Priority Score: ${analysis.priority_score}
Confidence Level: ${analysis.confidence_level}%

EXECUTIVE SUMMARY
----------------
${analysis.executive_summary}

KEY INSIGHTS
------------
${analysis.key_insights?.map((ins, i) => `${i+1}. ${ins}`).join('\n')}

RISKS & CHALLENGES
------------------
${analysis.risks_and_challenges?.map((r, i) => `[${r.severity}] ${r.risk}\n- Description: ${r.description}\n- Mitigation: ${r.mitigation}`).join('\n\n')}

RECOMMENDED ACTIONS
-------------------
${analysis.recommended_actions?.map((act, i) => `${i+1}. ${act.action}\n- Timeline: ${act.timeline}\n- Responsible: ${act.responsible_party}\n- Description: ${act.description}\n- Impact: ${act.estimated_impact}`).join('\n\n')}

COMMUNITY IMPACT
----------------
- Affected Population: ${analysis.community_impact?.affected_population}
- Positive Outcomes: ${analysis.community_impact?.positive_outcomes?.join(', ')}
- Consequences if Ignored: ${analysis.community_impact?.negative_consequences_if_ignored}
- Equity Considerations: ${analysis.community_impact?.equity_considerations}

EXPLAINABLE AI REASONING
------------------------
${analysis.ai_reasoning}

DATA GAPS
---------
${analysis.data_gaps?.map(gap => `- ${gap}`).join('\n')}

FOLLOW-UP QUESTIONS
-------------------
${analysis.follow_up_questions?.map(q => `- ${q}`).join('\n')}
`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DecisionAI_Report_${result.id.slice(0,8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner Control */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Analysis Completed
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Structured Decision Intelligence Workspace
          </h2>
        </div>
        <button
          onClick={downloadReport}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 text-xs font-bold rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Grid: Executive summary, priority, confidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Executive Summary Card */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Executive Summary</h3>
              <p className="mt-2 text-slate-700 dark:text-slate-350 text-base leading-relaxed font-semibold">
                {analysis.executive_summary}
              </p>
            </div>
          </div>
          
          {/* Priority Score Inline card */}
          <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between gap-4 ${getPriorityStyle(analysis.priority_score)}`}>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider">Priority Urgency</span>
              <p className="text-sm font-medium mt-0.5">{analysis.priority_justification}</p>
            </div>
            <span className="px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border">
              {analysis.priority_score}
            </span>
          </div>
        </div>

        {/* Confidence Level Circle Gauge */}
        <div className="glass-card p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Confidence Level</h3>
            <Gauge className="w-4 h-4 text-brand-500" />
          </div>

          <div className="w-36 h-36 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="100%"
                barSize={10}
                data={confidenceData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background clockWise dataKey="value" cornerRadius={5} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {analysis.confidence_level}%
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                Certainty
              </span>
            </div>
          </div>

          <div className="w-full border-t border-slate-100 dark:border-slate-800/80 pt-3 text-left space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Completeness:</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">{analysis.confidence_factors?.data_completeness}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Data Quality:</span>
              <span className="font-bold text-slate-700 dark:text-slate-350">{analysis.confidence_factors?.data_quality}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Agentic Teammate Workspace */}
      {deliberations.length > 0 && (
        <div className="glass-card p-6 border-l-4 border-l-brand-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-805 pb-3 mb-6">
            <div className="flex items-center gap-2">
              <Users2 className="w-5 h-5 text-indigo-500 animate-pulse" />
              <div>
                <h3 className="font-extrabold text-slate-950 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                  AI Digital Teammate Workspace
                  <span className="text-[10px] bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Agentic Collaboration
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Three autonomous digital teammates analyzed this situation from Social Equity, Logistical Operations, and Financial constraints.
                </p>
              </div>
            </div>
          </div>

          {/* Agent Selection Tabs */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {deliberations.map((delib, idx) => {
              const isActive = selectedAgentIdx === idx;
              const isApproved = delib.status === 'APPROVED';
              const isRevision = delib.status === 'REVISION_REQUESTED';
              
              let statusBadge = (
                <span className="text-[9px] bg-amber-55 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.5 rounded font-black border border-amber-100 dark:border-amber-900/10">
                  DRAFT PENDING
                </span>
              );
              if (isApproved) {
                statusBadge = (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded font-black border border-emerald-100 dark:border-emerald-900/10">
                    APPROVED
                  </span>
                );
              } else if (isRevision) {
                statusBadge = (
                  <span className="text-[9px] bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 px-1.5 py-0.5 rounded font-black border border-red-100 dark:border-red-900/10">
                    REVISION REQ
                  </span>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAgentIdx(idx);
                    setIsEditing(false);
                    setFeedback('');
                  }}
                  type="button"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'border-brand-500 bg-brand-50/20 shadow-sm ring-1 ring-brand-500 dark:bg-brand-950/20'
                      : 'border-slate-200 bg-white hover:border-slate-350 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-750'
                  }`}
                >
                  <span className="text-2xl shrink-0">
                    {idx === 0 ? '🤝' : idx === 1 ? '⚙️' : '💰'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {delib.agent_name}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {statusBadge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Agent Detail Panel */}
          {deliberations[selectedAgentIdx] && (
            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Teammate Focus Dimension
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">
                  {deliberations[selectedAgentIdx].focus}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Autonomous Findings
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  {deliberations[selectedAgentIdx].findings}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Draft Proposal
                  </span>
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditValue(deliberations[selectedAgentIdx].recommendation);
                      }}
                      className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <PenTool className="w-3 h-3" />
                      Override Text
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="mt-1.5 space-y-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 leading-relaxed"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 bg-slate-150 hover:bg-slate-200 text-slate-750 rounded-lg text-[10px] font-bold dark:bg-slate-800 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const updated = [...deliberations];
                          updated[selectedAgentIdx].recommendation = editValue;
                          updated[selectedAgentIdx].status = 'APPROVED';
                          setDeliberations(updated);
                          setIsEditing(false);
                        }}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Apply Override
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold mt-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    {deliberations[selectedAgentIdx].recommendation}
                  </p>
                )}
              </div>

              {/* Human-in-the-loop control buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-900/60 flex flex-wrap items-center justify-between gap-4">
                <div className="text-[10px] text-slate-400 font-semibold">
                  Human-In-The-Loop Approval Control:
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updated = [...deliberations];
                      updated[selectedAgentIdx].status = 'APPROVED';
                      setDeliberations(updated);
                    }}
                    disabled={deliberations[selectedAgentIdx].status === 'APPROVED'}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      deliberations[selectedAgentIdx].status === 'APPROVED'
                        ? 'bg-slate-100 text-slate-400 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Approve Draft
                  </button>
                  
                  <button
                    onClick={() => {
                      const updated = [...deliberations];
                      updated[selectedAgentIdx].status = 'REVISION_REQUESTED';
                      setDeliberations(updated);
                    }}
                    disabled={deliberations[selectedAgentIdx].status === 'REVISION_REQUESTED'}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      deliberations[selectedAgentIdx].status === 'REVISION_REQUESTED'
                        ? 'bg-slate-105 text-slate-400 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed'
                        : 'bg-red-50 text-red-800 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Request Revision
                  </button>
                </div>
              </div>

              {/* Feedback dialog for revision */}
              {deliberations[selectedAgentIdx].status === 'REVISION_REQUESTED' && (
                <div className="mt-3 p-3 bg-red-50/40 dark:bg-red-950/15 rounded-xl border border-red-100/50 dark:border-red-900/15 space-y-2">
                  <span className="text-[10px] font-bold text-red-700 dark:text-red-400 block">
                    Redirect Directive to {deliberations[selectedAgentIdx].agent_name}:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Focus recommendation on immediate flood evacuation response timeline..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="flex-grow px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-850 dark:text-slate-200"
                    />
                    <button
                      onClick={() => {
                        const updated = [...deliberations];
                        updated[selectedAgentIdx].findings += ` [Human-Directed Focus: "${feedback}"]`;
                        updated[selectedAgentIdx].recommendation = `[Draft Revised to address: "${feedback}"] Direct resources immediately.`;
                        updated[selectedAgentIdx].status = 'APPROVED';
                        setDeliberations(updated);
                        setFeedback('');
                      }}
                      className="px-3 py-1.5 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shrink-0"
                    >
                      Resubmit to Teammate
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Grid: Key insights and Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Insights Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-950 dark:text-white">Key Insights</h3>
          </div>
          <ul className="space-y-3">
            {analysis.key_insights?.map((insight, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-700 dark:text-slate-350">
                <ChevronRight className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks & Challenges Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="font-extrabold text-slate-950 dark:text-white">Risks & Challenges</h3>
          </div>
          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {analysis.risks_and_challenges?.map((rc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rc.risk}</h4>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityStyle(rc.severity)}`}>
                    {rc.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{rc.description}</p>
                <div className="mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20 p-2 rounded-lg">
                  <span className="font-black">Mitigation:</span> {rc.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recommended Actions */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
          <CheckSquare className="w-5 h-5 text-emerald-500" />
          <h3 className="font-extrabold text-slate-950 dark:text-white">Recommended Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.recommended_actions?.map((act, idx) => (
            <div key={idx} className="relative p-5 rounded-2xl border border-slate-100 dark:border-slate-850 bg-gradient-to-br from-white to-slate-50/60 dark:from-slate-900 dark:to-slate-950/60 flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 rounded-lg text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{act.action}</h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {act.description}
                </p>
              </div>

              {/* Action metadata footer */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex flex-wrap gap-x-4 gap-y-2 justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  <span className="font-semibold">{act.timeline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-semibold">{act.responsible_party}</span>
                </div>
                <div className="w-full mt-1.5 pt-1.5 border-t border-slate-50 dark:border-slate-900/50 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>Impact: {act.estimated_impact}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Community Impact and Explainable AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Community Impact card */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Users2 className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-slate-950 dark:text-white font-sans">Community Impact</h3>
            </div>
            
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Affected Population</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {analysis.community_impact?.affected_population}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Positive Outcomes</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {analysis.community_impact?.positive_outcomes?.map((out, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-100 dark:border-emerald-900/10">
                      {out}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Consequences if Ignored</span>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-0.5">
                  {analysis.community_impact?.negative_consequences_if_ignored}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Equity Considerations</span>
            <p className="text-xs text-slate-650 dark:text-slate-450 mt-1">
              {analysis.community_impact?.equity_considerations}
            </p>
          </div>
        </div>

        {/* Explainable AI Reasoning */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <BrainCircuit className="w-5 h-5 text-brand-500" />
              <h3 className="font-extrabold text-slate-950 dark:text-white">Explainable AI Reasoning</h3>
            </div>
            
            <div className="p-4 bg-brand-50/40 dark:bg-brand-950/10 rounded-2xl border border-brand-100/50 dark:border-brand-900/10">
              <span className="text-[9px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">
                Inference Path & Logic
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed italic">
                "{analysis.ai_reasoning}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Identified Data Gaps</span>
              <ul className="list-disc pl-3 text-[10px] text-slate-550 dark:text-slate-450 mt-1 space-y-1">
                {analysis.data_gaps?.slice(0,2).map((gap, i) => <li key={i}>{gap}</li>)}
              </ul>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Follow-up Questions</span>
              <ul className="list-disc pl-3 text-[10px] text-slate-550 dark:text-slate-450 mt-1 space-y-1">
                {analysis.follow_up_questions?.slice(0,2).map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
