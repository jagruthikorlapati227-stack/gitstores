import React, { useState } from 'react';
import { Cpu, Shield, AlertTriangle, Zap, CheckCircle2, RefreshCw, MessageSquare, Play } from 'lucide-react';
import { SPECIALIZED_AGENTS, DEMO_SCENARIOS } from '../data/mockData';
import { analyzeCommand } from '../services/sentinelEngine';

export default function MultiAgentArena({ currentRole }) {
  const [arenaCommand, setArenaCommand] = useState('Isolate Host 192.168.1.105');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(() => analyzeCommand('Isolate Host 192.168.1.105', currentRole));

  const handleRunSimulation = () => {
    if (!arenaCommand.trim()) return;
    setIsSimulating(true);
    setTimeout(() => {
      const res = analyzeCommand(arenaCommand, currentRole);
      setSimResult(res);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MULTI-AGENT CONSENSUS ARENA
              </span>
              <span className="text-xs font-mono text-slate-400">4 Autonomous Agents</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-white mt-1">
              Multi-Agent Friction & Conflict Resolution Simulation
            </h2>
            <p className="text-xs font-mono text-slate-300 mt-1 max-w-2xl">
              Watch autonomous security agents present conflicting perspectives simultaneously. SentinelAI compares agent recommendations, detects conflicts, and computes the safest synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating || !arenaCommand.trim()}
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Simulating Agent Debate...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>SIMULATE AGENT DEBATE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Command Selector for Simulation */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <input
            type="text"
            value={arenaCommand}
            onChange={(e) => setArenaCommand(e.target.value)}
            placeholder="Command to simulate across 4 agents..."
            className="flex-1 w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-purple-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setArenaCommand('Isolate Host 192.168.1.105'); handleRunSimulation(); }}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap"
            >
              Preset: Isolate Host
            </button>
            <button
              onClick={() => { setArenaCommand('Delete Production Database'); handleRunSimulation(); }}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap"
            >
              Preset: Delete Prod DB
            </button>
          </div>
        </div>
      </div>

      {/* 4 Agent Cards Arena Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {simResult.multiAgentEvaluation.agentRecommendations.map((agentRec, idx) => {
          const agentMeta = SPECIALIZED_AGENTS.find(a => a.id === agentRec.agentId) || SPECIALIZED_AGENTS[0];
          
          let sentimentColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
          if (agentRec.sentiment === 'URGENT_ACTION') sentimentColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
          else if (agentRec.sentiment === 'REJECT' || agentRec.sentiment === 'ESCALATE') sentimentColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
          else if (agentRec.sentiment === 'DELAY' || agentRec.sentiment === 'CONDITIONAL') sentimentColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';

          return (
            <div 
              key={idx}
              className={`glass-panel p-5 rounded-2xl border glass-card-hover space-y-3 relative overflow-hidden ${
                isSimulating ? 'opacity-50 animate-pulse' : ''
              }`}
              style={{ borderColor: `${agentMeta.accentColor}40` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{agentMeta.avatar}</span>
                  <div>
                    <h3 className="text-xs font-bold font-mono text-white">{agentMeta.name}</h3>
                    <p className="text-[10px] font-mono text-slate-400">{agentMeta.code}</p>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-[10px] font-mono text-slate-400 mb-1">Agent Recommendation:</div>
                <div className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold ${sentimentColor}`}>
                  {agentRec.recommendation}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Priority Weight:</span>
                  <span className="text-cyan-400 font-bold">{agentRec.priority}/100</span>
                </div>
                <p className="text-slate-300 pt-1 leading-relaxed">{agentRec.reason}</p>
              </div>

              <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>Core Perspective:</span>
                <span className="text-slate-300 truncate max-w-[120px]">{agentMeta.bias}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SentinelAI Synthesis & Conflict Resolution Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold font-mono text-white">SentinelAI Consensus Resolution Engine</h3>
          </div>
          <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${simResult.decision.badgeColor}`}>
            Verdict: {simResult.decision.verdict}
          </span>
        </div>

        {/* Conflicts Breakdown */}
        {simResult.conflictsFound > 0 ? (
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Detected Friction Points ({simResult.conflictsFound}):</span>
            </div>
            {simResult.multiAgentEvaluation.conflicts.map((c, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/90 border border-purple-500/30 text-xs font-mono text-purple-200 space-y-1">
                <div className="font-bold text-cyan-300">[{c.conflictId}] {c.parties.join(' vs ')}</div>
                <p className="text-slate-300">{c.issue}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero conflicting recommendations detected. Single-path approval achieved.</span>
          </div>
        )}

        {/* Final Synthesized Rationale */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
          <div className="text-cyan-400 font-bold">Synthesized Decision Rationale:</div>
          <p className="text-slate-200">{simResult.explanation.whyDecisionMade}</p>
          <div className="text-slate-400 pt-1 text-[11px]">
            <span className="text-amber-400">Trade-off Resolution: </span>
            {simResult.explanation.ignoredRecommendationsReason}
          </div>
        </div>
      </div>

    </div>
  );
}
