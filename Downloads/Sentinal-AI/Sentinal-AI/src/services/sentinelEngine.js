// SentinelAI - Intelligent Governance Engine

import { SECURITY_POLICIES, USER_ROLES, SPECIALIZED_AGENTS } from '../data/mockData';

/**
 * Analyzes a security command request through the 6-stage AI Governance Pipeline
 */
export function analyzeCommand(commandText, roleId = 'admin', customPolicies = null) {
  const policies = customPolicies || SECURITY_POLICIES;
  const roleObj = USER_ROLES.find(r => r.id === roleId) || USER_ROLES[0];
  const normalizedCmd = commandText.trim().toLowerCase();

  // STAGE 1: INTENT EXTRACTION
  const intent = extractIntent(normalizedCmd, commandText);

  // STAGE 2: POLICY VALIDATION
  const policyResults = validatePolicies(normalizedCmd, roleId, intent, policies);

  // STAGE 3: CONFLICT DETECTION & MULTI-AGENT SYNTHESIS
  const multiAgentEvaluation = evaluateMultiAgentConflicts(normalizedCmd, intent, roleId);

  // STAGE 4: RISK ASSESSMENT
  const riskAssessment = calculateRiskScore(intent, roleId, policyResults, multiAgentEvaluation);

  // STAGE 5: DECISION ENGINE
  const decision = computeFinalVerdict(roleId, intent, policyResults, multiAgentEvaluation, riskAssessment);

  // STAGE 6: EXPLAINABILITY & AUDIT SUMMARY
  const explanation = generateExplainabilityReport(roleObj, intent, policyResults, multiAgentEvaluation, riskAssessment, decision);

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const logId = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id: logId,
    timestamp,
    userRole: roleId,
    roleObj,
    command: commandText,
    extractedIntent: intent,
    policyResults,
    multiAgentEvaluation,
    riskAssessment,
    decision,
    explanation,
    conflictsFound: multiAgentEvaluation.conflicts.length
  };
}

/**
 * Stage 1 Helper: Intent Extraction
 */
function extractIntent(cmdLower, originalCmd) {
  let action = 'Execute';
  let target = 'System Resource';
  let category = 'Operational';
  let confidence = 96;

  // Determine Action
  if (cmdLower.includes('delete') || cmdLower.includes('drop') || cmdLower.includes('remove') || cmdLower.includes('clear') || cmdLower.includes('wipe')) {
    action = 'Delete';
  } else if (cmdLower.includes('block') || cmdLower.includes('ban') || cmdLower.includes('lock')) {
    action = 'Block';
  } else if (cmdLower.includes('restart') || cmdLower.includes('reboot') || cmdLower.includes('reset')) {
    action = 'Restart';
  } else if (cmdLower.includes('shutdown') || cmdLower.includes('stop') || cmdLower.includes('terminate')) {
    action = 'Shutdown';
  } else if (cmdLower.includes('disable') || cmdLower.includes('deactivate')) {
    action = 'Disable';
  } else if (cmdLower.includes('isolate') || cmdLower.includes('quarantine')) {
    action = 'Isolate';
  } else if (cmdLower.includes('collect') || cmdLower.includes('extract') || cmdLower.includes('fetch')) {
    action = 'Collect Logs';
  } else if (cmdLower.includes('backup') || cmdLower.includes('snapshot')) {
    action = 'Create Backup';
  }

  // Determine Target & Category
  if (cmdLower.includes('database') || cmdLower.includes('db') || cmdLower.includes('table')) {
    target = cmdLower.includes('production') || cmdLower.includes('prod') ? 'Production Database' : 'Database Volume';
    category = 'Data Infrastructure';
  } else if (cmdLower.includes('firewall') || cmdLower.includes('gateway') || cmdLower.includes('router') || cmdLower.includes('ip')) {
    if (cmdLower.includes('ip')) {
      const match = originalCmd.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
      target = match ? `IP ${match[0]}` : 'Malicious IP Address';
    } else {
      target = 'Perimeter Firewall';
    }
    category = 'Network Security';
  } else if (cmdLower.includes('host') || cmdLower.includes('server') || cmdLower.includes('node') || cmdLower.includes('workstation')) {
    const match = originalCmd.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
    target = match ? `Host ${match[0]}` : (cmdLower.includes('server a') ? 'Server A' : 'Production Server');
    category = 'Endpoint Security';
  } else if (cmdLower.includes('rahul') || cmdLower.includes('user') || cmdLower.includes('employee') || cmdLower.includes('account')) {
    if (cmdLower.includes('rahul')) target = 'User Account (Rahul)';
    else if (cmdLower.includes('employee')) target = 'Employee Account';
    else target = 'User Credential';
    category = 'Identity & Access';
  } else if (cmdLower.includes('log') || cmdLower.includes('audit') || cmdLower.includes('siem')) {
    target = 'Audit & Telemetry Logs';
    category = 'Compliance & Audit';
  }

  confidence = 95 + Math.floor(Math.random() * 4);

  return {
    action,
    target,
    category,
    confidence,
    rawCommand: originalCmd,
    parameters: {
      isProduction: target.toLowerCase().includes('production') || target.toLowerCase().includes('prod') || target.toLowerCase().includes('database') || target.toLowerCase().includes('server'),
      isNetwork: category === 'Network Security' || category === 'Endpoint Security',
      isDestructive: action === 'Delete' || action === 'Shutdown' || action === 'Clear' || action === 'Block'
    }
  };
}

