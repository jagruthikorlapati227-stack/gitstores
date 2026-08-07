import React from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Cpu, Activity, Clock, User, ArrowUpRight, 
  CheckCircle2, XCircle, Clock3, AlertOctagon, Zap, Server, ChevronRight, BarChart3
} from 'lucide-react';
import { SPECIALIZED_AGENTS, USER_ROLES } from '../data/mockData';

export default function SOCDashboard({ 
  metrics, 
  recentLogs, 
  onSelectLog, 
  onNavigateToAnalyzer, 
  currentRoleObj 
}) {
  const approvalRate = Math.round((metrics.approvedCount / metrics.totalRequests) * 100);

  return (
    <div className="space-y-6">
      
      {/* SOC Dashboard Header Hero */}
      <div className="glass-panel-glow p-6 rounded-2xl relative overflow-hidden bg-radial-glow border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                REAL-TIME TELEMETRY
              </span>
              <span className="text-xs font-mono text-slate-400">SOC Control Center v4.2</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">
              Enterprise AI Governance Dashboard
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              SentinelAI dynamically monitors, validates, and resolves conflicting command instructions across AI agents, company security policies, and human operators.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToAnalyzer}
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch Command Analyzer</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Widget 1: Total Requests */}
        <div className="glass-panel p-5 rounded-2xl glass-card-hover border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Requests</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{metrics.totalRequests}</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              +12% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Analyzed past 24h</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
        </div>

        {/* Widget 2: Approved Requests */}
        <div className="glass-panel p-5 rounded-2xl glass-card-hover border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Approved</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">{metrics.approvedCount}</span>
            <span className="text-xs font-mono text-slate-400">({approvalRate}%)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Policy Compliant Executions</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
        </div>

        {/* Widget 3: Rejected Requests */}
        <div className="glass-panel p-5 rounded-2xl glass-card-hover border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Rejected</span>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-rose-400">{metrics.rejectedCount}</span>
            <span className="text-xs font-mono text-rose-400/80">Policy Blocks</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Unauthorized & Unsafe Requests</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"></div>
        </div>

        {/* Widget 4: Conflicts Detected */}
        <div className="glass-panel p-5 rounded-2xl glass-card-hover border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Conflicts Resolved</span>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Cpu className="w-4 h-4 animate-spin-slow" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-purple-400">{metrics.conflictsDetected}</span>
            <span className="text-xs font-mono text-purple-300">Multi-Agent</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Conflicting Instructions Resolved</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
        </div>

        {/* Widget 5: Critical Prevented */}
        <div className="glass-panel p-5 rounded-2xl glass-card-hover border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Critical Saved</span>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400">{metrics.criticalActivitiesPrevented}</span>
            <span className="text-xs font-mono text-amber-300">Outages Prevented</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">Prod Destruction Blocked</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
        </div>

      </div>

      {/* Main Grid: Risk Distribution + AI Agent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Distribution Breakdown Widget */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold font-mono text-white">Risk Distribution</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Last 24 Hours</span>
          </div>

          <div className="space-y-3 pt-2">
            
            {/* Low Risk */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Low Risk (0 - 30)
                </span>
                <span className="text-slate-300 font-semibold">68 requests (46%)</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '46%' }}></div>
              </div>
            </div>

            {/* Medium Risk */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Medium Risk (31 - 60)
                </span>
                <span className="text-slate-300 font-semibold">44 requests (30%)</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            {/* High Risk */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> High Risk (61 - 80)
                </span>
                <span className="text-slate-300 font-semibold">24 requests (16%)</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>

            {/* Critical Risk */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span> Critical Risk (81 - 100)
                </span>
                <span className="text-slate-300 font-semibold">12 requests (8%)</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-800/80 bg-slate-950/40 p-3 rounded-xl text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Decision Latency:</span>
            <span className="text-emerald-400 font-semibold">14ms average</span>
          </div>
        </div>

        {/* AI Agent Status Matrix */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold font-mono text-white">Specialized AI Agents Grid</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              4 Agents Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPECIALIZED_AGENTS.map((agent) => (
              <div key={agent.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{agent.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold font-mono text-slate-200">{agent.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400">{agent.code}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono line-clamp-1">{agent.role}</p>
                <div className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/40 p-1.5 rounded border border-cyan-900/30">
                  <span className="text-slate-400">Bias Focus: </span>{agent.bias}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Live Decisions Activity Feed */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold font-mono text-white">Recent Decisions & Live Activity</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Click any row to inspect 6-stage pipeline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Log ID & Time</th>
                <th className="pb-3 px-3">User Role</th>
                <th className="pb-3 px-3">Command</th>
                <th className="pb-3 px-3">Risk Rating</th>
                <th className="pb-3 px-3">Verdict</th>
                <th className="pb-3 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {recentLogs.map((log) => {
                const role = USER_ROLES.find(r => r.id === log.userRole) || USER_ROLES[0];
                let verdictBadge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                if (log.decision === 'REJECTED') verdictBadge = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                else if (log.decision === 'DELAYED') verdictBadge = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                else if (log.decision === 'ESCALATED') verdictBadge = 'bg-purple-500/20 text-purple-400 border-purple-500/40';

                return (
                  <tr 
                    key={log.id} 
                    onClick={() => onSelectLog(log)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-300">{log.id}</div>
                      <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] border font-semibold ${role.color}`}>
                        {role.avatar} {role.name}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{log.command}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{log.reason}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${
                          log.riskScore >= 80 ? 'text-rose-400' :
                          log.riskScore >= 60 ? 'text-amber-400' :
                          log.riskScore >= 35 ? 'text-cyan-400' : 'text-emerald-400'
                        }`}>
                          {log.riskScore}/100
                        </span>
                        <span className="text-[10px] text-slate-400">({log.riskLevel})</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${verdictBadge}`}>
                        {log.decision}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 text-slate-400 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
