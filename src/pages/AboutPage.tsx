import React from 'react';
import { ShieldCheck, Compass, Info, CheckCircle2, AlertTriangle, Database } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <Info className="w-4 h-4" />
          <span>About VVITU Assistance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Your Digital Campus Guide
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          VVITU ASSISTANCE is the authoritative digital navigation and campus intelligence platform for Vasireddy Venkatadri International Technological University.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-base text-slate-900">Strict Data Grounding</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike generic AI tools that hallucinate room numbers or unverified schedules, VVITU Assistance answers exclusively from verifiable campus records. Unknown details are explicitly designated as unconfirmed.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-base text-slate-900">Audit-Driven Verification</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every record maintains provenance metadata: project-owner source, authorized administrator review, and verification timestamp. Community corrections are moderated by directory admins before publishing.
          </p>
        </div>
      </div>

      {/* Verification Lifecycle */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
        <h2 className="text-xl font-bold">Campus Verification Lifecycle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <span className="font-bold text-amber-400 block text-sm">1. Pending Verification</span>
            <p className="text-slate-300 leading-relaxed">
              Initial records supplied by project owners or campus community. Clearly flagged in public directories.
            </p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <span className="font-bold text-emerald-400 block text-sm">2. Officially Verified</span>
            <p className="text-slate-300 leading-relaxed">
              Independently confirmed on-site or certified by authorized department chairs and administrative staff.
            </p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
            <span className="font-bold text-rose-400 block text-sm">3. Needs Correction</span>
            <p className="text-slate-300 leading-relaxed">
              Flagged by student/faculty feedback requiring administrative investigation and updating.
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Upcoming Interactive Map Integration</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The current release provides a searchable directory and spatial block schematics. In accordance with data integrity guidelines, GPS coordinates and walking times will only be activated when certified cadastral campus map surveys are provided by the university.
        </p>
      </div>
    </div>
  );
};