/**
 * Stage 2 Helper: Policy Validation
 */
function validatePolicies(cmdLower, roleId, intent, policies) {
  const matchedPolicies = [];
  let hasViolation = false;

  // RULE 1: Intern Role Restricted Access Guard (POL-100)
  // Interns (Level 1) are strictly restricted from executing operational modifications, blocks, shutdowns, isolates, or deletions.
  if (roleId === 'intern') {
    const isSafeReadAction = intent.action === 'Collect Logs' || intent.action === 'Create Backup' || cmdLower.includes('read') || cmdLower.includes('view');
    
    if (!isSafeReadAction) {
      hasViolation = true;
      matchedPolicies.push({
        policyId: 'POL-100',
        policyName: 'Intern Least-Privilege Execution Guard',
        category: 'Access Control',
        strictness: 'Critical',
        status: 'VIOLATION',
        explanation: `Role 'INTERN' lacks Level 3+ clearance required to execute '${intent.action} ${intent.target}'. Intern clearance is strictly limited to Read/Log operations.`
      });
    }
  }

  // RULE 2: Check standard Security Policies Matrix
  policies.forEach(policy => {
    if (policy.status !== 'ACTIVE') return;

    // Action matching
    const matchesAction = policy.actionMatcher.some(a => cmdLower.includes(a) || intent.action.toLowerCase().includes(a));
    // Target matching
    const matchesTarget = policy.targetMatcher.some(t => cmdLower.includes(t) || intent.target.toLowerCase().includes(t));

    if (matchesAction && matchesTarget) {
      const isRestrictedRole = policy.restrictedRoles.includes(roleId);
      const isAuditDelete = policy.id === 'POL-103' && intent.action === 'Delete';
      const isViolated = isRestrictedRole || isAuditDelete;

      if (isViolated) {
        hasViolation = true;
      }

      matchedPolicies.push({
        policyId: policy.id,
        policyName: policy.name,
        category: policy.category,
        strictness: policy.strictness,
        status: isViolated ? 'VIOLATION' : 'PASSED',
        explanation: isViolated 
          ? `Role '${roleId.toUpperCase()}' violates policy directive '${policy.name}'. ${policy.description}`
          : `Validated against ${policy.name}. Role clearance met.`
      });
    }
  });

  return {
    hasViolation,
    matchedCount: matchedPolicies.length,
    policies: matchedPolicies
  };
}

/**
 * Stage 3 Helper: Conflict Detection & Multi-Agent Engine
 */
