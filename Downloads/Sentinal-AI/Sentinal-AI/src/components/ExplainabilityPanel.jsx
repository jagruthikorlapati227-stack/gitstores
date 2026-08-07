import React from 'react';
import { Info, Shield, Cpu, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ExplainabilityPanel({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <Info className="w-5 h-5 text-cyan-400" />
        <div>
          <h3 className="text-base font-bold font-mono text-white">AI Governance Explainability Panel</h3>
          <p className="text-xs font-mono text-slate-400">Plain-language transparency breakdown for non-technical stakeholders and security auditors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pillar 1: Why Decision Was Made */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            1. Core Rationale (Why Decision Was Made)
          </div>
          <p className="text-xs font-mono text-slate-200 leading-relaxed">
            {explanation.whyDecisionMade}
          </p>
        </div>

        {/* Pillar 2: Policy Influence */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            2. Policy Governance Matrix Match
          </div>
          <p className="text-xs font-mono text-slate-200 leading-relaxed">
            {explanation.policyInfluences}
          </p>
        </div>

        {/* Pillar 3: Conflicts Detected */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-400" />
            3. Multi-Agent Conflicts Identified
          </div>
          <p className="text-xs font-mono text-slate-200 leading-relaxed">
            {explanation.conflictsDetected}
          </p>
        </div>

        {/* Pillar 4: Recommendation Trade-offs */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            4. Agent Trade-off & Override Rationale
          </div>
          <p className="text-xs font-mono text-slate-200 leading-relaxed">
            {explanation.ignoredRecommendationsReason}
          </p>
        </div>

      </div>

      {/* Pillar 5: Final Safe Next Step */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 space-y-1 font-mono">
        <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          5. Synthesized Safe Next Step
        </div>
        <p className="text-xs text-slate-200">
          {explanation.finalRecommendedAction}
        </p>
      </div>

    </div>
  );
}
