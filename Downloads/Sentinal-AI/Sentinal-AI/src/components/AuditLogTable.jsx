import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Eye, ChevronRight, CheckCircle2, XCircle, Clock, AlertTriangle, Shield } from 'lucide-react';
import { USER_ROLES } from '../data/mockData';

export default function AuditLogTable({ auditLogs, onSelectLog }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [verdictFilter, setVerdictFilter] = useState('ALL');

  // Filtering Logic
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || log.userRole === roleFilter;
    const matchesRisk = riskFilter === 'ALL' || log.riskLevel === riskFilter;
    const matchesVerdict = verdictFilter === 'ALL' || log.decision === verdictFilter;

    return matchesSearch && matchesRole && matchesRisk && matchesVerdict;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SentinelAI_AuditLedger_${new Date().toISOString().substring(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold font-mono text-white">Immutable Security Audit Ledger</h2>
            </div>
            <p className="text-xs font-mono text-slate-300 mt-1">
              Cryptographically signed record of all analyzed security commands, AI intent extractions, policy matches, and final governance decisions.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl font-mono text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>EXPORT AUDIT LEDGER (JSON)</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by command, ID, or reason..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Filter by Role (All Roles)</option>
            {USER_ROLES.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Filter by Risk (All Risk Levels)</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Risk</option>
          </select>

          {/* Verdict Filter */}
          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">Filter by Decision (All Decisions)</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="DELAYED">DELAYED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>

        </div>
      </div>

      {/* Main Audit Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Log ID & Timestamp</th>
                <th className="py-3.5 px-4">User Role</th>
                <th className="py-3.5 px-4">Command & Intent</th>
                <th className="py-3.5 px-4">Risk Rating</th>
                <th className="py-3.5 px-4">Governance Decision</th>
                <th className="py-3.5 px-4">Reason / Rationale</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const role = USER_ROLES.find(r => r.id === log.userRole) || USER_ROLES[0];
                  
                  let decisionBadge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                  if (log.decision === 'REJECTED') decisionBadge = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                  else if (log.decision === 'DELAYED') decisionBadge = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                  else if (log.decision === 'ESCALATED') decisionBadge = 'bg-purple-500/20 text-purple-400 border-purple-500/40';

                  return (
                    <tr 
                      key={log.id}
                      onClick={() => onSelectLog(log)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200">{log.id}</div>
                        <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold ${role.color}`}>
                          {role.avatar} {role.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-cyan-300">{log.command}</div>
                        <div className="text-[10px] text-slate-400">
                          {log.extractedIntent?.action || 'Action'} → {log.extractedIntent?.target || 'Target'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${
                          log.riskLevel === 'Critical' ? 'text-rose-400' :
                          log.riskLevel === 'High' ? 'text-amber-400' :
                          log.riskLevel === 'Medium' ? 'text-cyan-400' : 'text-emerald-400'
                        }`}>
                          {log.riskScore || 50}/100 ({log.riskLevel})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${decisionBadge}`}>
                          {log.decision}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-300 text-[11px] line-clamp-2">{log.reason}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 text-slate-400 transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    No matching audit records found for search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
