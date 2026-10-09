import React, { useState } from 'react';
import { NetworkOverview, Supplier, Facility, DistributionCenter, Product } from '../../types';
import { AlertTriangle, CheckCircle, Clock, Factory, Building2, Truck, Cpu, Layers, X, ShieldAlert } from 'lucide-react';

interface NetworkGraphProps {
  network: NetworkOverview | null;
  disruptedSupplierId?: number;
  onSelectNode?: (node: any) => void;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ network, disruptedSupplierId = 1 }) => {
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'SUPPLIER' | 'FACILITY' | 'DC';
    data: any;
  } | null>(null);

  if (!network) {
    return (
      <div className="h-96 flex items-center justify-center border border-dark-600/40 rounded-xl bg-dark-800/50">
        <p className="text-sm font-mono text-gray-400">Loading supply network graph...</p>
      </div>
    );
  }

  const suppliers = network.suppliers;
  const facility = network.facilities[0];
  const dcs = network.distribution_centers;
  const products = network.products;

  return (
    <div className="relative bg-dark-850 rounded-xl border border-dark-600/50 overflow-hidden shadow-2xl">
      {/* Top Banner / Legend */}
      <div className="p-4 border-b border-dark-600/40 bg-dark-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-nexus-cyan" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">3-Echelon Topology Model</span>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-nexus-cyan" />
            <span className="text-gray-300">Operational</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-nexus-red animate-pulse" />
            <span className="text-gray-300">Critical Disrupted</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-nexus-violet" />
            <span className="text-gray-300">Alternate Supply</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-nexus-blue" />
            <span className="text-gray-300">Distribution Hub</span>
          </div>
        </div>
      </div>

      {/* Interactive Network Diagram Canvas */}
      <div className="p-6 min-h-[480px] flex flex-col md:flex-row items-stretch justify-between gap-8 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        
        {/* ECHELON 1: SUPPLIERS */}
        <div className="flex-1 flex flex-col justify-around space-y-4 z-10">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-nexus-cyan px-2 flex items-center space-x-1.5">
            <span>Echelon 1: Sourcing Nodes</span>
          </div>

          {suppliers.map((sup) => {
            const isDisrupted = sup.id === disruptedSupplierId;
            const isAlternate = sup.id === 2;
            return (
              <div
                key={sup.id}
                onClick={() => setSelectedEntity({ type: 'SUPPLIER', data: sup })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isDisrupted
                    ? 'bg-red-950/40 border-red-500/60 shadow-glow-red ring-1 ring-red-500/40'
                    : isAlternate
                    ? 'bg-violet-950/30 border-violet-500/40 hover:border-violet-400 hover:shadow-glow-violet'
                    : 'bg-dark-800/90 border-dark-600/70 hover:border-nexus-cyan/60 hover:shadow-glow-cyan'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${isDisrupted ? 'bg-red-500/20 text-red-400' : isAlternate ? 'bg-violet-500/20 text-violet-400' : 'bg-cyan-500/20 text-nexus-cyan'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-dark-700 text-gray-300 font-semibold">{sup.code}</span>
                      <h4 className="text-xs font-bold text-white truncate max-w-[140px] mt-0.5">{sup.name}</h4>
                    </div>
                  </div>
                  {isDisrupted && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold animate-pulse">
                      DISRUPTED
                    </span>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-dark-600/30 grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-gray-400 block">Component:</span>
                    <span className="font-medium text-gray-200 truncate block">{sup.component_type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Daily Cap:</span>
                    <span className="font-mono text-white font-semibold">{sup.capacity_daily} u/d</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ECHELON 2: MANUFACTURING FACILITY */}
        <div className="flex-1 flex flex-col justify-center space-y-4 z-10 max-w-xs">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-nexus-violet px-2 flex items-center space-x-1.5">
            <span>Echelon 2: Assembly Plant</span>
          </div>

          {facility && (
            <div
              onClick={() => setSelectedEntity({ type: 'FACILITY', data: facility })}
              className="p-4 rounded-xl bg-dark-800/90 border border-nexus-violet/40 hover:border-nexus-violet hover:shadow-glow-violet cursor-pointer transition-all duration-200 ring-1 ring-nexus-violet/20"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-nexus-violet/20 text-nexus-purple">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-dark-700 text-gray-300 font-semibold">{facility.code}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{facility.name}</h4>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-dark-600/40 space-y-2 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-gray-200 font-medium">{facility.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Base Capacity:</span>
                  <span className="font-mono text-white font-semibold">{facility.capacity_daily} units/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Overtime Max:</span>
                  <span className="font-mono text-nexus-cyan font-semibold">+{facility.overtime_max_daily} units/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">BOM Lines:</span>
                  <span className="font-mono text-nexus-violet font-semibold">4 Active Products</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ECHELON 3: DISTRIBUTION CENTERS */}
        <div className="flex-1 flex flex-col justify-around space-y-4 z-10">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-nexus-blue px-2 flex items-center space-x-1.5">
            <span>Echelon 3: Distribution Hubs</span>
          </div>

          {dcs.map((dc) => (
            <div
              key={dc.id}
              onClick={() => setSelectedEntity({ type: 'DC', data: dc })}
              className="p-3.5 rounded-xl bg-dark-800/90 border border-dark-600/70 hover:border-nexus-blue/60 hover:shadow-glow-blue cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-nexus-blue">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-dark-700 text-gray-300 font-semibold">{dc.code}</span>
                  <h4 className="text-xs font-bold text-white truncate max-w-[140px] mt-0.5">{dc.name}</h4>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-dark-600/30 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-gray-400 block">Location:</span>
                  <span className="font-medium text-gray-200 truncate block">{dc.location}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Max Storage:</span>
                  <span className="font-mono text-white font-semibold">{dc.capacity.toLocaleString()} units</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Details Slide-Over Drawer */}
      {selectedEntity && (
        <div className="absolute top-0 right-0 w-80 h-full bg-dark-850/95 border-l border-dark-600/60 backdrop-blur-md p-5 z-20 overflow-y-auto shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-dark-600/40">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-nexus-cyan">{selectedEntity.type} INSPECTION</span>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-dark-750"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-700 text-gray-300">{selectedEntity.data.code}</span>
              <h3 className="text-sm font-bold text-white mt-1">{selectedEntity.data.name}</h3>
              <p className="text-gray-400 text-[11px]">{selectedEntity.data.location}</p>
            </div>

            {selectedEntity.type === 'SUPPLIER' && (
              <div className="space-y-2.5 bg-dark-800/60 p-3 rounded-lg border border-dark-600/40">
                <div className="flex justify-between">
                  <span className="text-gray-400">Component:</span>
                  <span className="font-medium text-white">{selectedEntity.data.component_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Capacity:</span>
                  <span className="font-mono text-white">{selectedEntity.data.capacity_daily} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lead Time:</span>
                  <span className="font-mono text-white">{selectedEntity.data.lead_time_days} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Unit Cost:</span>
                  <span className="font-mono text-nexus-cyan font-bold">₹{selectedEntity.data.unit_cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reliability Index:</span>
                  <span className="font-mono text-nexus-emerald font-semibold">{(selectedEntity.data.reliability * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Critical Sourcing:</span>
                  <span className={`font-semibold ${selectedEntity.data.is_critical ? 'text-red-400' : 'text-gray-300'}`}>
                    {selectedEntity.data.is_critical ? 'YES (Single Source)' : 'Secondary Alternate'}
                  </span>
                </div>
              </div>
            )}

            {selectedEntity.type === 'FACILITY' && (
              <div className="space-y-2.5 bg-dark-800/60 p-3 rounded-lg border border-dark-600/40">
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Assembly Cap:</span>
                  <span className="font-mono text-white">{selectedEntity.data.capacity_daily} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Overtime:</span>
                  <span className="font-mono text-nexus-cyan">+{selectedEntity.data.overtime_max_daily} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Operating Cost:</span>
                  <span className="font-mono text-white">₹{selectedEntity.data.operating_cost_per_unit}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Holding Cost:</span>
                  <span className="font-mono text-white">₹{selectedEntity.data.holding_cost_per_unit_day}/unit/day</span>
                </div>
              </div>
            )}

            {selectedEntity.type === 'DC' && (
              <div className="space-y-2.5 bg-dark-800/60 p-3 rounded-lg border border-dark-600/40">
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage Capacity:</span>
                  <span className="font-mono text-white">{selectedEntity.data.capacity.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Holding Cost:</span>
                  <span className="font-mono text-white">₹{selectedEntity.data.holding_cost_per_unit_day}/unit/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coverage Zone:</span>
                  <span className="font-medium text-white">{selectedEntity.data.code === 'DC-01' ? 'Western / Northern' : 'Southern / Eastern'}</span>
                </div>
              </div>
            )}

            <div className="p-3 bg-dark-750/50 rounded-lg border border-dark-600/30 text-[11px] text-gray-300">
              <span className="font-semibold text-nexus-cyan block mb-1">Downstream Dependency Notice</span>
              Disruptions at this tier trigger ripple effects through downstream buffer depletion and shortage penalties.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
