import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  AlertTriangle,
  FlaskConical,
  Bot,
  ShieldCheck,
  BarChart3,
  Database,
  History,
  Settings,
  ChevronRight,
  Radio
} from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

const NAV_ITEMS = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Supply Network', path: '/network', icon: Network },
  { name: 'Crisis Simulator', path: '/crisis-simulator', icon: AlertTriangle, badge: 'Active' },
  { name: 'Future Lab', path: '/future-lab', icon: FlaskConical, highlight: true },
  { name: 'Agent Operations', path: '/agents', icon: Bot, count: '8' },
  { name: 'Recovery Plans', path: '/recovery-plans', icon: ShieldCheck },
  { name: 'Performance & Benchmarks', path: '/benchmarks', icon: BarChart3 },
  { name: 'Data Explorer', path: '/data-explorer', icon: Database },
  { name: 'Decision History', path: '/decision-history', icon: History },
  { name: 'Settings & Assumptions', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { simulationResult, decisions } = useScenario();
  const approvedCount = decisions.filter(d => d.decision_type === 'APPROVED').length;

  return (
    <aside className="w-64 bg-dark-850 border-r border-dark-600/40 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-dark-600/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center shadow-glow-cyan">
            <Radio className="w-5 h-5 text-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-wider text-white">NEXUS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-nexus-violet/20 text-nexus-violet border border-nexus-violet/40 font-semibold">AI CORE</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Resilience Engine</p>
          </div>
        </div>
      </div>

      {/* Disruption Alert Pill in Sidebar */}
      {simulationResult?.active_disruption?.is_active && (
        <div className="mx-3 my-3 p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <div className="truncate">
            <p className="font-semibold text-red-400">SUP-01 Outage Active</p>
            <p className="text-[10px] text-gray-400">{simulationResult.active_disruption.shutdown_days} Days Disruption</p>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-400 px-3 py-1.5">
          Control Tower Navigation
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-nexus-cyan/15 text-nexus-cyan border border-nexus-cyan/30 shadow-sm font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-dark-750/70 border border-transparent'
                } ${item.highlight ? 'ring-1 ring-nexus-violet/30' : ''}`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-nexus-violet' : ''}`} />
                <span>{item.name}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-nexus-amber/20 text-nexus-amber border border-nexus-amber/40">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-nexus-violet/20 text-nexus-violet border border-nexus-violet/30">
                    {item.count}
                  </span>
                )}
                {item.highlight && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-nexus-violet/30 text-nexus-purple font-bold">
                    CORE
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-dark-600/40 bg-dark-900/60">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>Decisions Logged:</span>
          <span className="font-mono text-nexus-emerald font-semibold">{approvedCount} Approved</span>
        </div>
        <div className="mt-1.5 text-[10px] text-gray-400 flex items-center justify-between">
          <span>Currency:</span>
          <span className="font-mono text-gray-300">INR (₹)</span>
        </div>
      </div>
    </aside>
  );
};
