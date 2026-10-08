import React, { useState, useEffect } from 'react';
import { Shield, Activity, ShieldCheck, AlertTriangle, ShieldAlert, Zap, Clock, Code, Database, FileDigit } from 'lucide-react';

export default function FirewallTestCenter() {
  const [config, setConfig] = useState(null);
  const [testLogs, setTestLogs] = useState([]);
  const [rateLimitState, setRateLimitState] = useState({
    sent: 0,
    allowed: 0,
    blocked: 0,
    status: 'IDLE'
  });

  useEffect(() => {
    fetch('/api/security-config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  const addTestLog = (test, result, rule, action, status) => {
    setTestLogs(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      test,
      result,
      rule,
      action,
      status
    }, ...prev]);
  };

  const runWafTest = async (testName, payload, ruleName) => {
    try {
      const response = await fetch(`/api/security-test-waf?payload=${encodeURIComponent(payload)}`, {
        method: 'GET'
      });
      
      if (response.status === 403) {
        addTestLog(testName, 'DETECTED', ruleName, 'BLOCKED', 403);
      } else {
        addTestLog(testName, 'ALLOWED', ruleName, 'BYPASSED', response.status);
      }
    } catch (err) {
      console.error(err);
      addTestLog(testName, 'ERROR', ruleName, 'FAILED', 500);
    }
  };

  const runRateLimitTest = async () => {
    setRateLimitState({ sent: 0, allowed: 0, blocked: 0, status: 'RUNNING' });
    
    let sent = 0;
    let allowed = 0;
    let blocked = 0;

    const interval = setInterval(async () => {
      if (sent >= 15) {
        clearInterval(interval);
        setRateLimitState(prev => ({ ...prev, status: 'COMPLETED' }));
        return;
      }
      
      sent++;
      setRateLimitState(prev => ({ ...prev, sent }));
      
      try {
        const response = await fetch('/api/auth/test-rate-limit', { method: 'POST' });
        if (response.status === 429) {
          blocked++;
          addTestLog('Rate Limit', 'DETECTED', 'authLimiter (10/15min)', 'BLOCKED', 429);
        } else if (response.ok) {
          allowed++;
          addTestLog('Rate Limit', 'ALLOWED', 'authLimiter (10/15min)', 'PASSED', 200);
        }
        setRateLimitState(prev => ({ ...prev, allowed, blocked }));
      } catch (e) {
        // network error
      }
    }, 300);
  };

  if (!config) return <div className="p-8 text-white">Loading Test Center...</div>;

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-6 font-sans">
      <header className="mb-8 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-amber-400" />
          Firewall Test Center
        </h1>
        <p className="text-amber-400/80 bg-amber-400/10 inline-block px-3 py-1 rounded-md text-sm border border-amber-400/20">
          AUTHORIZED ADMIN ACCESS ONLY
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
          <div>
            <h3 className="text-sm text-gray-400">Firewall Status</h3>
            <p className={`text-xl font-bold ${config.WAF_ENABLED ? 'text-emerald-400' : 'text-red-400'}`}>
              {config.WAF_ENABLED ? '🛡️ ACTIVE' : 'DISABLED'}
            </p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center gap-4">
          <Activity className="w-10 h-10 text-blue-500" />
          <div>
            <h3 className="text-sm text-gray-400">Rate Limiter</h3>
            <p className={`text-xl font-bold ${config.RATE_LIMIT_ENABLED ? 'text-emerald-400' : 'text-red-400'}`}>
              {config.RATE_LIMIT_ENABLED ? '🛡️ ACTIVE' : 'DISABLED'}
            </p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center gap-4">
          <FileDigit className="w-10 h-10 text-purple-500" />
          <div>
            <h3 className="text-sm text-gray-400">Security Logging</h3>
            <p className={`text-xl font-bold ${config.SECURITY_LOGGING ? 'text-emerald-400' : 'text-red-400'}`}>
              {config.SECURITY_LOGGING ? '🛡️ ACTIVE' : 'DISABLED'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="bg-gray-900/50 p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white">Safe Security Tests</h2>
            <p className="text-sm text-gray-400">These buttons send harmless simulated payloads to verify WAF detection.</p>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={() => runWafTest('XSS Detection', '<TEST-XSS>', 'XSS Pattern Match')}
              className="w-full flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-colors text-left"
            >
              <div>
                <span className="font-bold text-white block"><Code className="w-4 h-4 inline mr-2 text-blue-400"/> XSS Detection Test</span>
                <span className="text-xs text-gray-400 font-mono">Payload: &lt;TEST-XSS&gt;</span>
              </div>
              <span className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-bold">RUN TEST</span>
            </button>
            
            <button 
              onClick={() => runWafTest('SQL Injection', 'TEST_SQL_INJECTION_PATTERN', 'SQLi Pattern Match')}
              className="w-full flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-colors text-left"
            >
              <div>
                <span className="font-bold text-white block"><Database className="w-4 h-4 inline mr-2 text-red-400"/> SQL Injection Test</span>
                <span className="text-xs text-gray-400 font-mono">Payload: TEST_SQL_INJECTION_PATTERN</span>
              </div>
              <span className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded font-bold">RUN TEST</span>
            </button>
            
            <button 
              onClick={() => runWafTest('Path Traversal', 'TEST_PATH_TRAVERSAL_PATTERN', 'Path Traversal Match')}
              className="w-full flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-colors text-left"
            >
              <div>
                <span className="font-bold text-white block"><AlertTriangle className="w-4 h-4 inline mr-2 text-amber-400"/> Path Traversal Test</span>
                <span className="text-xs text-gray-400 font-mono">Payload: TEST_PATH_TRAVERSAL_PATTERN</span>
              </div>
              <span className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-1.5 rounded font-bold">RUN TEST</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-gray-900/50 p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white">Rate Limit Test</h2>
            <p className="text-sm text-gray-400">Sends 15 rapid requests to the authentication endpoint.</p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center flex-1">
            <div className="flex gap-4 mb-6 w-full text-center">
              <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex-1">
                <div className="text-xs text-gray-400 mb-1">Sent</div>
                <div className="text-2xl font-bold text-white">{rateLimitState.sent}/15</div>
              </div>
              <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-900/50 flex-1">
                <div className="text-xs text-emerald-400 mb-1">Allowed</div>
                <div className="text-2xl font-bold text-emerald-400">{rateLimitState.allowed}</div>
              </div>
              <div className="bg-red-900/20 p-3 rounded-lg border border-red-900/50 flex-1">
                <div className="text-xs text-red-400 mb-1">Blocked (429)</div>
                <div className="text-2xl font-bold text-red-400">{rateLimitState.blocked}</div>
              </div>
            </div>
            
            <button 
              onClick={runRateLimitTest}
              disabled={rateLimitState.status === 'RUNNING'}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg w-full flex justify-center items-center gap-2 transition-colors"
            >
              <Clock className="w-5 h-5" />
              {rateLimitState.status === 'RUNNING' ? 'Running Test...' : 'Start Rate Limit Test'}
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">Limit: 10 requests / 15 minutes</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden mb-8">
        <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Live Test Log</h2>
          <span className="text-xs text-gray-400 font-mono">Updates automatically</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900 text-gray-400 text-xs font-mono border-b border-gray-700">
              <tr>
                <th className="px-4 py-3">TIME</th>
                <th className="px-4 py-3">TEST</th>
                <th className="px-4 py-3">RESULT</th>
                <th className="px-4 py-3">RULE</th>
                <th className="px-4 py-3">ACTION</th>
                <th className="px-4 py-3">HTTP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50 text-sm font-mono">
              {testLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No tests executed yet.</td>
                </tr>
              ) : (
                testLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-gray-400">{log.time}</td>
                    <td className="px-4 py-3 text-gray-200">{log.test}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${log.result === 'DETECTED' ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400'}`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{log.rule}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${log.action === 'BLOCKED' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${log.status === 403 || log.status === 429 ? 'bg-red-900/40 text-red-400' : 'bg-emerald-900/40 text-emerald-400'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Request Flow Visualization</h2>
        <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
          <pre className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre">
{`┌──────────────┐
│ User Request │
└──────┬───────┘
       ↓ (Express server.js intercepts on port 3000)
┌──────────────┐
│ WAF Firewall │ ───> Checks payload against XSS, SQLi, and Path Traversal regex
└──────┬───────┘
       ↓
  Suspicious?
  ↙       ↘
YES        NO
 ↓          ↓
BLOCK      Continue
(403)       ↓
 ↓      ┌──────────────┐
LOG     │ Rate Limiter │ ───> Checks IP against limits (100/min API, 10/15min Auth)
        └──────┬───────┘
               ↓
          Over Limit?
          ↙         ↘
        YES          NO
         ↓            ↓
       BLOCK       Continue
       (429)          ↓
               ┌──────────────┐
               │    Proxy     │ ───> Forwarded via http-proxy-middleware
               └──────┬───────┘
                      ↓ (https://neon.tech)
               ┌──────────────┐
               │   Supabase   │
               │   Database   │
               └──────────────┘`}
          </pre>
        </div>
      </div>
    </div>
  );
}
