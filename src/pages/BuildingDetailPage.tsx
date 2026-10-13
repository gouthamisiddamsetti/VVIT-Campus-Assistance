import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Layers,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Building, Facility, Floor } from '../types/campus';
import { campusService } from '../services/firebase/campusService';
import { VerificationBadge } from '../components/layout/VerificationBanner';
import { SearchResultCard } from '../components/search/SearchResultCard';
import { ReportCorrectionModal } from '../components/feedback/ReportCorrectionModal';

export const BuildingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportingFacility, setReportingFacility] = useState<Facility | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const [bld, allFacs, bldFloors] = await Promise.all([
        campusService.getBuildingById(id),
        campusService.getFacilities(),
        campusService.getFloors(id),
      ]);
      setBuilding(bld);
      setFacilities(allFacs.filter((f) => f.buildingId === id));
      setFloors(bldFloors);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-500 font-bold">
        Loading building details...
      </div>
    );
  }

  if (!building) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-extrabold text-black">Building Not Found</h2>
        <p className="text-xs text-neutral-500">The requested building could not be located in the directory.</p>
        <Link to="/explore" className="inline-block px-4 py-2 bg-[#E67E6A] text-white rounded-xl text-xs font-bold">
          Return to Explore Campus
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 font-semibold">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#E67E6A]" />
        <Link to="/explore" className="hover:text-black transition-colors">
          Explore Campus
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#E67E6A]" />
        <span className="text-black font-extrabold">{building.name}</span>
      </nav>

      {/* Building Header Card */}
      <div className="bg-white rounded-3xl border-2 border-black shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black text-[#E67E6A] border-2 border-[#E67E6A] flex items-center justify-center font-mono font-extrabold text-lg shadow-md">
              {building.shortCode}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
                  {building.name}
                </h1>
                <VerificationBadge status={building.verificationStatus} />
              </div>
              <p className="text-xs text-neutral-600 font-medium mt-1">
                Also known as: {building.aliases.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-800 leading-relaxed max-w-4xl font-medium">
          {building.description}
        </p>

        {/* Known Branches */}
        {building.knownBranches.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold text-black uppercase tracking-wider mb-2">
              Associated Academic Branches
            </h3>
            <div className="flex flex-wrap gap-2">
              {building.knownBranches.map((br) => (
                <span
                  key={br}
                  className="bg-[#E67E6A]/15 text-black border border-[#E67E6A]/50 font-bold px-3 py-1 rounded-xl text-xs"
                >
                  {br}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Floor Information Box */}
        <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-black">
            <Layers className="w-4 h-4 text-[#E67E6A]" />
            <span>Floor & Spatial Layout Overview</span>
          </div>
          <p className="text-xs text-neutral-700 leading-relaxed font-medium">
            {building.floorsSummary}
          </p>

          {floors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {floors.map((flr) => (
                <div key={flr.id} className="bg-white p-3 rounded-xl border border-neutral-300">
                  <div className="font-extrabold text-black">{flr.floorLabel}</div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">{flr.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Disclaimer Notice */}
        <div className="bg-black text-white border-2 border-[#E67E6A] rounded-2xl p-4 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#E67E6A] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-[#E67E6A]">Data Integrity Policy:</strong> Room numbers and internal corridor paths for {building.name} remain pending independent verification by authorized campus administrators. Sample room numbers are never fabricated.
          </span>
        </div>
      </div>

      {/* Facilities Located in this Building */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-black">
            Departments, Labs & Facilities in {building.name} ({facilities.length})
          </h2>
        </div>

        {facilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <SearchResultCard
                key={fac.id}
                facility={fac}
                onReportCorrection={(f) => {
                  setReportingFacility(f);
                  setIsReportModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center text-xs text-neutral-500 font-medium">
            No specific sub-facilities registered for this building yet.
          </div>
        )}
      </div>

      {/* Suggest Correction Modal */}
      <ReportCorrectionModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportingFacility(null);
        }}
        targetFacility={reportingFacility}
      />
    </div>
  );
};
