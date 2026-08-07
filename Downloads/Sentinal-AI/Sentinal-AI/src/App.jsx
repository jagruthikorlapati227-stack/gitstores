import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SOCDashboard from './components/SOCDashboard';
import CommandAnalyzer from './components/CommandAnalyzer';
import MultiAgentArena from './components/MultiAgentArena';
import AuditLogTable from './components/AuditLogTable';
import PolicyManager from './components/PolicyManager';

import { USER_ROLES, INITIAL_AUDIT_LOGS, INITIAL_METRICS } from './data/mockData';
import { analyzeCommand } from './services/sentinelEngine';
import { X, Shield, Terminal, Zap, FileText } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [commandInput, setCommandInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  const currentRoleObj = USER_ROLES.find(r => r.id === currentRole) || USER_ROLES[0];

  // Core Command Analysis Execution Handler
  const handleRunAnalysis = (overrideCmd = null, overrideRole = null) => {
    const cmd = overrideCmd !== null ? overrideCmd : commandInput;
    const role = overrideRole !== null ? overrideRole : currentRole;

    if (!cmd.trim()) return;

    setIsAnalyzing(true);
    setActiveTab('analyzer');

    setTimeout(() => {
      const result = analyzeCommand(cmd, role);
      setAnalysisResult(result);
      setIsAnalyzing(false);

      // Append to immutable audit ledger state
      setAuditLogs(prev => [result, ...prev]);

      // Update telemetry metrics
      setMetrics(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
        approvedCount: result.decision.verdict === 'APPROVED' ? prev.approvedCount + 1 : prev.approvedCount,
        rejectedCount: result.decision.verdict === 'REJECTED' ? prev.rejectedCount + 1 : prev.rejectedCount,
        delayedCount: result.decision.verdict === 'DELAYED' ? prev.delayedCount + 1 : prev.delayedCount,
        escalatedCount: result.decision.verdict === 'ESCALATED' ? prev.escalatedCount + 1 : prev.escalatedCount,
        conflictsDetected: result.conflictsFound > 0 ? prev.conflictsDetected + result.conflictsFound : prev.conflictsDetected,
        criticalActivitiesPrevented: result.decision.verdict === 'REJECTED' && result.riskAssessment.score > 75 
          ? prev.criticalActivitiesPrevented + 1 
          : prev.criticalActivitiesPrevented
      }));
    }, 400);
  };

  // Role Switcher Handler (Auto re-evaluates active command under new role)
  const handleRoleChange = (newRoleId) => {
    setCurrentRole(newRoleId);
    if (commandInput.trim()) {
      handleRunAnalysis(commandInput, newRoleId);
    }
  };

  // Hackathon Preset Scenario Runner (1-click trigger)
  const handleRunScenario = (scenario) => {
    setCurrentRole(scenario.roleId);
    setCommandInput(scenario.command);
    handleRunAnalysis(scenario.command, scenario.roleId);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 bg-cyber-grid bg-radial-glow flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Header & Role Switcher */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunScenario={handleRunScenario}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TAB 1: SOC Dashboard */}
        {activeTab === 'dashboard' && (
          <SOCDashboard
            metrics={metrics}
            recentLogs={auditLogs.slice(0, 6)}
            onSelectLog={(log) => setSelectedLogDetail(log)}
            onNavigateToAnalyzer={() => setActiveTab('analyzer')}
            currentRoleObj={currentRoleObj}
          />
        )}

        {/* TAB 2: Command Analyzer (6-Stage Pipeline Visualizer) */}
        {activeTab === 'analyzer' && (
          <CommandAnalyzer
            commandInput={commandInput}
            setCommandInput={setCommandInput}
            analysisResult={analysisResult}
            onRunAnalysis={handleRunAnalysis}
            currentRole={currentRole}
            setCurrentRole={handleRoleChange}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* TAB 3: Multi-Agent Arena */}
        {activeTab === 'arena' && (
          <MultiAgentArena currentRole={currentRole} />
        )}

        {/* TAB 4: Immutable Audit Ledger */}
        {activeTab === 'audit' && (
          <AuditLogTable
            auditLogs={auditLogs}
            onSelectLog={(log) => setSelectedLogDetail(log)}
          />
        )}

        {/* TAB 5: Security Policies Matrix */}
        {activeTab === 'policies' && (
          <PolicyManager />
        )}

      </main>

      {/* Log Details Modal */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 max-w-3xl w-full space-y-4 max-h-[90vh] overflow-y-auto font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs text-slate-400">Audit Ledger Record Inspection</div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Log ID: {selectedLogDetail.id}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLogDetail(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div><span className="text-slate-400">Role:</span> <span className="text-cyan-300 font-bold">{selectedLogDetail.userRole.toUpperCase()}</span></div>
              <div><span className="text-slate-400">Time:</span> <span className="text-slate-300">{selectedLogDetail.timestamp}</span></div>
              <div><span className="text-slate-400">Risk:</span> <span className="text-amber-400 font-bold">{selectedLogDetail.riskLevel}</span></div>
              <div><span className="text-slate-400">Verdict:</span> <span className="text-emerald-400 font-bold">{selectedLogDetail.decision}</span></div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="text-slate-400">Target Command:</div>
              <div className="font-bold text-cyan-300 text-sm">{selectedLogDetail.command}</div>
              <div className="text-slate-400 pt-2">Reasoning Rationale:</div>
              <p className="text-slate-200">{selectedLogDetail.reason}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-emerald-400 overflow-x-auto">
              <pre>{JSON.stringify(selectedLogDetail, null, 2)}</pre>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs font-mono text-slate-500 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SentinelAI Governance & Conflict Engine © 2026</span>
          <span className="text-slate-400">Built for Enterprise Cyber Governance & SOC Operations</span>
        </div>
      </footer>

    </div>
  );
}
