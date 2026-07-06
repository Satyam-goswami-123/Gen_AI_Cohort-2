import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  AlertCircle, 
  Activity, 
  ChevronRight, 
  ArrowRight, 
  FileText, 
  Download,
  Search,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export default function DashboardPage() {
  const { history, isLoadingHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter history based on search
  const filteredHistory = history.filter(item => 
    item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics calculation
  const totalDecisions = history.length;
  
  const criticalCount = history.filter(item => 
    item.priority_score?.toLowerCase() === 'critical' || 
    item.priority_score?.toLowerCase() === 'high'
  ).length;

  const avgConfidence = totalDecisions > 0 
    ? Math.round(history.reduce((sum, item) => sum + (item.confidence_level || 0), 0) / totalDecisions)
    : 0;

  // Recharts: Priority Distribution Data
  const priorityCounts = history.reduce((acc, item) => {
    const p = item.priority_score || 'Medium';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(priorityCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = {
    'Critical': '#ef4444',
    'High': '#f97316',
    'Medium': '#f59e0b',
    'Low': '#10b981'
  };

  // Recharts: Confidence Over Time
  const trendData = [...history].reverse().map((item, idx) => ({
    index: idx + 1,
    confidence: item.confidence_level,
    name: item.category
  }));

  const downloadHistoryReport = (item) => {
    const textData = `
========================================
DECISIONAI HISTORY RECORD REPORT
========================================
ID: ${item.id}
Timestamp: ${item.timestamp}
Query: ${item.query}
Category: ${item.category}
Priority Score: ${item.priority_score}
Confidence Level: ${item.confidence_level}%

EXECUTIVE SUMMARY
----------------
${item.executive_summary}
`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DecisionAI_Record_${item.id.slice(0,8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Analytics Dashboard</h1>
        <p className="mt-1.5 text-sm text-slate-650 dark:text-slate-400">
          Track previous community analyses, priorities, and confidence trend matrices.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Analyses
            </span>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">
              {totalDecisions}
            </h3>
          </div>
          <div className="p-3 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Urgent Risks (High/Critical)
            </span>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">
              {criticalCount}
            </h3>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950 text-red-650 dark:text-red-400 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Average Confidence
            </span>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">
              {avgConfidence}%
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-650 dark:text-emerald-400 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Visual Analytics section */}
      {totalDecisions > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Priority Distribution Chart */}
          <div className="glass-card p-6 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">
              Priority Urgency Breakdown
            </h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="flex flex-col gap-2 text-xs font-semibold pl-4">
                {Object.keys(COLORS).map((name) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[name] }}></span>
                    <span className="text-slate-650 dark:text-slate-400">{name}: {priorityCounts[name] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Area Chart: Confidence Trend */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">
              AI Confidence Quality Index
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <XAxis dataKey="index" stroke="#94a3b8" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Tooltip />
                  <Area type="monotone" dataKey="confidence" stroke="#6366f1" fillOpacity={0.15} fill="#6366f1" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* History table list */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4 mb-6">
          <h3 className="font-extrabold text-slate-900 dark:text-white">
            Historical Archive
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search category/query..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none dark:bg-slate-950 dark:border-slate-850 dark:text-slate-200"
            />
          </div>
        </div>

        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-250">No Historical Records Found</h4>
            <p className="text-xs text-slate-500 mt-1">Submit inquiries in the Workspace to establish a historical baseline.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-450 uppercase font-black tracking-wider">
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Query / Subject</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredHistory.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase ${
                        item.priority_score === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                        item.priority_score === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        item.priority_score === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {item.priority_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white capitalize">
                      {item.category?.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                      {item.query}
                    </td>
                    <td className="py-3 px-4 font-semibold text-brand-600 dark:text-brand-400">
                      {item.confidence_level}%
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => downloadHistoryReport(item)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                        title="Download summary report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
