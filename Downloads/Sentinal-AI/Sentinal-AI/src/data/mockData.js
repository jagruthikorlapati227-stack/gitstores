// SentinelAI - Mock Data & Security Governance Matrix

export const USER_ROLES = [
  {
    id: 'admin',
    name: 'Admin',
    title: 'Global Security Administrator',
    clearance: 'Level 5 - Unrestricted',
    avatar: '🛡️',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'Full administrative access across all infrastructure, networks, and databases.'
  },
  {
    id: 'soc_manager',
    name: 'SOC Manager',
    title: 'Security Operations Lead',
    clearance: 'Level 4 - High Command',
    avatar: '👨‍✈️',
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    description: 'Lead authority for incident response, threat containment, and escalation oversight.'
  },
  {
    id: 'security_analyst',
    name: 'Security Analyst',
    title: 'L2 Threat Analyst',
    clearance: 'Level 3 - Operational',
    avatar: '🕵️',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    description: 'Monitors alerts, initiates host containment, and collects telemetry logs.'
  },
  {
    id: 'intern',
    name: 'Intern',
    title: 'Junior Security Trainee',
    clearance: 'Level 1 - Restricted Read-Only',
    avatar: '🎓',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    description: 'Restricted trainee account. Cannot execute destructive or critical production actions.'
  }
];

export const DEMO_SCENARIOS = [
  {
    id: 'scenario-1',
    title: '1. Intern Deletes Production DB',
    badge: 'Policy Violation',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    roleId: 'intern',
    command: 'Delete Production Database',
    description: 'Junior intern attempts to execute drop table / delete on production DB. SentinelAI detects policy violation & rejects request.',
    expectedVerdict: 'REJECTED'
  },
  {
    id: 'scenario-2',
    title: '2. Admin Deletes Production DB',
    badge: 'Dual-Key Governance',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    roleId: 'admin',
    command: 'Delete Production Database',
    description: 'High-privilege admin submits DB deletion. High risk triggers Dual-Key Escalation requiring SOC Manager co-approval.',
    expectedVerdict: 'ESCALATED'
  },
  {
    id: 'scenario-3',
    title: '3. Multi-Agent Host Containment Conflict',
    badge: 'Conflict Resolution',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    roleId: 'security_analyst',
    command: 'Isolate Host 192.168.1.105',
    description: 'Analyst requests host isolation. Threat Agent demands instant drop, Backup Agent has live job running, Compliance wants audit logs first. SentinelAI delays & orchestrates sequence.',
    expectedVerdict: 'DELAYED'
  },
  {
    id: 'scenario-4',
    title: '4. SOC Manager Blocks Malicious IP',
    badge: 'Fast-Track Approval',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    roleId: 'soc_manager',
    command: 'Block Malicious IP 185.220.101.4',
    description: 'SOC Lead initiates containment on verified threat actor IP. Request validated against policies & approved with zero conflict.',
    expectedVerdict: 'APPROVED'
  }
];

export const PRESET_COMMANDS = [
  { label: 'Delete Production Database', category: 'Infrastructure', defaultRisk: 'Critical' },
  { label: 'Block User Rahul', category: 'Identity & Access', defaultRisk: 'Medium' },
  { label: 'Restart Firewall', category: 'Network', defaultRisk: 'High' },
  { label: 'Shutdown Server A', category: 'Infrastructure', defaultRisk: 'High' },
  { label: 'Disable Employee Account', category: 'Identity & Access', defaultRisk: 'Medium' },
  { label: 'Isolate Host 192.168.1.105', category: 'Endpoint Security', defaultRisk: 'High' },
  { label: 'Collect Logs from DB-01', category: 'Compliance & Audit', defaultRisk: 'Low' },
  { label: 'Create Production Backup', category: 'Data Protection', defaultRisk: 'Low' }
];

export const SECURITY_POLICIES = [
  {
    id: 'POL-101',
    name: 'Production Resource Destruction Guard',
    category: 'Data Governance',
    strictness: 'Strict',
    description: 'Interns and Level-1 operators are strictly prohibited from deleting or dropping production databases and storage assets.',
    restrictedRoles: ['intern'],
    requiredRole: 'admin',
    actionMatcher: ['delete', 'drop', 'destroy', 'purge'],
    targetMatcher: ['production', 'prod', 'database', 'db'],
    status: 'ACTIVE'
  },
  {
    id: 'POL-102',
    name: 'Network Perimeter Control Policy',
    category: 'Network Security',
    strictness: 'High',
    description: 'Restarting or modifying primary firewalls requires Admin or SOC Manager clearance. Interns & Analysts cannot restart perimeter devices.',
    restrictedRoles: ['intern', 'security_analyst'],
    requiredRole: 'soc_manager',
    actionMatcher: ['restart', 'reboot', 'flush', 'disable'],
    targetMatcher: ['firewall', 'gateway', 'router', 'perimeter'],
    status: 'ACTIVE'
  },
  {
    id: 'POL-103',
    name: 'Immutable Audit Trail Protection',
    category: 'Compliance',
    strictness: 'Critical',
    description: 'Audit logs, SIEM telemetry, and forensic records must NEVER be deleted or truncated by any role under any circumstances.',
    restrictedRoles: ['intern', 'security_analyst', 'soc_manager', 'admin'],
    requiredRole: 'none',
    actionMatcher: ['delete', 'clear', 'truncate', 'wipe', 'remove'],
    targetMatcher: ['audit', 'log', 'telemetry', 'siem', 'forensic'],
    status: 'ACTIVE'
  },
  {
    id: 'POL-104',
    name: 'Host Isolation Pre-requisites',
    category: 'Endpoint Security',
    strictness: 'Medium',
    description: 'Host isolation must ensure live backup operations complete or are cleanly checkpointed, and diagnostic logs are snapshot before network drop.',
    restrictedRoles: ['intern'],
    requiredRole: 'security_analyst',
    actionMatcher: ['isolate', 'quarantine', 'disconnect', 'drop'],
    targetMatcher: ['host', 'server', 'workstation', 'endpoint'],
    status: 'ACTIVE'
  },
  {
    id: 'POL-105',
    name: 'Identity Lockout Clearance',
    category: 'Identity',
    strictness: 'Standard',
    description: 'Disabling employee accounts requires Level 3 (Analyst) or higher clearance to prevent unauthorized denial of access.',
    restrictedRoles: ['intern'],
    requiredRole: 'security_analyst',
    actionMatcher: ['disable', 'block', 'lock', 'terminate'],
    targetMatcher: ['user', 'account', 'employee', 'credential'],
    status: 'ACTIVE'
  }
];