function evaluateMultiAgentConflicts(cmdLower, intent, roleId) {
  const agentRecommendations = [];
  const conflicts = [];

  const isHostIsolation = intent.action === 'Isolate' || cmdLower.includes('isolate');
  const isDeleteProdDB = intent.action === 'Delete' && intent.target.includes('Database');

  // Agent 1: Threat Detection
  if (isHostIsolation) {
    agentRecommendations.push({
      agentId: 'agent_threat',
      agentName: 'Threat Detection Agent',
      avatar: '🛡️',
      recommendation: 'ISOLATE IMMEDIATELY',
      priority: 95,
      reason: 'Detected active C2 beaconing on port 4444. Delaying containment increases lateral propagation risk by 85%.',
      sentiment: 'URGENT_ACTION'
    });
  } else if (isDeleteProdDB) {
    agentRecommendations.push({
      agentId: 'agent_threat',
      agentName: 'Threat Detection Agent',
      avatar: '🛡️',
      recommendation: 'ABORT & ALERT SOC',
      priority: 98,
      reason: 'Unscheduled deletion request matches malicious insider behavior pattern.',
      sentiment: 'REJECT'
    });
  } else {
    agentRecommendations.push({
      agentId: 'agent_threat',
      agentName: 'Threat Detection Agent',
      avatar: '🛡️',
      recommendation: 'APPROVE',
      priority: 70,
      reason: 'No active malware signature or anomaly detected on target resource.',
      sentiment: 'APPROVE'
    });
  }

  // Agent 2: Compliance Agent
  if (isHostIsolation || isDeleteProdDB || cmdLower.includes('log')) {
    agentRecommendations.push({
      agentId: 'agent_compliance',
      agentName: 'Compliance & Audit Agent',
      avatar: '📜',
      recommendation: 'REQUIRE FORENSIC SNAPSHOT FIRST',
      priority: 90,
      reason: 'SOC2 Trust Criteria require full memory dump & immutable audit logging before network severance or deletion.',
      sentiment: 'CONDITIONAL'
    });
  } else {
    agentRecommendations.push({
      agentId: 'agent_compliance',
      agentName: 'Compliance & Audit Agent',
      avatar: '📜',
      recommendation: 'APPROVE WITH AUDIT',
      priority: 75,
      reason: 'Action complies with organizational change control framework.',
      sentiment: 'APPROVE'
    });
  }

  // Agent 3: Backup Agent
  if (isHostIsolation || isDeleteProdDB) {
    agentRecommendations.push({
      agentId: 'agent_backup',
      agentName: 'Backup & Data Safety Agent',
      avatar: '💾',
      recommendation: 'DELAY ACTION (JOB IN PROGRESS)',
      priority: 92,
      reason: 'CRITICAL: Scheduled database backup job #BK-4091 currently at 74% completion. Immediate drop will corrupt recovery state.',
      sentiment: 'DELAY'
    });
  } else {
    agentRecommendations.push({
      agentId: 'agent_backup',
      agentName: 'Backup & Data Safety Agent',
      avatar: '💾',
      recommendation: 'NO DATA IMPACT',
      priority: 60,
      reason: 'Operation does not modify persistent storage volumes.',
      sentiment: 'APPROVE'
    });
  }

  // Agent 4: Incident Response Agent
  if (isDeleteProdDB) {
    agentRecommendations.push({
      agentId: 'agent_ir',
      agentName: 'Incident Response Agent',
      avatar: '🚨',
      recommendation: 'VETO & DUAL-KEY ESCALATE',
      priority: 99,
      reason: 'Production DB destruction causes complete application outage ($120k/hr downtime estimate).',
      sentiment: 'ESCALATE'
    });
  } else if (isHostIsolation) {
    agentRecommendations.push({
      agentId: 'agent_ir',
      agentName: 'Incident Response Agent',
      avatar: '🚨',
      recommendation: 'ISOLATE WITH FAILOVER',
      priority: 88,
      reason: 'Traffic failover routed to standby cluster 02. Service uptime maintained.',
      sentiment: 'APPROVE'
    });
  } else {
    agentRecommendations.push({
      agentId: 'agent_ir',
      agentName: 'Incident Response Agent',
      avatar: '🚨',
      recommendation: 'APPROVE',
      priority: 65,
      reason: 'Low blast radius. Standard operating procedure.',
      sentiment: 'APPROVE'
    });
  }

  // Detect Conflicts between agent viewpoints
  if (isHostIsolation) {
    conflicts.push({
      conflictId: 'CONF-01',
      parties: ['Threat Detection Agent', 'Backup & Data Safety Agent'],
      issue: 'Threat Agent demands immediate network isolation vs Backup Agent requires 180s delay to finish active snapshot #BK-4091.',
      severity: 'HIGH'
    });
    conflicts.push({
      conflictId: 'CONF-02',
      parties: ['Threat Detection Agent', 'Compliance & Audit Agent'],
      issue: 'Threat Agent requests immediate connection severing vs Compliance Agent mandates diagnostic log snapshot prior to disconnect.',
      severity: 'MEDIUM'
    });
  } else if (isDeleteProdDB && roleId === 'admin') {
    conflicts.push({
      conflictId: 'CONF-03',
      parties: ['Admin User Intent', 'Incident Response Agent & Security Matrix'],
      issue: 'Admin user submitted high-risk DB deletion vs IR Agent veto due to catastrophic service outage impact.',
      severity: 'CRITICAL'
    });
  } else if (isDeleteProdDB && roleId === 'intern') {
    conflicts.push({
      conflictId: 'CONF-04',
      parties: ['Intern User Request', 'Company Security Policy POL-100 & POL-101'],
      issue: 'Intern user requested production DB deletion vs Policy POL-100 & POL-101 absolute restriction for Level-1 roles.',
      severity: 'CRITICAL'
    });
  }

  return {
    agentRecommendations,
    conflicts
  };
}

