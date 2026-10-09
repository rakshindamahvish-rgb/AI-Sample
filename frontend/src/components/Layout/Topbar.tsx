import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, RefreshCw, AlertCircle, CheckCircle2, Play, Activity } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export const Topbar: React.FC = () => {
  const location = useLocation();
  const { simulationResult, isSimulating, runCrisisSimulation, fetchInitialData } = useScenario();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Command Center Overview';
      case '/network': return '3-Echelon Supply Network Topology';
      case '/crisis-simulator': return 'Critical Disruption & Outage Simulator';
      case '/future-lab': return 'Future Lab — Candidate Strategy Simulator';
      case '/agents': return 'Agent Operations & Swarm Consensus Room';
      case '/recovery-plans': return 'Recovery Plan Execution & Modification';
      case '/benchmarks': return 'Methodology Benchmarks & LP Solvers';
      case '/data-explorer': return 'Data Explorer & Provenance Records';
      case '/decision-history': return 'Persistent Decision Ledger & Governance';
      case '/settings': return 'Global Assumptions & Engine Configuration';
      default: return 'Control Tower';
    }
  };

  const handleQuickResimulate = () => {
    runCrisisSimulation({
      name: 'Standard 7-Day Outage Scenario',
      critical_supplier_id: 1,
      shutdown_duration_days: 7,
      demand_multiplier: 1.0,
      alternate_supplier_capacity_multiplier: 1.0,
      transport_cost_multiplier: 1.0,
      starting_inventory_multiplier: 1.0,
      production_capacity_reduction: 0.0
    });
  };

  return (
    <header className="bg-dark-850/90 backdrop-blur-md border-b border-dark-600/40 sticky top-0 z-20 px-6 py-2.5">
      {/* Synthetic Demonstration Notice Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-dark-600/20 text-[11px]">
        <div className="flex items-center space-x-2 text-nexus-cyan">
          <Shield className="w-3.5 h-3.5 text-nexus-cyan animate-pulse" />
          <span className="font-mono font-bold tracking-wide uppercase">
            DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA
          </span>
          <span className="text-gray-400 hidden md:inline">| Modeled 3-Echelon Network (INR ₹)</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-nexus-emerald inline-block animate-pulse" />
            <span className="font-mono text-[11px] text-gray-300">API: Connected (Local Offline Engine)</span>
          </div>
        </div>
      </div>

      {/* Main Topbar Row */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <span>{getPageTitle(location.pathname)}</span>
          </h1>
          <p className="text-[11px] text-gray-400">
            {simulationResult ? `Scenario: ${simulationResult.scenario.name}` : 'Initializing supply chain model...'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {simulationResult && (
            <div className="hidden sm:flex items-center space-x-2 bg-dark-750/80 px-3 py-1.5 rounded-lg border border-dark-600/50">
              <Activity className="w-3.5 h-3.5 text-nexus-cyan" />
              <div className="text-[11px]">
                <span className="text-gray-400">Fill Rate: </span>
                <span className="font-mono font-bold text-white">
                  {simulationResult.plans.find(p => p.is_recommended)?.fill_rate || 95.2}%
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleQuickResimulate}
            disabled={isSimulating}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-nexus-cyan to-nexus-blue text-black font-semibold text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-glow-cyan"
            title="Rerun default 7-day crisis simulation"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Rerun Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
