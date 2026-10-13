import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { Facility, Building, FacilityCategory, VerificationStatus } from '../types/campus';
import { campusService } from '../services/firebase/campusService';
import { searchCampus } from '../services/search/searchEngine';
import { SearchResultCard } from '../components/search/SearchResultCard';
import { SearchBar } from '../components/search/SearchBar';
import { ReportCorrectionModal } from '../components/feedback/ReportCorrectionModal';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory | 'all'>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'all'>('all');
  const [reportingFacility, setReportingFacility] = useState<Facility | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [facs, blds] = await Promise.all([
        campusService.getFacilities(),
        campusService.getBuildings(),
      ]);
      setFacilities(facs);
      setBuildings(blds);
    };
    load();
  }, []);

  const searchResults = searchCampus(facilities, buildings, {
    query: queryParam,
    category: selectedCategory,
    buildingId: selectedBuilding,
    verificationStatus: selectedStatus,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Global Campus Search
        </h1>
        <div className="max-w-3xl">
          <SearchBar
            initialQuery={queryParam}
            onSearch={(newQ) => setSearchParams({ q: newQ })}
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filters:</span>
        </div>

        {/* Building Filter */}
        <select
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">All Buildings</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as FacilityCategory | 'all')}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">All Categories</option>
          <option value="academic">Academic Branches</option>
          <option value="laboratory">Laboratories</option>
          <option value="administrative">Administrative Offices</option>
          <option value="seminar_hall">Seminar Halls</option>
          <option value="library">Library</option>
          <option value="medical">Medical / Health</option>
          <option value="dining">Dining & Mess</option>
          <option value="event_space">Event Venues & OAT</option>
          <option value="utility">Washrooms & Water</option>
          <option value="transport">Parking</option>
          <option value="sports">Sports</option>
          <option value="hostel">Hostels</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as VerificationStatus | 'all')}
          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="all">All Verification Statuses</option>
          <option value="pending">Pending Verification</option>
          <option value="verified">Officially Verified</option>
          <option value="needs_correction">Needs Correction</option>
        </select>

        {(selectedBuilding !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSelectedBuilding('all');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{searchResults.length}</strong> verified database results
          {queryParam && ` for "${queryParam}"`}
        </span>
      </div>

      {/* Results Grid */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((result) => (
            <SearchResultCard
              key={result.facility.id}
              facility={result.facility}
              matchedField={result.matchedField}
              matchedSnippet={result.matchedSnippet}
              onReportCorrection={(f) => {
                setReportingFacility(f);
                setIsReportOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-lg text-slate-800">No Matching Facilities Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn't find records matching "{queryParam}". Try searching by department abbreviation (e.g., CSE, AIDS, EEE) or facility name.
          </p>
        </div>
      )}

      <ReportCorrectionModal
        isOpen={isReportOpen}
        onClose={() => {
          setIsReportOpen(false);
          setReportingFacility(null);
        }}
        targetFacility={reportingFacility}
      />
    </div>
  );
};