/**
 * Stage 4 Helper: Risk Assessment Engine
 */
function calculateRiskScore(intent, roleId, policyResults, multiAgentEval) {
  let baseScore = 20;

  // Action weight
  if (intent.action === 'Delete') baseScore += 50;
  else if (intent.action === 'Shutdown') baseScore += 35;
  else if (intent.action === 'Isolate') baseScore += 30;
  else if (intent.action === 'Restart') baseScore += 20;
  else if (intent.action === 'Block') baseScore += 20;
  else if (intent.action === 'Disable') baseScore += 20;
  else if (intent.action === 'Collect Logs') baseScore += 5;
  else if (intent.action === 'Create Backup') baseScore += 5;

  // Target weight
  if (intent.target.includes('Production') || intent.target.includes('Database')) baseScore += 25;
  if (intent.target.includes('Firewall') || intent.target.includes('Server')) baseScore += 15;

  // Policy violation penalty
  if (policyResults.hasViolation) baseScore += 25;

  const score = Math.min(100, Math.max(5, baseScore));

  let level = 'Low';
  let color = 'text-emerald-400';
  let badgeBg = 'bg-emerald-500/20 border-emerald-500/40';

  if (score >= 80) {
    level = 'Critical';
    color = 'text-rose-400';
    badgeBg = 'bg-rose-500/20 border-rose-500/40';
  } else if (score >= 60) {
    level = 'High';
    color = 'text-amber-400';
    badgeBg = 'bg-amber-500/20 border-amber-500/40';
  } else if (score >= 35) {
    level = 'Medium';
    color = 'text-cyan-400';
    badgeBg = 'bg-cyan-500/20 border-cyan-500/40';
  }

  return {
    score,
    level,
    color,
    badgeBg,
    blastRadius: score > 75 ? 'Enterprise-wide' : (score > 50 ? 'Subnet / Multi-service' : 'Single Host / Isolated'),
    downtimeRiskPct: Math.min(99, Math.round(score * 0.9)),
    dataLossRiskPct: intent.action === 'Delete' ? 95 : (intent.action === 'Isolate' ? 15 : 2),
    affectedServices: intent.target.includes('Database') 
      ? ['API Gateway', 'Billing Service', 'User Auth DB', 'Customer Portal']
      : (intent.target.includes('Firewall') ? ['External Ingress Router', 'VPN Concentrator'] : ['Host 192.168.1.105'])
  };
}

/**
 * Stage 5 Helper: Decision Engine Verdict
 */
