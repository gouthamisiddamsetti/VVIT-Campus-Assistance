import React from 'react';
import { Link } from 'react-router-dom';
import { Building } from '../../types/campus';
import { VerificationBadge } from '../layout/VerificationBanner';
import { Building2, Layers, ArrowRight } from 'lucide-react';

interface BuildingCardProps {
  building: Building;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ building }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-300 shadow-sm hover:shadow-xl hover:border-[#E67E6A] transition-all p-6 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black text-[#E67E6A] border-2 border-[#E67E6A] flex items-center justify-center font-mono font-extrabold text-base shadow-sm">
              {building.shortCode}
            </div>
            <div>
              <Link to={`/building/${building.id}`}>
                <h3 className="font-extrabold text-lg text-black group-hover:text-[#E67E6A] transition-colors">
                  {building.name}
                </h3>
              </Link>
              <span className="text-xs text-neutral-500 font-medium">
                {building.aliases.slice(0, 2).join(' • ')}
              </span>
            </div>
          </div>
          <VerificationBadge status={building.verificationStatus} size="sm" />
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-700 mb-4 leading-relaxed line-clamp-2">
          {building.description}
        </p>

        {/* Branches */}
        {building.knownBranches.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-black uppercase tracking-wider block mb-1.5">
              Associated Branches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {building.knownBranches.map((branch) => (
                <span
                  key={branch}
                  className="text-[11px] font-semibold bg-[#E67E6A]/15 text-black border border-[#E67E6A]/40 px-2 py-0.5 rounded-md"
                >
                  {branch}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Known Facilities Preview */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-black uppercase tracking-wider block mb-1.5">
            Key Facilities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {building.knownFacilities.slice(0, 4).map((fac) => (
              <span
                key={fac}
                className="text-[11px] bg-neutral-100 text-black border border-neutral-200 px-2 py-0.5 rounded-md font-medium"
              >
                {fac}
              </span>
            ))}
            {building.knownFacilities.length > 4 && (
              <span className="text-[11px] text-neutral-500 px-1 py-0.5 font-medium">
                +{building.knownFacilities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Floor Information */}
        <div className="flex items-center gap-2 text-xs text-neutral-800 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 mb-4">
          <Layers className="w-3.5 h-3.5 text-[#E67E6A] shrink-0" />
          <span className="line-clamp-1 font-medium">{building.floorsSummary}</span>
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">
          Source: {building.source === 'project_owner' ? 'Owner records' : 'Official'}
        </span>
        <Link
          to={`/building/${building.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-black hover:text-[#E67E6A] group-hover:translate-x-0.5 transition-all"
        >
          <span>Explore Block</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E67E6A]" />
        </Link>
      </div>
    </div>
  );
};
