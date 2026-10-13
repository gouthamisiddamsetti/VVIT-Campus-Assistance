import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Compass, Utensils, Theater, Bus } from 'lucide-react';
import { Building, Facility } from '../../types/campus';

interface CampusMapSchematicProps {
  buildings: Building[];
  highlightFacility?: Facility | null;
}

export const CampusMapSchematic: React.FC<CampusMapSchematicProps> = ({
  buildings,
  highlightFacility,
}) => {
  const navigate = useNavigate();
  const [selectedItem] = useState<string | null>(
    highlightFacility?.buildingId || null
  );

  return (
    <div className="bg-white rounded-3xl border-2 border-black shadow-sm p-6 sm:p-8 overflow-hidden">
      {/* Schematic Header and Disclaimer Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#E67E6A]" />
            <h2 className="text-lg font-extrabold text-black">
              Campus Block Spatial Schematic
            </h2>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Visual relative layout of VVIT blocks and shared facilities.
          </p>
        </div>

        {/* Mandatory Prompt Disclaimer */}
        <div className="inline-flex items-center gap-2 bg-black text-[#E67E6A] border border-[#E67E6A] px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-[#E67E6A] shrink-0" />
          <span>ILLUSTRATIVE SCHEMATIC ONLY — NOT GEOGRAPHICALLY ACCURATE</span>
        </div>
      </div>

      {/* Schematic Canvas */}
      <div className="my-8 relative bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-300 p-6 sm:p-8 min-h-[460px] flex flex-col justify-between">
        {/* Top Row: Loyalty Blocks 1 to 4 */}
        <div>
          <div className="text-[11px] font-extrabold text-black uppercase tracking-wider mb-3">
            Northern Sector — Loyalty Blocks & Shared Core
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Loyalty Block 1 */}
            <button
              type="button"
              onClick={() => navigate('/building/bld-loyalty-1')}
              className={`p-4 rounded-xl border-2 text-left transition-all group ${
                selectedItem === 'bld-loyalty-1'
                  ? 'bg-black text-white border-[#E67E6A] shadow-md'
                  : 'bg-white hover:bg-[#E67E6A]/10 border-black text-black'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm">Loyalty Block 1</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-white font-bold">
                  LB1
                </span>
              </div>
              <p className="text-[11px] opacity-80">CSM Branch • Physics & Chem Labs</p>
            </button>

            {/* Loyalty Block 2 */}
            <button
              type="button"
              onClick={() => navigate('/building/bld-loyalty-2')}
              className={`p-4 rounded-xl border-2 text-left transition-all group ${
                selectedItem === 'bld-loyalty-2'
                  ? 'bg-black text-white border-[#E67E6A] shadow-md'
                  : 'bg-white hover:bg-[#E67E6A]/10 border-black text-black'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm">Loyalty Block 2</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-white font-bold">
                  LB2
                </span>
              </div>
              <p className="text-[11px] opacity-80">CIV & AIDS • Exam Cell</p>
            </button>

            {/* Loyalty Block 3 */}
            <button
              type="button"
              onClick={() => navigate('/building/bld-loyalty-3')}
              className={`p-4 rounded-xl border-2 text-left transition-all group ${
                selectedItem === 'bld-loyalty-3'
                  ? 'bg-black text-white border-[#E67E6A] shadow-md'
                  : 'bg-white hover:bg-[#E67E6A]/10 border-black text-black'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm">Loyalty Block 3</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-white font-bold">
                  LB3
                </span>
              </div>
              <p className="text-[11px] opacity-80">EEE Branch & Labs • Store Room</p>
            </button>

            {/* Loyalty Block 4 */}
            <button
              type="button"
              onClick={() => navigate('/building/bld-loyalty-4')}
              className={`p-4 rounded-xl border-2 text-left transition-all group ${
                selectedItem === 'bld-loyalty-4'
                  ? 'bg-black text-white border-[#E67E6A] shadow-md'
                  : 'bg-white hover:bg-[#E67E6A]/10 border-black text-black'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm">Loyalty Block 4</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-white font-bold">
                  LB4
                </span>
              </div>
              <p className="text-[11px] opacity-80">MECH & CAI • Medical Room (GF)</p>
            </button>
          </div>

          {/* Core Mid-Zone: Mess & Outdoor OAT */}
          <div className="my-4 p-3 bg-black text-white rounded-xl border border-[#E67E6A] flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
            <span className="text-[#E67E6A] font-bold">Midway between Loyalty Blocks 2 & 3:</span>
            <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700">
              <Utensils className="w-3.5 h-3.5 text-[#E67E6A]" />
              <span>Campus Mess (Reported: 12:00 PM – 1:30 PM)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700">
              <Theater className="w-3.5 h-3.5 text-[#E67E6A]" />
              <span>Outdoor OAT (Open Air Theatre)</span>
            </div>
          </div>
        </div>

        {/* Middle Row: Central Administrative & Senior Academic Blocks */}
        <div className="my-4">
          <div className="text-[11px] font-extrabold text-black uppercase tracking-wider mb-3">
            Central & Academic Hub
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wisdom Block */}
            <button
              type="button"
              onClick={() => navigate('/building/bld-wisdom')}
              className="p-5 rounded-2xl border-2 border-black bg-white hover:bg-neutral-50 text-left transition-all group shadow-sm hover:border-[#E67E6A]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-base text-black group-hover:text-[#E67E6A]">Wisdom Block</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#E67E6A] text-white font-bold">
                  WB
                </span>
              </div>
              <p className="text-xs font-semibold text-black mb-2">Administration & Central Library</p>
              <div className="space-y-1 text-[11px] text-neutral-700 font-medium">
                <div>• Ground: Admin Block, Chancellor, VC, Registrar, Dean</div>
                <div>• 1st Floor: Wisdom Block Seminar Hall</div>
                <div>• 3rd & 4th Floors: University Central Library</div>
              </div>
            </button>

            {/* Honesty Block */}
            <button
              type="button"
              onClick={() => navigate('/building/bld-honesty')}
              className="p-5 rounded-2xl border-2 border-black bg-white hover:bg-neutral-50 text-left transition-all group shadow-sm hover:border-[#E67E6A]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-base text-black group-hover:text-[#E67E6A]">Honesty Block</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#E67E6A] text-white font-bold">
                  HB
                </span>
              </div>
              <p className="text-xs font-semibold text-black mb-2">Major Tech Branches & Student Services</p>
              <div className="space-y-1 text-[11px] text-neutral-700 font-medium">
                <div>• CSE, IT, CIC, ECE, M.Tech classes & labs</div>
                <div>• SAC Room (beside Board Room)</div>
                <div>• Seminar Hall (GF, opposite Accounts Room)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Row: Truth Block & Bus Ground */}
        <div>
          <div className="text-[11px] font-extrabold text-black uppercase tracking-wider mb-3">
            Freshman Campus & Transportation Zone
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bus Ground */}
            <div className="p-4 rounded-xl bg-black text-white border border-neutral-800">
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <Bus className="w-4 h-4 text-[#E67E6A]" />
                <span>Bus Ground Parking</span>
              </div>
              <p className="text-xs text-neutral-300">Designated university parking area.</p>
            </div>

            {/* Truth Block */}
            <button
              type="button"
              onClick={() => navigate('/building/bld-truth')}
              className="md:col-span-2 p-4 rounded-xl border-2 border-black bg-white hover:bg-neutral-50 text-left transition-all group hover:border-[#E67E6A]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-black group-hover:text-[#E67E6A]">Truth Block</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black text-white font-bold">
                  TB
                </span>
              </div>
              <p className="text-xs text-neutral-800">
                1st & 2nd Year Academic Classes • Staff Room • <strong className="text-black">Student Hub</strong> (Enclosed amphitheater visible upon entry)
              </p>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-neutral-500 font-semibold">
        Click any block to inspect verified departments, laboratories, and unconfirmed attributes.
      </div>
    </div>
  );
};
