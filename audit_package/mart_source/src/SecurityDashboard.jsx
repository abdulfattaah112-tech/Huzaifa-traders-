import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity, AlertTriangle, List, MapPin, Search, Server, Lock, Unlock, Database, Cpu, Globe, Settings, Download, XCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function SecurityDashboard() {
  const [logs, setLogs] = useState([]);
  const [config, setConfig] = useState({
    WAF_ENABLED: true,
    RATE_LIMIT_ENABLED: true,
    CSRF_ENABLED: true,
    SECURITY_LOGGING: true,
    BOT_PROTECTION: true,
    FILE_UPLOAD_PROTECTION: true,
    SECURITY_ENABLED: true
  });
  const [blockedIps, setBlockedIps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, configRes, ipsRes] = await Promise.all([
          fetch('/api/security-logs'),
          fetch('/api/security-config'),
          fetch('/api/security-blocked-ips')
        ]);
        
        if (logsRes.ok) setLogs(await logsRes.json());
        if (configRes.ok) setConfig(await configRes.json());
        if (ipsRes.ok) setBlockedIps(await ipsRes.json());
      } catch (err) {
        console.error('Failed to fetch security data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleConfig = async (key) => {
    const newValue = !config[key];
    setConfig(prev => ({ ...prev, [key]: newValue }));
    
    try {
      await fetch('/api/security-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: newValue })
      });
    } catch (error) {
      console.error("Failed to update config", error);
      // Revert on failure
      setConfig(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  // Metrics calculations
  const totalBlocked = logs.length;
  const suspiciousCount = logs.filter(l => l.severity === 'MEDIUM').length;
  const xssCount = logs.filter(l => l.type && l.type.includes('XSS')).length;
  const sqlCount = logs.filter(l => l.type && l.type.includes('SQL')).length;
  const pathCount = logs.filter(l => l.type && l.type.includes('Traversal')).length;
  const otherCount = totalBlocked - (xssCount + sqlCount + pathCount);

  // Security Score Calculation
  const activeFeatures = Object.values(config).filter(v => v).length;
  const totalFeatures = Object.keys(config).length;
  const securityScore = Math.round((activeFeatures / totalFeatures) * 100);

  // Chart Data
  const pieData = [
    { name: 'XSS', value: xssCount, color: '#3B82F6' },
    { name: 'SQL Injection', value: sqlCount, color: '#EF4444' },
    { name: 'Path Traversal', value: pathCount, color: '#F59E0B' },
    { name: 'Other', value: otherCount, color: '#6B7280' }
  ].filter(d => d.value > 0);

  const StatusIndicator = ({ active }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
      {active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {active ? 'ACTIVE' : 'DISABLED'}
    </span>
  );

  const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl flex flex-col relative overflow-hidden group hover:border-gray-600 transition-colors">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
        <Icon className="w-16 h-16" />
      </div>
      <p className="text-gray-400 text-sm font-medium mb-1 z-10">{title}</p>
      <p className="text-3xl font-bold text-white z-10 mb-2">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 z-10">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-500" />
            Security & WAF Center
          </h1>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PROTECTED
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-sm text-gray-500">System Uptime: 99.9%</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-gray-700">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Top Stats */}
        <StatCard title="Total Blocked" value={totalBlocked} icon={ShieldAlert} colorClass="text-red-500" subtitle={totalBlocked === 0 ? "0 — No threats detected" : "Requests blocked by WAF"} />
        <StatCard title="Suspicious" value={suspiciousCount} icon={Activity} colorClass="text-amber-500" subtitle={suspiciousCount === 0 ? "0 — No suspicious behavior" : "Flagged for review"} />
        <StatCard title="Security Events" value={logs.length} icon={AlertTriangle} colorClass="text-blue-500" subtitle="Total logged events" />
        
        {/* Security Score */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Security Score</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${securityScore > 80 ? 'text-emerald-400' : securityScore > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {securityScore}
                </span>
                <span className="text-gray-500 font-medium">/100</span>
              </div>
            </div>
            <Activity className={`w-8 h-8 ${securityScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`} />
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-4 z-10">
            <div className={`h-2 rounded-full ${securityScore > 80 ? 'bg-emerald-500' : securityScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${securityScore}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live WAF Status */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" /> WAF Protection
            </h2>
            <StatusIndicator active={config.WAF_ENABLED} />
          </div>
          <div className="space-y-4">
            {Object.entries({
              'SQL Injection': config.WAF_ENABLED,
              'XSS Protection': config.WAF_ENABLED,
              'Path Traversal': config.WAF_ENABLED,
              'Rate Limiting': config.RATE_LIMIT_ENABLED,
              'CSRF Protection': config.CSRF_ENABLED,
              'Bot Protection': config.BOT_PROTECTION,
              'File Upload': config.FILE_UPLOAD_PROTECTION
            }).map(([label, active]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-0">
                <span className="text-sm text-gray-300">{label}</span>
                {active ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Attack Categories Chart */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 lg:col-span-1 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-4">Attack Categories</h2>
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 text-gray-700 mb-2" />
                <p>No threats detected</p>
              </div>
            )}
          </div>
        </div>

        {/* Firewall Controls */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 lg:col-span-1">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" /> Firewall Controls
          </h2>
          <div className="space-y-4">
            {Object.entries({
              WAF_ENABLED: 'Web Application Firewall',
              RATE_LIMIT_ENABLED: 'Rate Limiting',
              CSRF_ENABLED: 'CSRF Protection',
              SECURITY_LOGGING: 'Security Logging',
              BOT_PROTECTION: 'Bot Protection',
              FILE_UPLOAD_PROTECTION: 'File Upload Protection'
            }).map(([key, label]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <button
                  onClick={() => toggleConfig(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${config[key] ? 'bg-emerald-500' : 'bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Events Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <List className="w-5 h-5 text-blue-400" /> Recent Security Events
          </h2>
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading events...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center border-t border-gray-800">
            <ShieldCheck className="w-16 h-16 text-gray-700 mb-3" />
            <p className="text-lg">No security events recorded.</p>
            <p className="text-sm mt-1">Your system is currently secure.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Source IP</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {logs.slice(0, 10).map(log => (
                  <tr key={log.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${log.severity === 'HIGH' ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-200">{log.type}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{log.ip.replace(/:\d+$/, '') || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{log.method}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-[200px] truncate" title={log.url}>{log.url}</td>
                    <td className="px-6 py-4">
                      <span className="text-red-400 font-bold text-xs">BLOCKED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Blocked IPs & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-700 bg-gray-800/80">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" /> Temporarily Blocked IPs
            </h2>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
            {blockedIps.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">No IP addresses are currently blocked.</p>
            ) : (
              <div className="w-full">
                {/* List blocked IPs here when API returns data */}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-700 bg-gray-800/80">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Security Diagnostics
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Content Security Policy', active: config.SECURITY_ENABLED },
                { label: 'HSTS', active: config.SECURITY_ENABLED },
                { label: 'X-Content-Type-Options', active: config.SECURITY_ENABLED },
                { label: 'Referrer Policy', active: config.SECURITY_ENABLED },
                { label: 'Secure Cookies', active: true },
                { label: 'HttpOnly Cookies', active: true }
              ].map(header => (
                <div key={header.label} className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                  <span className="text-sm text-gray-300">{header.label}</span>
                  {header.active ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
