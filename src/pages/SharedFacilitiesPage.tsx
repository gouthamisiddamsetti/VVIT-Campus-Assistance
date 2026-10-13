import React, { useState, useEffect } from 'react';
import { Layers, Utensils, Theater, Bus, Trophy, BedDouble, Droplets, Bath, AlertTriangle } from 'lucide-react';
import { Facility } from '../types/campus';
import { campusService } from '../services/firebase/campusService';
import { SearchResultCard } from '../components/search/SearchResultCard';
import { ReportCorrectionModal } from '../components/feedback/ReportCorrectionModal';

export const SharedFacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    campusService.getFacilities().then((facs) => {
      setFacilities(
        facs.filter((f) =>
          ['dining', 'event_space', 'utility', 'transport', 'sports', 'hostel'].includes(f.category)
        )
      );
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Shared Amenities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Shared Campus Facilities
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Essential university-wide infrastructure, dining halls, recreation, student residences, parking, and utility stations across VVITU.
        </p>
      </div>

      {/* Disambiguation Callout */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-5 flex items-start gap-3">
        <Theater className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong className="block font-bold mb-0.5">Important Campus Landmark Distinction:</strong>
          VVITU has two distinct event venues: the <strong>Outdoor OAT (Open Air Theatre)</strong> situated outdoors between Loyalty Blocks 2 and 3, and the <strong>Student Hub</strong> which is an enclosed amphitheater inside the entrance of Truth Block.
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac) => (
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
