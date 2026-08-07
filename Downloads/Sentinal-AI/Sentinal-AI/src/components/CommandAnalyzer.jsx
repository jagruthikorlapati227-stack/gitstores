import React, { useState, useEffect } from 'react';
import { 
  Terminal, Zap, Shield, ShieldCheck, ShieldAlert, AlertTriangle, Cpu, CheckCircle2, 
  XCircle, Clock, FileText, ChevronRight, Sparkles, Layers, ArrowRight, Activity, 
  HelpCircle, Info, RefreshCw, Eye, UserCheck
} from 'lucide-react';
import { PRESET_COMMANDS, DEMO_SCENARIOS, USER_ROLES } from '../data/mockData';
import ExplainabilityPanel from './ExplainabilityPanel';

export default function CommandAnalyzer({ 
  commandInput, 
  setCommandInput, 
  analysisResult, 
  onRunAnalysis, 
  currentRole, 
  setCurrentRole,
  isAnalyzing 
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [showExplainabilityModal, setShowExplainabilityModal] = useState(false);

  const roleObj = USER_ROLES.find(r => r.id === currentRole) || USER_ROLES[0];

  // Auto-advance to Step 5 (Verdict) or Step 1 when new analysis result comes in
  useEffect(() => {
    if (analysisResult) {
      setActiveStep(5);
    }
  }, [analysisResult]);

  const handleRoleChange = (roleId) => {
    setCurrentRole(roleId);
    if (commandInput.trim()) {
      onRunAnalysis(commandInput, roleId);
    }
  };

  const handlePresetClick = (presetLabel) => {
    setCommandInput(presetLabel);
    onRunAnalysis(presetLabel, currentRole);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Input Console */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Header & Direct Role Selector inside Analyzer */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-mono text-white">Security Command Governance Terminal</h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              Evaluating Role:
            </span>
            <div className="flex gap-1">
              {USER_ROLES.map((role) => {
                const isActive = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleChange(role.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      isActive
                        ? `${role.color} border shadow-sm`
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {role.avatar} {role.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Command Input Area */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="e.g. Shutdown Server A, Block User Rahul, Delete Production Database..."
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-inner"
              onKeyDown={(e) => e.key === 'Enter' && onRunAnalysis(commandInput, currentRole)}
            />
            {commandInput && (
              <button 
                onClick={() => setCommandInput('')}
                className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300 font-mono"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => onRunAnalysis(commandInput, currentRole)}
            disabled={isAnalyzing || !commandInput.trim()}
            className="px-6 py-3 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Evaluating Governance...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>ANALYZE REQUEST</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Command Chips */}
        <div className="pt-1">
          <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Command Presets (Click to analyze instantly):
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_COMMANDS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset.label)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all flex items-center gap-1.5 ${
                  commandInput === preset.label
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-sm shadow-cyan-500/20 font-bold'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6-Stage Visual Pipeline Tabs Bar */}
      {analysisResult && (
        <div className="glass-panel p-3 rounded-2xl border border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { num: 1, title: 'Step 1: Intent', sub: 'NLP Parsing', icon: Sparkles },
              { num: 2, title: 'Step 2: Policy', sub: 'Rule Matrix', icon: ShieldCheck },
              { num: 3, title: 'Step 3: Conflicts', sub: 'Multi-Agent', icon: Cpu },
              { num: 4, title: 'Step 4: Risk', sub: 'Score Gauge', icon: AlertTriangle },
              { num: 5, title: 'Step 5: Decision', sub: 'Final Verdict', icon: Zap },
              { num: 6, title: 'Step 6: Audit Log', sub: 'Ledger Commit', icon: FileText }
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`p-2.5 rounded-xl border font-mono transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-900 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30 font-bold'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>0{step.num}</span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{step.title}</div>
                  <div className="text-[10px] text-slate-400">{step.sub}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Stage Display Area */}
      {analysisResult ? (
        <div className="space-y-6">
          
          {/* STEP 1: INTENT EXTRACTION */}
          {activeStep === 1 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold font-mono text-white">Step 1 – AI Intent Extraction</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Confidence: {analysisResult.extractedIntent.confidence}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-xs font-mono text-slate-400">Extracted Action</div>
                  <div className="text-lg font-bold font-mono text-cyan-300">{analysisResult.extractedIntent.action}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-xs font-mono text-slate-400">Target Resource</div>
                  <div className="text-lg font-bold font-mono text-emerald-300">{analysisResult.extractedIntent.target}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-xs font-mono text-slate-400">Resource Category</div>
                  <div className="text-lg font-bold font-mono text-purple-300">{analysisResult.extractedIntent.category}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-xs font-mono text-slate-400">Risk Score</div>
                  <div className={`text-lg font-bold font-mono ${analysisResult.riskAssessment.color}`}>
                    {analysisResult.riskAssessment.level} ({analysisResult.riskAssessment.score}/100)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: POLICY VALIDATION */}
          {activeStep === 2 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold font-mono text-white">Step 2 – Organizational Policy Validation</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono border font-semibold ${
                  analysisResult.policyResults.hasViolation ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {analysisResult.policyResults.hasViolation ? 'POLICY VIOLATION DETECTED' : 'ALL POLICIES PASSED'}
                </span>
              </div>

              <div className="space-y-3">
                {analysisResult.policyResults.policies.map((p, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border font-mono space-y-2 ${
                    p.status === 'VIOLATION' 
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' 
                      : 'bg-slate-900/80 border-slate-800 text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400">{p.policyId}</span>
                        <span className="text-xs font-semibold">{p.policyName}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        p.status === 'VIOLATION' ? 'bg-rose-500/30 text-rose-300 border-rose-500/60' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{p.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: CONFLICT DETECTION */}
          {activeStep === 3 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold font-mono text-white">Step 3 – Multi-Agent Conflict Detection</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {analysisResult.conflictsFound} Conflict(s) Identified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.multiAgentEvaluation.agentRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                        <span>{rec.avatar}</span>
                        <span>{rec.agentName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-400 border border-slate-700">
                        Priority: {rec.priority}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/40">
                      Recommendation: {rec.recommendation}
                    </div>
                    <p className="text-xs font-mono text-slate-300">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: RISK ASSESSMENT */}
          {activeStep === 4 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold font-mono text-white">Step 4 – Dynamic Risk Assessment</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono border font-bold ${analysisResult.riskAssessment.badgeBg} ${analysisResult.riskAssessment.color}`}>
                  {analysisResult.riskAssessment.level.toUpperCase()} RISK ({analysisResult.riskAssessment.score}/100)
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Calculated Risk Score</span>
                  <span className="font-bold text-white">{analysisResult.riskAssessment.score} / 100</span>
                </div>
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      analysisResult.riskAssessment.score >= 80 ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                      analysisResult.riskAssessment.score >= 60 ? 'bg-gradient-to-r from-cyan-500 to-amber-500' :
                      analysisResult.riskAssessment.score >= 35 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${analysisResult.riskAssessment.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: DECISION ENGINE VERDICT */}
          {activeStep === 5 && (
            <div className="space-y-6">
              
              <div className={`p-6 rounded-2xl border ${analysisResult.decision.badgeColor} backdrop-blur-xl relative overflow-hidden space-y-4 shadow-xl`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl p-3 bg-slate-950/60 rounded-2xl border border-white/10 shadow-inner">
                      {analysisResult.decision.icon}
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-slate-300">Final Governance Verdict for {roleObj.name.toUpperCase()}</div>
                      <h3 className="text-3xl font-extrabold font-mono tracking-tight text-white mt-0.5">
                        {analysisResult.decision.verdict}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowExplainabilityModal(true)}
                    className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-slate-950/90 hover:bg-slate-900 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-2 shadow-md"
                  >
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Explainability Deep-Dive</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-sm text-slate-200">
                  <div className="text-xs text-slate-400 mb-1">AI Reasoning Engine Explanation:</div>
                  <p>{analysisResult.decision.summary}</p>
                </div>
              </div>

              <ExplainabilityPanel explanation={analysisResult.explanation} />
            </div>
          )}

          {/* STEP 6: AUDIT LOG COMMIT & TERMINAL */}
          {activeStep === 6 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold font-mono text-white">Step 6 – Immutable Audit Ledger Payload</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Committed Log ID: {analysisResult.id}
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto scanline-effect">
                <div className="text-slate-500">// SentinelAI Governance Audit Ledger Record</div>
                <pre className="text-[11px] leading-relaxed text-slate-300">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 animate-pulse" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold font-mono text-white">Ready for Command Governance Analysis</h3>
            <p className="text-xs font-mono text-slate-400">
              Type any command above or pick one of the quick presets to trace the 6-stage AI Governance decision pipeline.
            </p>
          </div>
        </div>
      )}

      {/* Standalone Explainability Modal */}
      {showExplainabilityModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Explainability Panel – 5 Pillars Rationale
              </h3>
              <button 
                onClick={() => setShowExplainabilityModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>
            
            <ExplainabilityPanel explanation={analysisResult?.explanation} />

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowExplainabilityModal(false)}
                className="px-4 py-2 rounded-xl font-mono text-xs bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
