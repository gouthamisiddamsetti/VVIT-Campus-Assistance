import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Building2,
  Layers,
  Clock,
  FileEdit,
  History,
  LogOut,
  RefreshCw,
  Plus
} from 'lucide-react';
import { authService } from '../services/firebase/authService';
import { campusService } from '../services/firebase/campusService';
import { feedbackService } from '../services/feedback/feedbackService';
import { auditService } from '../services/firebase/auditService';
import { Building, Facility, FeedbackSubmission, AuditLog } from '../types/campus';
import { isFirebaseConfigured } from '../services/firebase/config';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentAdmin] = useState(() => authService.getCurrentAdmin());

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }

    const loadStats = async () => {
      setLoading(true);
      const [blds, facs, fbs, logs] = await Promise.all([
        campusService.getBuildings(),
        campusService.getFacilities(),
        feedbackService.getAllFeedback(),
        auditService.getLogs(),
      ]);
      setBuildings(blds);
      setFacilities(facs);
      setFeedback(fbs);
      setAuditLogs(logs);
      setLoading(false);
    };
    loadStats();
  }, [currentAdmin, navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all campus records back to initial seed data?')) {
      await campusService.resetToInitialData();
      await auditService.logAction(
        'RESET_DATABASE',
        'facility',
        'all',
        currentAdmin?.email || 'admin',
        'Reset campus records to seed state.'
      );
      window.location.reload();
    }
  };

  // Real database metrics calculation
  const pendingVerificationCount = facilities.filter(
    (f) => f.verificationStatus === 'pending'
  ).length;

  const missingFloorCount = facilities.filter(
    (f) => !f.floorLabel && f.buildingId
  ).length;

  const missingRoomCount = facilities.filter(
    (f) => !f.roomNumber && f.category !== 'utility'
  ).length;

  const pendingFeedbackCount = feedback.filter((f) => f.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white">
      {/* Top Banner with Official Logo */}
      <div className="bg-black text-white p-6 sm:p-8 rounded-3xl border-2 border-[#E67E6A] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-start sm:items-center gap-4">
          <div className="bg-white p-2 rounded-2xl shrink-0 shadow-md border border-neutral-300">
            <img
              src="/vvit-logo.jpg"
              alt="VVIT Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#E67E6A] text-white uppercase font-bold">
                Role: {currentAdmin?.role.replace('_', ' ')}
              </span>
              <span className="text-xs text-neutral-400">
                Database: {isFirebaseConfigured() ? 'Live Firebase' : 'Offline Verified Store'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              VVIT Administrator Control Center
            </h1>
            <p className="text-xs text-neutral-300 mt-1">
              Logged in as <strong className="text-white">{currentAdmin?.displayName}</strong> ({currentAdmin?.email})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentAdmin?.role === 'master_admin' && (
            <button
              onClick={handleResetData}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-neutral-700"
              title="Reset records to default seed state"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E67E6A]" />
              <span>Reset Seed Data</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            type="button"
            className="px-4 py-2 rounded-xl bg-[#E67E6A] hover:bg-[#d66c58] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Pending Verification
            </span>
            <Clock className="w-4 h-4 text-[#E67E6A]" />
          </div>
          <div className="text-3xl font-extrabold text-[#E67E6A]">
            {pendingVerificationCount}
          </div>
          <p className="text-[11px] text-neutral-600 font-medium">Facilities awaiting campus audit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Missing Floors
            </span>
            <Layers className="w-4 h-4 text-[#E67E6A]" />
          </div>
          <div className="text-3xl font-extrabold text-black">
            {missingFloorCount}
          </div>
          <p className="text-[11px] text-neutral-600 font-medium">Facilities with unassigned floors</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Missing Rooms
            </span>
            <Building2 className="w-4 h-4 text-[#E67E6A]" />
          </div>
          <div className="text-3xl font-extrabold text-black">
            {missingRoomCount}
          </div>
          <p className="text-[11px] text-neutral-600 font-medium">Unconfirmed room numbers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-sm space-y-2">
          <div className="flex items-center justify-between text-black">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Pending Corrections
            </span>
            <FileEdit className="w-4 h-4 text-[#E67E6A]" />
          </div>
          <div className="text-3xl font-extrabold text-[#E67E6A]">
            {pendingFeedbackCount}
          </div>
          <p className="text-[11px] text-neutral-600 font-medium">User-reported location suggestions</p>
        </div>
      </div>

      {/* Navigation Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/facilities"
          className="bg-white p-6 rounded-3xl border-2 border-black shadow-sm hover:shadow-xl hover:border-[#E67E6A] transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-black text-[#E67E6A] flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-black group-hover:text-[#E67E6A] transition-colors">
              Manage Facilities & Verification
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-medium">
              Edit room assignments, verify unconfirmed locations, add aliases, or mark records as verified.
            </p>
          </div>
          <span className="text-xs font-bold text-[#E67E6A] mt-4 block">Open Facility Manager →</span>
        </Link>

        <Link
          to="/admin/buildings"
          className="bg-white p-6 rounded-3xl border-2 border-black shadow-sm hover:shadow-xl hover:border-[#E67E6A] transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-black text-[#E67E6A] flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-black group-hover:text-[#E67E6A] transition-colors">
              Manage Campus Blocks
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-medium">
              Add or update university blocks, floor specifications, aliases, and known branches.
            </p>
          </div>
          <span className="text-xs font-bold text-[#E67E6A] mt-4 block">Open Building Manager →</span>
        </Link>

        <Link
          to="/admin/feedback"
          className="bg-white p-6 rounded-3xl border-2 border-black shadow-sm hover:shadow-xl hover:border-[#E67E6A] transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-black text-[#E67E6A] flex items-center justify-center mb-3">
              <FileEdit className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-black group-hover:text-[#E67E6A] transition-colors">
              Review User Corrections
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-medium">
              Review location corrections submitted by students and faculty without auto-overwriting.
            </p>
          </div>
          <span className="text-xs font-bold text-[#E67E6A] mt-4 block">Review Feedback ({pendingFeedbackCount}) →</span>
        </Link>
      </div>

      {/* Audit Logs Stream */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-black shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-black">
          <History className="w-4 h-4 text-[#E67E6A]" />
          <span>Administrative Audit Logs</span>
        </div>
        <p className="text-xs text-neutral-600 font-medium">
          Immutable history of administrative actions, data edits, and verification updates.
        </p>

        {auditLogs.length > 0 ? (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-neutral-50 p-3 rounded-xl border border-neutral-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-black">{log.action}</span>
                  <span className="text-neutral-500 ml-2">by {log.adminEmail}</span>
                  <p className="text-[11px] text-neutral-700 mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-neutral-500 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-neutral-400 font-medium">
            No audit logs recorded yet. Administrative modifications will appear here.
          </div>
        )}
      </div>
    </div>
  );
};
