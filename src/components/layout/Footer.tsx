import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-[#E67E6A]/30 text-neutral-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Logo */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl shadow-md border border-neutral-200 shrink-0">
                <img
                  src="/vvit-logo.jpg"
                  alt="VVIT University Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                VVIT <span className="text-[#E67E6A]">ASSISTANCE</span>
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Vasireddy Venkatadri International Technological University (VVITU) Digital Campus Guide.
              Connecting students, staff, and visitors to verified academic blocks, laboratories, and facilities.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3 border-l-2 border-[#E67E6A] pl-2">
              Directory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-[#E67E6A] transition-colors">
                  Campus Blocks Directory
                </Link>
              </li>
              <li>
                <Link to="/departments-labs" className="hover:text-[#E67E6A] transition-colors">
                  Departments & Laboratories
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-[#E67E6A] transition-colors">
                  Shared Campus Facilities
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#E67E6A] transition-colors">
                  Global Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistant & Corrections */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3 border-l-2 border-[#E67E6A] pl-2">
              Assistance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/ask-ai" className="hover:text-[#E67E6A] transition-colors flex items-center gap-1 font-semibold text-[#E67E6A]">
                  <span>Ask VVITU AI</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E67E6A] transition-colors">
                  Verification Methodology
                </Link>
              </li>
              <li>
                <span className="text-neutral-400">
                  Location corrections can be submitted via the "Suggest Correction" button on any facility card.
                </span>
              </li>
            </ul>
          </div>

          {/* Verification Disclosure */}
          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[#E67E6A] text-xs font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Campus Data Verification</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-normal">
              Initial records are owner-supplied and marked as <strong className="text-[#E67E6A]">Pending Independent Verification</strong>.
              Unconfirmed details (room numbers, exact hours) are explicitly marked to prevent misinformation.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} VVIT Assistance — Vasireddy Venkatadri International Technological University.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-[#E67E6A] font-semibold transition-colors">
              Staff & Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
