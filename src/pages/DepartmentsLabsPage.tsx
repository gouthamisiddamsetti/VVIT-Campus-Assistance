import React, { useState, useEffect } from 'react';
import { Cpu, FlaskConical, Search, BookOpen, Layers } from 'lucide-react';
import { Facility, Building } from '../types/campus';
import { campusService } from '../services/firebase/campusService';
import { SearchResultCard } from '../components/search/SearchResultCard';
import { ReportCorrectionModal } from '../components/feedback/ReportCorrectionModal';

export const DepartmentsLabsPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'academic' | 'laboratory'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    campusService.getFacilities().then((facs) => {
      setFacilities(facs.filter((f) => f.category === 'academic' || f.category === 'laboratory'));
    });
  }, []);

  const filtered = facilities.filter((f) => {
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = f.canonicalName.toLowerCase().includes(q);
      const matchAliases = f.aliases.some((a) => a.toLowerCase().includes(q));
      const matchBld = (f.buildingName || '').toLowerCase().includes(q);
      return matchName || matchAliases || matchBld;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4" />
          <span>Academic Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Departments & Laboratories
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Browse all engineering branches, sciences, specialized workshops, and associated computing laboratories at VVITU.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CSE, AIDS, Physics lab, EEE..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Academic & Labs ({facilities.length})
          </button>
          <button
            onClick={() => setCategoryFilter('academic')}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === 'academic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Engineering Branches
          </button>
          <button
            onClick={() => setCategoryFilter('laboratory')}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === 'laboratory'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Laboratories
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((fac) => (
          <SearchResultCard
            key={fac.id}
            facility={fac}
            onReportCorrection={(f) => {
              setSelectedFacility(f);
              setIsReportOpen(true);
            }}
          />
        ))}
      </div>

      <ReportCorrectionModal
        isOpen={isReportOpen}
        onClose={() => {
          setIsReportOpen(false);
          setSelectedFacility(null);
        }}
        targetFacility={selectedFacility}
      />
    </div>
  );
};
