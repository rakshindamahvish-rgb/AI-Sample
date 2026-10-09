import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  TrendingUp,
  Package,
  Activity,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Bot,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useScenario } from '../context/ScenarioContext';
import { NetworkGraph } from '../components/NetworkGraph/NetworkGraph';

export const OverviewPage: React.FC = () => {
  const { simulationResult, network, decisions, setSelectedPlanId } = useScenario();

  if (!simulationResult) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-nexus-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-gray-400">Loading Command Center data...</p>
        </div>
      </div>
    );
  }

  const recPlan = simulationResult.plans.find(p => p.is_recommended) || simulationResult.plans[0];
  const activeDisruption = simulationResult.active_disruption;

  // Compute summary stats
  const totalDemand = recPlan.daily_timeline.reduce((sum, d) => sum + d.demand, 0);
  const demandAtRisk = activeDisruption.is_active ? totalDemand * 0.72 : 0;
  const currentFillRate = recPlan.fill_rate;
  const backorders = recPlan.backorders;
  const totalCost = recPlan.total_cost;
  const currentInventory = recPlan.ending_inventory;

  // Chart timeline data from recommended plan
  const chartData = recPlan.daily_timeline.map(d => ({
    name: `Day ${d.day}`,
    Demand: d.demand,
    Fulfilled: d.units_fulfilled,
    Backorders: d.backorders,
    Inventory: d.ending_inventory,
    Cost: d.cumulative_cost
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP DISRUPTION ALERT BANNER */}
      {activeDisruption.is_active && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/60 via-dark-800 to-dark-850 border border-red-500/40 shadow-glow-red flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/30 text-red-300 font-bold uppercase">
                  CRITICAL OUTAGE DETECTED
                </span>
                <span className="text-xs text-gray-400">• Apex Semiconductors (SUP-01)</span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                7-Day Shutdown of Primary Microcontroller Supplier (MCU-X)
              </h2>
              <p className="text-xs text-gray-300 mt-0.5 max-w-2xl">
                Impacts 3 of 4 product lines (PRD-01, PRD-02, PRD-03). Buffer stock will deplete by Day 3 without proactive alternate sourcing.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-center">
            <Link
              to="/crisis-simulator"
              className="px-3.5 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <span>Configure Crisis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/future-lab"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-nexus-cyan to-nexus-blue text-black text-xs font-bold shadow-glow-cyan flex items-center space-x-1.5 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Simulate Recovery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-600/50 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Demand at Risk</span>
            <AlertTriangle className="w-4 h-4 text-nexus-amber" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-white">{demandAtRisk.toFixed(0)} <span className="text-xs text-gray-400 font-sans">units</span></div>
            <p className="text-[10px] text-nexus-amber mt-0.5">72% of total 7-day demand</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-600/50 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Customer Fill Rate</span>
            <Activity className="w-4 h-4 text-nexus-emerald" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-nexus-emerald">{currentFillRate.toFixed(1)}%</div>
            <p className="text-[10px] text-gray-400 mt-0.5">Corporate Target: 95.0%</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-600/50 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Ending Backorders</span>
            <TrendingUp className="w-4 h-4 text-nexus-rose" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-white">{backorders.toFixed(0)} <span className="text-xs text-gray-400 font-sans">units</span></div>
            <p className="text-[10px] text-nexus-emerald mt-0.5">Recovered to 0 by Day 6</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-600/50 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Ending Inventory</span>
            <Package className="w-4 h-4 text-nexus-cyan" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-nexus-cyan">{currentInventory.toFixed(0)} <span className="text-xs text-gray-400 font-sans">units</span></div>
            <p className="text-[10px] text-gray-400 mt-0.5">3.4 Days of Forward Supply</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-600/50 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Total Landed Cost</span>
            <DollarSign className="w-4 h-4 text-nexus-violet" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-nexus-purple">₹{(totalCost / 1000).toFixed(1)}k</div>
            <p className="text-[10px] text-gray-400 mt-0.5">Includes expediting & overtime</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-600/50 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Decision Status</span>
            <ShieldCheck className="w-4 h-4 text-nexus-emerald" />
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-nexus-emerald flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{recPlan.is_approved ? 'APPROVED' : 'Awaiting Review'}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{recPlan.name.slice(0, 20)}</p>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Demand & Fulfillment Trajectory */}
        <div className="p-5 rounded-xl bg-dark-850 border border-dark-600/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Demand vs. Units Fulfilled</h3>
              <p className="text-xs text-gray-400">Comparing customer orders against actual warehouse dispatches</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-750 text-nexus-cyan border border-dark-600">
              7-Day Horizon
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFulfilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Demand" stroke="#3B82F6" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={2} />
                <Area type="monotone" dataKey="Fulfilled" stroke="#06B6D4" fillOpacity={1} fill="url(#colorFulfilled)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Buffer & Backorder Evolution */}
        <div className="p-5 rounded-xl bg-dark-850 border border-dark-600/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Inventory Balance & Backorder Trend</h3>
              <p className="text-xs text-gray-400">Tracking network warehouse stock vs unfulfilled backlog</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-750 text-nexus-violet border border-dark-600">
              Recovery by Day 6
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Inventory" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="On-Hand Inventory (Units)" />
                <Bar dataKey="Backorders" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Backorders (Units)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. RECOVERY STRATEGY COMPARISON PREVIEW */}
      <div className="p-5 rounded-xl bg-dark-850 border border-dark-600/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Candidate Recovery Strategies</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-nexus-violet/20 text-nexus-violet border border-nexus-violet/40">
                Future Lab Models
              </span>
            </h3>
            <p className="text-xs text-gray-400">Evaluated over the identical 7-day supplier outage horizon</p>
          </div>
          <Link
            to="/future-lab"
            className="text-xs text-nexus-cyan hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>Open Interactive Future Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {simulationResult.plans.slice(0, 4).map((plan) => {
            const isRec = plan.is_recommended;
            return (
              <div
                key={plan.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isRec
                    ? 'bg-nexus-cyan/10 border-nexus-cyan/50 shadow-glow-cyan ring-1 ring-nexus-cyan/30'
                    : 'bg-dark-800/80 border-dark-600/60 hover:border-dark-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-700 text-gray-300 font-semibold uppercase">
                    {plan.plan_type.replace('_', ' ')}
                  </span>
                  {isRec && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-nexus-cyan text-black font-bold uppercase">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mt-2">{plan.name}</h4>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{plan.description}</p>

                <div className="mt-3 pt-3 border-t border-dark-600/40 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Cost:</span>
                    <span className="font-mono font-bold text-white">₹{plan.total_cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fill Rate:</span>
                    <span className={`font-mono font-bold ${plan.fill_rate >= 90 ? 'text-nexus-emerald' : 'text-nexus-rose'}`}>
                      {plan.fill_rate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recovery Time:</span>
                    <span className="font-mono text-gray-300">{plan.recovery_time_days} days</span>
                  </div>
                </div>

                <Link
                  to="/future-lab"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className="mt-3 w-full block text-center py-1.5 rounded-lg bg-dark-750 hover:bg-dark-700 text-[11px] font-semibold text-gray-200 border border-dark-600/60 transition-all"
                >
                  Inspect Plan Timeline →
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TOPOLOGY MINI PREVIEW */}
      <NetworkGraph network={network} disruptedSupplierId={activeDisruption.disrupted_supplier_id} />
    </div>
  );
};
