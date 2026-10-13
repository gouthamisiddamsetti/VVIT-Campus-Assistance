import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  BookOpen,
  Utensils,
  HeartPulse,
  Award,
  ArrowRight
} from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar';
import { BuildingCard } from '../components/directory/BuildingCard';
import { CampusMapSchematic } from '../components/directory/CampusMapSchematic';
import { AskVVITUChatModal } from '../components/chat/AskVVITUChatModal';
import { Building, Facility } from '../types/campus';
import { campusService } from '../services/firebase/campusService';

export const HomePage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [blds, facs] = await Promise.all([
        campusService.getBuildings(),
        campusService.getFacilities(),
      ]);
      setBuildings(blds);
      setFacilities(facs);
    };
    load();
  }, []);

  const quickFacilities = [
    {
      name: 'University Library',
      desc: 'Wisdom Block (3rd & 4th Floors)',
      icon: BookOpen,
      link: '/facility/fac-library',
    },
    {
      name: 'Campus Mess',
      desc: 'Between Loyalty 2 & 3 (12:00–1:30 PM)',
      icon: Utensils,
      link: '/facility/fac-mess',
    },
    {
      name: 'Medical Room',
      desc: 'Loyalty Block 4 (Ground Floor)',
      icon: HeartPulse,
      link: '/facility/fac-medical-room',
    },
    {
      name: 'Examination Cell',
      desc: 'Loyalty Block 2',
      icon: Award,
      link: '/facility/fac-exam-cell',
    },
  ];

  return (
    <div className="space-y-16 pb-16 bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black text-white pt-12 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b-4 border-[#E67E6A]">
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Prominent Official College Logo */}
          <div className="flex justify-center mb-2">
            <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border-2 border-[#E67E6A] inline-block">
              <img
                src="/vvit-logo.jpg"
                alt="Vasireddy Venkatadri International Technological University Logo"
                className="h-20 sm:h-28 w-auto object-contain mx-auto"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-[#E67E6A] text-[#E67E6A] text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#E67E6A]" />
            <span>VVIT Assistance • Digital Campus Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your Campus. Your Guide.{' '}
            <span className="text-[#E67E6A]">
              Everything VVIT.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Find buildings, departments, laboratories and facilities across Vasireddy Venkatadri International Technological University.
          </p>

          {/* Primary Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <SearchBar size="hero" />
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              id="hero-find-location-btn"
              className="px-6 py-3.5 rounded-xl bg-[#E67E6A] hover:bg-[#d66c58] text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Find a Location</span>
            </Link>

            <button
              onClick={() => setIsChatOpen(true)}
              type="button"
              id="hero-ask-vvitu-ai-btn"
              className="px-6 py-3.5 rounded-xl bg-black hover:bg-neutral-900 text-white border-2 border-[#E67E6A] font-bold text-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#E67E6A]" />
              <span>Ask VVIT AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick-Access Facility Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickFacilities.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.name}
                to={f.link}
                className="bg-white rounded-2xl border-2 border-black p-5 shadow-lg hover:shadow-2xl hover:border-[#E67E6A] transition-all flex items-start gap-4 group"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-black text-[#E67E6A] border border-[#E67E6A] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform"
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-black group-hover:text-[#E67E6A] transition-colors">
                    {f.name}
                  </h2>
                  <p className="text-xs text-neutral-600 mt-1 leading-snug font-medium">{f.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Campus Buildings Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#E67E6A] uppercase tracking-wider mb-1">
              Building Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
              Campus Academic & Administrative Blocks
            </h2>
            <p className="text-sm text-neutral-600 mt-1 font-medium">
              Browse all 7 university blocks with verified branches, laboratories, and unknown attributes clearly labeled.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-black hover:text-[#E67E6A] transition-colors shrink-0"
          >
            <span>View All Blocks</span>
            <ArrowRight className="w-4 h-4 text-[#E67E6A]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((b) => (
            <BuildingCard key={b.id} building={b} />
          ))}
        </div>
      </section>

      {/* Illustrative Campus Schematic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CampusMapSchematic buildings={buildings} />
      </section>

      {/* Popular Destinations / Academic Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black border-2 border-[#E67E6A] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E67E6A]">
              Need Instant Directions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Ask VVIT AI About Any Facility on Campus
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-medium">
              Trained strictly on verified campus records. Ask where the SAC Room is, mess timings, or which block houses CSE without misleading directions.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsChatOpen(true)}
                type="button"
                className="px-6 py-3 bg-[#E67E6A] hover:bg-[#d66c58] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Open Campus Assistant</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/departments-labs"
              className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-xl border border-neutral-700 text-left transition-all"
            >
              <span className="block font-bold text-sm text-white">Branches & Labs</span>
              <span className="text-xs text-[#E67E6A]">11 Engineering Branches</span>
            </Link>
            <Link
              to="/facilities"
              className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-xl border border-neutral-700 text-left transition-all"
            >
              <span className="block font-bold text-sm text-white">Shared Amenities</span>
              <span className="text-xs text-[#E67E6A]">Mess, Hostels, Sports</span>
            </Link>
            <Link
              to="/facility/fac-sac-room"
              className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-xl border border-neutral-700 text-left transition-all"
            >
              <span className="block font-bold text-sm text-white">SAC Room</span>
              <span className="text-xs text-[#E67E6A]">Honesty Block</span>
            </Link>
            <Link
              to="/facility/fac-student-hub-truth"
              className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded-xl border border-neutral-700 text-left transition-all"
            >
              <span className="block font-bold text-sm text-white">Student Hub</span>
              <span className="text-xs text-[#E67E6A]">Truth Block Entrance</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Grounded Campus AI Modal */}
      <AskVVITUChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};