export const SPECIALIZED_AGENTS = [
  {
    id: 'agent_threat',
    name: 'Threat Detection Agent',
    code: 'SENTINEL-THREAT-01',
    role: 'Real-time Anomaly & Malicious Behavior Detector',
    avatar: '🛡️',
    accentColor: '#38bdf8',
    bias: 'Speed & Containment First (Risk Avoidance)',
    description: 'Evaluates malware indicators, active C2 channels, and compromised node indicators.'
  },
  {
    id: 'agent_compliance',
    name: 'Compliance & Regulatory Agent',
    code: 'SENTINEL-COMPLIANCE-02',
    role: 'SOC2 / ISO27001 / HIPAA Governance Watchdog',
    avatar: '📜',
    accentColor: '#c084fc',
    bias: 'Legal Mandates & Evidence Preservation First',
    description: 'Ensures chain of custody, log retention mandates, and regulatory compliance before action.'
  },
  {
    id: 'agent_backup',
    name: 'Backup & Data Safety Agent',
    code: 'SENTINEL-DATA-03',
    role: 'Data Resilience & Snapshot Safeguard',
    avatar: '💾',
    accentColor: '#34d399',
    bias: 'Data Integrity & State Preservation First',
    description: 'Tracks active backup pipelines, state locks, database transactions, and recovery points.'
  },
  {
    id: 'agent_ir',
    name: 'Incident Response Agent',
    code: 'SENTINEL-IR-04',
    role: 'Operational Continuity & Blast Radius Controller',
    avatar: '🚨',
    accentColor: '#fbbf24',
    bias: 'Business Continuity & Uptime Balance',
    description: 'Calculates financial downtime, service dependency trees, and cluster failover capacity.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-8849',
    timestamp: '2026-08-03 23:25:12',
    userRole: 'soc_manager',
    command: 'Block Malicious IP 185.220.101.4',
    extractedIntent: { action: 'Block', target: 'IP 185.220.101.4', category: 'Network Security' },
    riskLevel: 'Medium',
    riskScore: 42,
    decision: 'APPROVED',
    reason: 'Verified threat actor IP involved in SSH brute force attack. SOC Manager holds Level 4 clearance.',
    conflictsFound: 0
  },
  {
    id: 'LOG-8848',
    timestamp: '2026-08-03 23:18:40',
    userRole: 'intern',
    command: 'Delete Production Database',
    extractedIntent: { action: 'Delete', target: 'Production Database', category: 'Infrastructure' },
    riskLevel: 'Critical',
    riskScore: 98,
    decision: 'REJECTED',
    reason: 'Policy POL-101 Violation: Role Intern does not possess Level 5 clearance required for destructive database actions.',
    conflictsFound: 1
  },
  {
    id: 'LOG-8847',
    timestamp: '2026-08-03 22:50:11',
    userRole: 'security_analyst',
    command: 'Isolate Host 192.168.1.105',
    extractedIntent: { action: 'Isolate', target: 'Host 192.168.1.105', category: 'Endpoint Security' },
    riskLevel: 'High',
    riskScore: 78,
    decision: 'DELAYED',
    reason: 'Conflict detected between Threat AI (Instant drop) and Backup AI (Active DB backup). Action delayed 180s for clean flush.',
    conflictsFound: 2
  },
  {
    id: 'LOG-8846',
    timestamp: '2026-08-03 22:15:05',
    userRole: 'admin',
    command: 'Restart Firewall',
    extractedIntent: { action: 'Restart', target: 'Perimeter Firewall', category: 'Network' },
    riskLevel: 'High',
    riskScore: 65,
    decision: 'APPROVED',
    reason: 'Admin level privileges validated. Scheduled maintenance window active with failover routing enabled.',
    conflictsFound: 0
  },
  {
    id: 'LOG-8845',
    timestamp: '2026-08-03 21:40:22',
    userRole: 'intern',
    command: 'Clear Audit Logs',
    extractedIntent: { action: 'Clear', target: 'Audit Logs', category: 'Compliance' },
    riskLevel: 'Critical',
    riskScore: 100,
    decision: 'REJECTED',
    reason: 'Policy POL-103 Violation: Immutable Audit Trail Protection prohibits deletion of security telemetry by any role.',
    conflictsFound: 1
  }
];

export const INITIAL_METRICS = {
  totalRequests: 148,
  approvedCount: 92,
  rejectedCount: 38,
  delayedCount: 12,
  escalatedCount: 6,
  conflictsDetected: 29,
  criticalActivitiesPrevented: 19,
  avgResponseMs: 142
};
