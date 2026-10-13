import React, { useState, useEffect } from 'react';
import { BuildingCard } from '../components/directory/BuildingCard';
import { CampusMapSchematic } from '../components/directory/CampusMapSchematic';
import { Building } from '../types/campus';
import { campusService } from '../services/firebase/campusService';
import { Compass, Search } from 'lucide-react';

export const ExploreCampusPage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'loyalty' | 'wisdom' | 'honesty' | 'truth'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'grid' | 'schematic'>('grid');

  useEffect(() => {
    campusService.getBuildings().then(setBuildings);
  }, []);

  const filteredBuildings = buildings.filter((b) => {
    if (filterType === 'loyalty' && !b.id.includes('loyalty')) return false;
    if (filterType === 'wisdom' && b.id !== 'bld-wisdom') return false;
    if (filterType === 'honesty' && b.id !== 'bld-honesty') return false;
    if (filterType === 'truth' && b.id !== 'bld-truth') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = b.name.toLowerCase().includes(term);
      const matchBranch = b.knownBranches.some((br) => br.toLowerCase().includes(term));
      const matchFac = b.knownFacilities.some((fac) => fac.toLowerCase().includes(term));
      return matchName || matchBranch || matchFac;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#E67E6A] uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Campus Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black">Explore VVIT Campus</h1>
        <p className="text-sm text-neutral-600 mt-2 max-w-2xl font-medium">
          Discover all academic blocks, central administration, libraries, departments, and computer labs across the university.
        </p>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search inside explore */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-black absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter blocks or branches..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-100 rounded-xl border border-neutral-300 text-xs text-black focus:outline-none focus:border-[#E67E6A] font-semibold"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-[#E67E6A] text-white shadow-xs'
                : 'bg-neutral-100 text-black hover:bg-neutral-200'
            }`}
          >
            All Blocks ({buildings.length})
          </button>
          <button
            onClick={() => setFilterType('loyalty')}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'loyalty'
                ? 'bg-[#E67E6A] text-white shadow-xs'
                : 'bg-neutral-100 text-black hover:bg-neutral-200'
            }`}
          >
            Loyalty Blocks (1-4)
          </button>
          <button
            onClick={() => setFilterType('wisdom')}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'wisdom'
                ? 'bg-[#E67E6A] text-white shadow-xs'
                : 'bg-neutral-100 text-black hover:bg-neutral-200'
            }`}
          >
            Wisdom Block
          </button>
          <button
            onClick={() => setFilterType('honesty')}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'honesty'
                ? 'bg-[#E67E6A] text-white shadow-xs'
                : 'bg-neutral-100 text-black hover:bg-neutral-200'
            }`}
          >
            Honesty Block
          </button>
          <button
            onClick={() => setFilterType('truth')}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'truth'
                ? 'bg-[#E67E6A] text-white shadow-xs'
                : 'bg-neutral-100 text-black hover:bg-neutral-200'
            }`}
          >
            Truth Block
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl self-end md:self-auto border border-neutral-300">
          <button
            onClick={() => setActiveTab('grid')}
            type="button"
            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
              activeTab === 'grid' ? 'bg-black text-white shadow-xs' : 'text-neutral-600'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setActiveTab('schematic')}
            type="button"
            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
              activeTab === 'schematic' ? 'bg-black text-white shadow-xs' : 'text-neutral-600'
            }`}
          >
            Schematic Layout
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((b) => (
            <BuildingCard key={b.id} building={b} />
          ))}
        </div>
      ) : (
        <CampusMapSchematic buildings={buildings} />
      )}
    </div>
  );
};