function computeFinalVerdict(roleId, intent, policyResults, multiAgentEval, riskAssessment) {
  // Rule 1: Direct policy violation -> REJECTED
  if (policyResults.hasViolation) {
    const v = policyResults.policies.find(p => p.status === 'VIOLATION');
    return {
      verdict: 'REJECTED',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
      icon: '❌',
      summary: `Command REJECTED due to policy violation (${v ? v.policyId : 'POL-100'}). User role '${roleId.toUpperCase()}' does not possess required clearance for operational '${intent.action}' action.`
    };
  }

  // Rule 2: Active conflict between Threat AI & Backup AI -> DELAYED
  const hasBackupConflict = multiAgentEval.conflicts.some(c => c.parties.includes('Backup & Data Safety Agent'));
  if (hasBackupConflict && (intent.action === 'Isolate' || intent.action === 'Shutdown')) {
    return {
      verdict: 'DELAYED',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      icon: '⏳',
      summary: 'Command DELAYED for 180 seconds to allow active backup job #BK-4091 to complete cleanly and trigger forensic log extraction.'
    };
  }

  // Rule 3: Deleting Production DB by Admin -> ESCALATED for Dual-Key co-approval
  if (intent.action === 'Delete' && intent.target.includes('Database') && roleId === 'admin') {
    return {
      verdict: 'ESCALATED',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      icon: '⚠️',
      summary: 'Command ESCALATED for Dual-Key Human Multi-Sig Approval. High-risk database destruction by Admin requires SOC Manager co-authorization.'
    };
  }

  // Rule 4: Clean passed request for authorized roles (Admin, SOC Manager, Analyst) -> APPROVED
  return {
    verdict: 'APPROVED',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    icon: '✅',
    summary: `Command APPROVED for immediate execution. Role '${roleId.toUpperCase()}' holds valid clearance for '${intent.action} ${intent.target}'. All policy and consensus checks passed.`
  };
}

/**
 * Stage 6 Helper: Generate Human-Readable Explainability Report
 */
function generateExplainabilityReport(roleObj, intent, policyResults, multiAgentEval, riskAssessment, decision) {
  let policyInfluence = 'No strict policy violations detected.';
  if (policyResults.hasViolation) {
    const v = policyResults.policies.find(p => p.status === 'VIOLATION');
    policyInfluence = `Governed by Policy '${v ? v.policyName : 'Access Control Directive'}'. Role '${roleObj.name}' is restricted from '${intent.action} ${intent.target}'.`;
  } else if (policyResults.matchedCount > 0) {
    policyInfluence = `Validated against ${policyResults.matchedCount} active governance policies (${policyResults.policies.map(p => p.policyId).join(', ')}).`;
  }

  let conflictExplanation = 'No agent conflicts detected. Single-path approval.';
  if (multiAgentEval.conflicts.length > 0) {
    conflictExplanation = multiAgentEval.conflicts.map(c => `[${c.severity}] ${c.issue}`).join(' | ');
  }

  let ignoredRecommendations = 'All agent safety recommendations were satisfied.';
  if (decision.verdict === 'DELAYED') {
    ignoredRecommendations = 'Threat Detection Agent recommendation for immediate 0-second isolation was delayed by 180s to prioritize Backup & Data Safety Agent integrity guarantee.';
  } else if (decision.verdict === 'REJECTED') {
    ignoredRecommendations = 'User request was rejected despite operational intent to prevent unauthorized or destructive impact.';
  }

  let finalActionRecommendation = 'Execute command via automated execution daemon.';
  if (decision.verdict === 'REJECTED') finalActionRecommendation = 'Block command execution. Log security violation alert for SOC Lead.';
  else if (decision.verdict === 'DELAYED') finalActionRecommendation = 'Queue command in staging pipeline. Auto-resume in 180s following backup completion.';
  else if (decision.verdict === 'ESCALATED') finalActionRecommendation = 'Dispatch Dual-Key approval alert to SOC Manager dashboard mobile app.';

  return {
    whyDecisionMade: decision.summary,
    policyInfluences: policyInfluence,
    conflictsDetected: conflictExplanation,
    ignoredRecommendationsReason: ignoredRecommendations,
    finalRecommendedAction: finalActionRecommendation
  };
}
