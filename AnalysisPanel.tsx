
import React from 'react';
import { ProjectAnalysis } from '../types';

interface Props {
  analysis: ProjectAnalysis;
}

const AnalysisPanel: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {analysis.projectName}
          </h1>
          <p className="text-slate-400 mt-2 text-lg max-w-2xl leading-relaxed">
            {analysis.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.technologies.map(tech => (
            <span 
              key={tech} 
              className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Architecture Overview
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
            {analysis.architectureOverview}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            AI Suggestions
          </h3>
          <ul className="space-y-3">
            {analysis.suggestedImprovements.map((tip, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-300">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
