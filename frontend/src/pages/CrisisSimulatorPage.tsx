import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScenario } from '../context/ScenarioContext';
import { AlertTriangle, Play, RotateCcw, Sliders, ShieldAlert, Cpu, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export const CrisisSimulatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { simulationResult, network, isSimulating, runCrisisSimulation } = useScenario();

  // Scenario form state
  const [criticalSupplierId, setCriticalSupplierId] = useState<number>(1);
  const [shutdownDays, setShutdownDays] = useState<number>(7);
  const [demandMultiplier, setDemandMultiplier] = useState<number>(1.0);
  const [altCapacityMult, setAltCapacityMult] = useState<number>(1.0);
  const [transportCostMult, setTransportCostMult] = useState<number>(1.0);
  const [startingInvMult, setStartingInvMult] = useState<number>(1.0);
  const [prodCapReduction, setProdCapReduction] = useState<number>(0.0);

  const [simStep, setSimStep] = useState<string>('');

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimStep('Validating physical network parameters...');
    setTimeout(() => setSimStep('Invoking 8 specialized AI agents & swarm consensus...'), 400);
    setTimeout(() => setSimStep('Simulating candidate multi-echelon recovery plans...'), 900);
    setTimeout(() => setSimStep('Executing SciPy HiGHS mathematical optimizer...'), 1400);
    setTimeout(() => setSimStep('Synthesizing dynamic counterfactual explanations...'), 1800);

    await runCrisisSimulation({
      name: `${shutdownDays}-Day Critical Outage (${demandMultiplier > 1 ? `+${((demandMultiplier-1)*100).toFixed(0)}% Demand` : 'Baseline Demand'})`,
      critical_supplier_id: criticalSupplierId,
      shutdown_duration_days: shutdownDays,
      demand_multiplier: demandMultiplier,
      alternate_supplier_capacity_multiplier: altCapacityMult,
      transport_cost_multiplier: transportCostMult,
      starting_inventory_multiplier: startingInvMult,
      production_capacity_reduction: prodCapReduction
    });

    setSimStep('');
  };

  const handleResetDefaults = () => {
    setCriticalSupplierId(1);
    setShutdownDays(7);
    setDemandMultiplier(1.0);
    setAltCapacityMult(1.0);
    setTransportCostMult(1.0);
    setStartingInvMult(1.0);
    setProdCapReduction(0.0);
  };

  const suppliers = network?.suppliers || [];
  const activeDisruption = simulationResult?.active_disruption;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-dark-600/40 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-nexus-red" />
            <span>Crisis Simulator Console</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure supply disruption parameters, stress-test demand volatility, and run multi-agent resilience simulations.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          disabled={isSimulating}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-xs font-semibold text-gray-300 border border-dark-600/60 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSimulate} className="p-6 rounded-xl bg-dark-850 border border-dark-600/50 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-dark-600/40 pb-3">
              <span className="text-xs font-mono font-bold uppercase text-nexus-cyan flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>Disruption & Stress-Test Controls</span>
              </span>
              <span className="text-[10px] text-gray-400">All changes trigger full discrete-time recalculation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Critical Supplier Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Target Disrupted Supplier
                </label>
                <select
                  value={criticalSupplierId}
                  onChange={(e) => setCriticalSupplierId(Number(e.target.value))}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-nexus-cyan font-medium"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code} — {s.component_type})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Apex Semiconductors supplies 100% of Microcontroller MCU-X.
                </span>
              </div>

              {/* Outage Duration Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Outage Duration</label>
                  <span className="text-xs font-mono font-bold text-nexus-red">{shutdownDays} Days</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={21}
                  step={1}
                  value={shutdownDays}
                  onChange={(e) => setShutdownDays(Number(e.target.value))}
                  className="w-full accent-nexus-red cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>1 Day</span>
                  <span className="text-nexus-red font-semibold">7 Days (Standard Crisis)</span>
                  <span>21 Days</span>
                </div>
              </div>

              {/* Demand Multiplier Slider & Quick Presets */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Customer Demand Multiplier</label>
                  <span className="text-xs font-mono font-bold text-nexus-cyan">{demandMultiplier.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.05}
                  value={demandMultiplier}
                  onChange={(e) => setDemandMultiplier(Number(e.target.value))}
                  className="w-full accent-nexus-cyan cursor-pointer"
                />
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setDemandMultiplier(1.0)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${demandMultiplier === 1.0 ? 'bg-nexus-cyan text-black font-bold' : 'bg-dark-750 text-gray-300 border-dark-600'}`}
                  >
                    1.0x (Baseline)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemandMultiplier(1.2)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${demandMultiplier === 1.2 ? 'bg-nexus-cyan text-black font-bold' : 'bg-dark-750 text-gray-300 border-dark-600'}`}
                  >
                    1.2x (+20% Surge)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemandMultiplier(1.4)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${demandMultiplier === 1.4 ? 'bg-nexus-cyan text-black font-bold' : 'bg-dark-750 text-gray-300 border-dark-600'}`}
                  >
                    1.4x (+40% Surge)
                  </button>
                </div>
              </div>

              {/* Alternate Supplier Capacity Multiplier */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Alternate Supplier (SUP-02) Capacity</label>
                  <span className="text-xs font-mono font-bold text-nexus-violet">{(altCapacityMult * 300).toFixed(0)} units/day ({(altCapacityMult * 100).toFixed(0)}%)</span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={1.5}
                  step={0.1}
                  value={altCapacityMult}
                  onChange={(e) => setAltCapacityMult(Number(e.target.value))}
                  className="w-full accent-nexus-violet cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>-70% Capacity</span>
                  <span>100% (300 u/d)</span>
                  <span>+50% Overdrive</span>
                </div>
              </div>

              {/* Freight Cost Multiplier */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Transportation & Expediting Surcharge</label>
                  <span className="text-xs font-mono font-bold text-nexus-amber">{transportCostMult.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={2.5}
                  step={0.1}
                  value={transportCostMult}
                  onChange={(e) => setTransportCostMult(Number(e.target.value))}
                  className="w-full accent-nexus-amber cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Standard</span>
                  <span>+25% Fuel Spike</span>
                  <span>+150% Emergency Charter</span>
                </div>
              </div>

              {/* Starting Buffer Inventory Multiplier */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">Initial On-Hand Inventory Level</label>
                  <span className="text-xs font-mono font-bold text-white">{(startingInvMult * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={1.6}
                  step={0.1}
                  value={startingInvMult}
                  onChange={(e) => setStartingInvMult(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>40% (Lean Buffer)</span>
                  <span>100% (Baseline)</span>
                  <span>160% (High Buffer)</span>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-dark-600/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-400">
                Simulation engine runs <span className="font-mono text-nexus-cyan">8 Agents + 4 Recovery Models + Exact SciPy LP</span> in parallel.
              </div>

              <button
                type="submit"
                disabled={isSimulating}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-nexus-red via-nexus-amber to-nexus-cyan text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-glow-cyan flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Executing Simulation Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" />
                    <span>SIMULATE SUPPLIER SHUTDOWN</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Progress State Display */}
          {isSimulating && (
            <div className="p-4 rounded-xl bg-dark-850 border border-nexus-cyan/40 shadow-glow-cyan space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-nexus-cyan">{simStep || 'Simulating...'}</span>
                <span className="text-[10px] font-mono text-gray-400">Real-time Calculation</span>
              </div>
              <div className="w-full bg-dark-700 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-nexus-cyan to-nexus-violet h-full animate-pulse w-3/4 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Disruption Impact Summary & Quick Actions */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-dark-850 border border-dark-600/50 space-y-4">
            <div className="flex items-center space-x-2 text-nexus-red">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Disruption Impact Model</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-950/30 rounded-lg border border-red-500/30 space-y-1">
                <span className="font-semibold text-red-300 block">Sourcing Bottleneck:</span>
                <p className="text-gray-300">
                  Apex Semiconductors shut down for <span className="font-mono font-bold text-red-400">{shutdownDays} days</span>. Total component supply deficit: <span className="font-mono font-bold text-white">{(shutdownDays * 500).toLocaleString()} MCU-X units</span>.
                </p>
              </div>

              <div className="p-3 bg-dark-800/60 rounded-lg border border-dark-600/40 space-y-1">
                <span className="font-semibold text-nexus-violet block">Affected Finished Products:</span>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5 font-mono text-[11px]">
                  <li>PRD-01: SmartSensor Hub (1x MCU-X)</li>
                  <li>PRD-02: Industrial IoT Gateway (2x MCU-X)</li>
                  <li>PRD-03: Telematics Fleet Tracker (1x MCU-X)</li>
                </ul>
              </div>

              <div className="p-3 bg-dark-800/60 rounded-lg border border-dark-600/40 space-y-1">
                <span className="font-semibold text-nexus-emerald block">Resilient / Immune Lines:</span>
                <p className="text-gray-300 text-[11px]">
                  PRD-04 (EcoPower Smart Monitor) does not require microcontrollers and continues at 100% factory capacity.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/future-lab')}
              className="w-full py-2.5 rounded-lg bg-dark-750 hover:bg-dark-700 text-xs font-bold text-nexus-cyan border border-nexus-cyan/40 hover:border-nexus-cyan transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Inspect Future Lab Recovery Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
