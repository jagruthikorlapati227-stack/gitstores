import React, { useState } from 'react';
import { Lock, Shield, Plus, ToggleLeft, ToggleRight, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { SECURITY_POLICIES, USER_ROLES } from '../data/mockData';

export default function PolicyManager() {
  const [policies, setPolicies] = useState(SECURITY_POLICIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    category: 'Data Governance',
    strictness: 'Strict',
    description: '',
    restrictedRole: 'intern'
  });

  const togglePolicy = (id) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : p));
  };

  const handleAddPolicy = () => {
    if (!newPolicy.name.trim() || !newPolicy.description.trim()) return;
    const newId = `POL-${100 + policies.length + 1}`;
    const added = {
      id: newId,
      name: newPolicy.name,
      category: newPolicy.category,
      strictness: newPolicy.strictness,
      description: newPolicy.description,
      restrictedRoles: [newPolicy.restrictedRole],
      requiredRole: 'admin',
      actionMatcher: ['delete', 'modify'],
      targetMatcher: ['system', 'resource'],
      status: 'ACTIVE'
    };
    setPolicies([added, ...policies]);
    setShowAddModal(false);
    setNewPolicy({ name: '', category: 'Data Governance', strictness: 'Strict', description: '', restrictedRole: 'intern' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold font-mono text-white">Security Governance Policies Matrix</h2>
            </div>
            <p className="text-xs font-mono text-slate-300 mt-1">
              Active company security directives evaluated in Step 2 of SentinelAI's decision pipeline.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 font-bold" />
            <span>CREATE NEW POLICY RULE</span>
          </button>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((policy) => {
          const isActive = policy.status === 'ACTIVE';
          return (
            <div 
              key={policy.id} 
              className={`glass-panel p-5 rounded-2xl border transition-all space-y-3 ${
                isActive ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/50">
                    {policy.id}
                  </span>
                  <h3 className="text-sm font-bold font-mono text-white">{policy.name}</h3>
                </div>

                <button 
                  onClick={() => togglePolicy(policy.id)}
                  className="flex items-center gap-1.5 text-xs font-mono"
                >
                  {isActive ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ToggleRight className="w-6 h-6 text-emerald-400" /> ACTIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-500">
                      <ToggleLeft className="w-6 h-6 text-slate-600" /> DISABLED
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-500/20">
                  {policy.category}
                </span>
                <span className={`px-2 py-0.5 rounded border font-semibold ${
                  policy.strictness === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                  policy.strictness === 'Strict' || policy.strictness === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                }`}>
                  Strictness: {policy.strictness}
                </span>
              </div>

              <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {policy.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div>
                  <span>Restricted Roles: </span>
                  <span className="text-rose-400 font-semibold">{policy.restrictedRoles.join(', ')}</span>
                </div>
                <div>
                  <span>Matching Keywords: </span>
                  <span className="text-cyan-300">{policy.actionMatcher.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Policy Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Define Custom Security Policy Rule
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Policy Title</label>
                <input
                  type="text"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  placeholder="e.g. Mandatory Multi-factor Lockout Rule"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Category</label>
                  <select
                    value={newPolicy.category}
                    onChange={(e) => setNewPolicy({ ...newPolicy, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300"
                  >
                    <option value="Data Governance">Data Governance</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Endpoint Security">Endpoint Security</option>
                    <option value="Identity & Access">Identity & Access</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Restricted Role</label>
                  <select
                    value={newPolicy.restrictedRole}
                    onChange={(e) => setNewPolicy({ ...newPolicy, restrictedRole: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300"
                  >
                    {USER_ROLES.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Policy Rationale & Directive Description</label>
                <textarea
                  rows={3}
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                  placeholder="Describe exact conditions under which action is denied..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl font-mono text-xs bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPolicy}
                className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                Add Policy Directive
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
