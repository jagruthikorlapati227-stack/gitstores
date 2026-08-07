import React from 'react';
import { Shield, ShieldAlert, Cpu, Activity, UserCheck, Play, Sparkles, Database, Terminal, FileText, Lock } from 'lucide-react';
import { USER_ROLES, DEMO_SCENARIOS } from '../data/mockData';

export default function Navbar({ 
  currentRole, 
  setCurrentRole, 
  activeTab, 
  setActiveTab, 
  onRunScenario,
  isAnalyzing
}) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border-b border-slate-800/60 py-1 px-4 text-xs font-mono text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            SENTINEL ENGINE ACTIVE
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">Policy Matrix v4.2 Online</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-cyan-400 hidden md:inline">Conflict Resolution Model: Sentinel-v3</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500">Latency: 14ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" /> Multi-Sig Guard Active
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-emerald-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
              <Shield className="w-7 h-7 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent font-mono">
                  SENTINEL<span className="text-cyan-400">AI</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">AI Governance & Conflict Resolution Engine</p>
            </div>
          </div>

          {/* User Role Switcher Dropdown */}
          <div className="flex items-center gap-3 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 px-2 text-xs font-mono text-slate-400">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Active Role:</span>
            </div>
            <div className="flex gap-1">
              {USER_ROLES.map((role) => {
                const isActive = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setCurrentRole(role.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? `${role.color} shadow-md border font-semibold`
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{role.avatar}</span>
                    <span>{role.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Navigation Tabs & Hackathon Scenarios Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
          
          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'dashboard', label: 'SOC Dashboard', icon: Activity },
              { id: 'analyzer', label: 'Command Analyzer', icon: Terminal },
              { id: 'arena', label: 'Multi-Agent Arena', icon: Cpu },
              { id: 'audit', label: 'Audit Ledger', icon: FileText },
              { id: 'policies', label: 'Security Policies', icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Judge Quick Scenarios Bar */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 overflow-x-auto">
            <span className="px-2 text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Demo Presets:
            </span>
            {DEMO_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                disabled={isAnalyzing}
                onClick={() => onRunScenario(sc)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm disabled:opacity-50"
                title={sc.description}
              >
                <Play className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                <span>Preset {idx + 1}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </header>
  );
}
