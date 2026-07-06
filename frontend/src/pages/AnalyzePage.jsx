import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import UseCaseSelector from '../components/UseCaseSelector';
import ResultsDashboard from '../components/ResultsDashboard';
import LoadingAnimation from '../components/LoadingAnimation';
import { Upload, X, HelpCircle, FileText, AlertCircle, FileSpreadsheet } from 'lucide-react';

export default function AnalyzePage() {
  const { backendUrl, examples, fetchHistory } = useApp();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [useCase, setUseCase] = useState('');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Read URL params if loaded from Homepage template click
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && examples.length > 0) {
      const template = examples.find(ex => ex.id === templateId);
      if (template) {
        handleSelectTemplate(template);
      }
    }
  }, [searchParams, examples]);

  const handleSelectTemplate = (template) => {
    if (!template) {
      setActiveTemplate(null);
      setQuery('');
      setUseCase('');
      return;
    }
    setActiveTemplate(template);
    setQuery(template.sample_query);
    setUseCase(template.category);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['pdf', 'csv', 'txt', 'json', 'md'].includes(ext);
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Submit to FastAPI
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('query', query);
    formData.append('use_case', useCase);

    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await axios.post(`${backendUrl}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
      // Refresh global history
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'An error occurred while communicating with the AI backend. Please verify that the backend is active.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Workspace</h1>
        <p className="mt-1.5 text-sm text-slate-650 dark:text-slate-400">
          Create structured Decision Intelligence models from queries or uploaded files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Setup Forms */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              Configuration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Analytical Category
                </label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-200"
                >
                  <option value="">General Decision Support</option>
                  <option value="disaster_preparedness">Disaster Preparedness</option>
                  <option value="waste_management">Waste Management</option>
                  <option value="education">Education Planning</option>
                  <option value="healthcare">Healthcare Access</option>
                  <option value="public_safety">Public Safety</option>
                  <option value="budget">Municipal Budgeting</option>
                  <option value="complaints">Citizen Complaints</option>
                  <option value="environmental">Environmental Monitoring</option>
                </select>
              </div>

              {/* Natural Language Prompt */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Natural Language Query
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your community scenario, issues, target indices, or enter a prompt..."
                  rows={6}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-200 leading-relaxed resize-none"
                />
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Contextual Datasets
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    isDragging
                      ? 'border-brand-500 bg-brand-50/20'
                      : 'border-slate-200 hover:border-slate-350 dark:border-slate-850 dark:hover:border-slate-800'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.csv,.txt,.json,.md"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Upload PDF, CSV, TXT
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Drag files or click to browse
                  </span>
                </div>

                {/* List of files */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-1.5 truncate pr-2 text-slate-700 dark:text-slate-300 font-medium">
                          {file.name.endsWith('.csv') ? (
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                          )}
                          <span className="truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Trigger Button */}
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
                  isLoading || !query.trim()
                    ? 'bg-slate-350 cursor-not-allowed shadow-none dark:bg-slate-800 dark:text-slate-500'
                    : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/10'
                }`}
              >
                {isLoading ? 'Synthesizing Vectors...' : 'Analyze Decision'}
              </button>

            </form>
          </div>

        </div>

        {/* Right Side: Analysis Display / Sandbox templates selector */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Templates Drawer */}
          <div className="glass-card p-6">
            <UseCaseSelector
              activeTemplate={activeTemplate}
              onSelectTemplate={handleSelectTemplate}
            />
          </div>

          {/* Core Response Panel */}
          <div className="glass-card p-6 min-h-[400px] flex flex-col justify-center">
            
            {isLoading && <LoadingAnimation />}

            {error && (
              <div className="p-4 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">System Inference Failure</h4>
                  <p className="text-xs mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {!isLoading && !error && !result && (
              <div className="text-center py-16 px-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 text-slate-450 w-fit mx-auto rounded-3xl mb-4 border border-slate-100 dark:border-slate-850">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Awaiting Analytical Vectors
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Configure the panel on the left, upload optional community records, or select an instant sandbox template to start.
                </p>
              </div>
            )}

            {!isLoading && !error && result && (
              <ResultsDashboard result={result} />
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
