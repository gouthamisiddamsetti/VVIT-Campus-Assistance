import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Layers,
  MapPin,
  Clock,
  ChevronRight,
  FileEdit,
  AlertTriangle
} from 'lucide-react';
import { Facility, Building } from '../types/campus';
import { campusService } from '../services/firebase/campusService';
import { VerificationBadge } from '../components/layout/VerificationBanner';
import { ReportCorrectionModal } from '../components/feedback/ReportCorrectionModal';

export const FacilityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const fac = await campusService.getFacilityById(id);
      setFacility(fac);
      if (fac?.buildingId) {
        const bld = await campusService.getBuildingById(fac.buildingId);
        setBuilding(bld);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-neutral-500 font-bold">
        Loading facility details...
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-extrabold text-black">Facility Not Found</h2>
        <p className="text-xs text-neutral-500 font-medium">This facility is not registered in the directory.</p>
        <Link to="/explore" className="inline-block px-4 py-2 bg-[#E67E6A] text-white rounded-xl text-xs font-bold">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 font-semibold">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#E67E6A]" />
        {building ? (
          <>
            <Link to={`/building/${building.id}`} className="hover:text-black transition-colors">
              {building.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#E67E6A]" />
          </>
        ) : (
          <>
            <Link to="/facilities" className="hover:text-black transition-colors">
              Shared Facilities
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#E67E6A]" />
          </>
        )}
        <span className="text-black font-extrabold truncate">{facility.canonicalName}</span>
      </nav>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border-2 border-black shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-black px-2.5 py-0.5 rounded-full border border-black">
                {facility.category.replace('_', ' ')}
              </span>
              <VerificationBadge status={facility.verificationStatus} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
              {facility.canonicalName}
            </h1>
            {facility.aliases.length > 0 && (
              <p className="text-xs text-neutral-600 mt-1 font-medium">
                Aliases: {facility.aliases.join(' • ')}
              </p>
            )}
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            type="button"
            className="self-start px-3.5 py-2 rounded-xl bg-black text-[#E67E6A] hover:bg-neutral-900 border-2 border-[#E67E6A] text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <FileEdit className="w-3.5 h-3.5 text-[#E67E6A]" />
            <span>Suggest Correction</span>
          </button>
        </div>

        {/* Location Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Building */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-300 space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
              Building Block
            </span>
            <div className="flex items-center gap-2 text-sm font-extrabold text-black">
              <Building2 className="w-4 h-4 text-[#E67E6A]" />
              {building ? (
                <Link to={`/building/${building.id}`} className="hover:text-[#E67E6A] underline">
                  {building.name}
                </Link>
              ) : (
                <span>{facility.buildingName || 'Campus Grounds'}</span>
              )}
            </div>
          </div>

          {/* Floor */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-300 space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
              Floor Assignment
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-black">
              <Layers className="w-4 h-4 text-[#E67E6A]" />
              {facility.floorLabel ? (
                <span>{facility.floorLabel}</span>
              ) : (
                <span className="text-[#E67E6A] italic font-medium">Pending Verification</span>
              )}
            </div>
          </div>

          {/* Room Number */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-300 space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
              Room Number
            </span>
            <div className="text-sm font-bold text-black">
              {facility.roomNumber ? (
                <span>{facility.roomNumber}</span>
              ) : (
                <span className="text-[#E67E6A] italic font-medium">Unconfirmed (No sample numbers fabricated)</span>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-300 space-y-1">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
              Operating Timings
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-black">
              <Clock className="w-4 h-4 text-[#E67E6A]" />
              {facility.openingHours ? (
                <span className="text-black bg-[#E67E6A]/20 px-2 py-0.5 rounded font-extrabold">{facility.openingHours}</span>
              ) : (
                <span className="text-neutral-500 font-medium italic">Not officially published</span>
              )}
            </div>
          </div>
        </div>

        {/* Nearby Landmarks */}
        {facility.nearbyLandmarks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Nearby Landmarks & Relative Orientation
            </h3>
            <div className="flex flex-wrap gap-2">
              {facility.nearbyLandmarks.map((lm) => (
                <span
                  key={lm}
                  className="bg-black text-white font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-black shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E67E6A]" />
                  <span>{lm}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">
            Verified Description
          </h3>
          <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-200 font-medium">
            {facility.locationDescription}
          </p>
        </div>

        {/* Explicit Unknown Items List */}
        {facility.unknownDetails.length > 0 && (
          <div className="bg-black text-white border-2 border-[#E67E6A] rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E67E6A]">
              <AlertTriangle className="w-4 h-4 text-[#E67E6A] shrink-0" />
              <span>Unconfirmed Campus Attributes Requiring Administrator Verification</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300 pl-1 font-medium">
              {facility.unknownDetails.map((unk, i) => (
                <li key={i}>{unk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Suggest Correction Modal */}
      <ReportCorrectionModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetFacility={facility}
      />
    </div>
  );
};
