import React from 'react';
import { Link } from 'react-router-dom';
import { Facility } from '../../types/campus';
import { VerificationBadge } from '../layout/VerificationBanner';
import {
  Building2,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  FileEdit,
  Compass
} from 'lucide-react';

interface SearchResultCardProps {
  facility: Facility;
  matchedField?: string;
  matchedSnippet?: string;
  onReportCorrection?: (facility: Facility) => void;
  onShowSchematicMap?: (facility: Facility) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  facility,
  matchedField,
  matchedSnippet,
  onReportCorrection,
  onShowSchematicMap,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-300 shadow-sm hover:shadow-lg hover:border-[#E67E6A] transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black bg-black text-white">
              {facility.category.replace('_', ' ')}
            </span>
            <VerificationBadge status={facility.verificationStatus} size="sm" />
          </div>

          {matchedField && (
            <span className="text-[10px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-mono">
              Matched {matchedField}
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/facility/${facility.id}`}>
          <h3 className="text-lg font-extrabold text-black group-hover:text-[#E67E6A] transition-colors mb-2">
            {facility.canonicalName}
          </h3>
        </Link>

        {/* Location Details */}
        <div className="space-y-2 text-xs text-neutral-800 mb-4">
          <div className="flex items-center gap-2 font-bold text-black">
            <Building2 className="w-4 h-4 text-[#E67E6A] shrink-0" />
            <span>{facility.buildingName || 'Shared Campus Location'}</span>
          </div>

          {/* Floor & Room Info */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              <span>
                Floor:{' '}
                {facility.floorLabel ? (
                  <strong className="text-black font-bold">{facility.floorLabel}</strong>
                ) : (
                  <span className="text-[#E67E6A] font-medium italic">Unconfirmed</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span>
                Room:{' '}
                {facility.roomNumber ? (
                  <strong className="text-black font-bold">{facility.roomNumber}</strong>
                ) : (
                  <span className="text-[#E67E6A] font-medium italic">Unconfirmed</span>
                )}
              </span>
            </div>
          </div>

          {/* Landmarks */}
          {facility.nearbyLandmarks.length > 0 && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E67E6A] shrink-0 mt-0.5" />
              <span className="text-neutral-700">
                Near: <span className="text-black font-semibold">{facility.nearbyLandmarks.join(', ')}</span>
              </span>
            </div>
          )}

          {/* Opening hours if reported */}
          {facility.openingHours && (
            <div className="flex items-center gap-1.5 text-black bg-[#E67E6A]/15 px-2.5 py-1 rounded-md border border-[#E67E6A]/30">
              <Clock className="w-3.5 h-3.5 text-[#E67E6A] shrink-0" />
              <span className="font-bold">Reported Timings: {facility.openingHours}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-600 leading-relaxed mb-4 line-clamp-2">
          {facility.locationDescription}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2 mt-auto">
        <Link
          to={`/facility/${facility.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-black hover:text-[#E67E6A] transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E67E6A]" />
        </Link>

        <div className="flex items-center gap-2">
          {onShowSchematicMap && (
            <button
              type="button"
              onClick={() => onShowSchematicMap(facility)}
              className="text-[11px] flex items-center gap-1 text-black hover:text-[#E67E6A] px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors font-medium"
              title="View illustrative campus block layout"
            >
              <Compass className="w-3 h-3 text-[#E67E6A]" />
              <span>Block Layout</span>
            </button>
          )}

          {onReportCorrection && (
            <button
              type="button"
              onClick={() => onReportCorrection(facility)}
              className="text-[11px] flex items-center gap-1 text-neutral-800 hover:text-black px-2 py-1 rounded-lg bg-[#E67E6A]/20 hover:bg-[#E67E6A]/30 border border-[#E67E6A]/50 transition-colors font-semibold"
              title="Report an unconfirmed or incorrect location detail"
            >
              <FileEdit className="w-3 h-3 text-[#E67E6A]" />
              <span>Suggest Correction</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
