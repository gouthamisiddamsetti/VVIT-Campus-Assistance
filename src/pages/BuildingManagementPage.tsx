import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Plus, Edit3, CheckCircle, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';
import { Building, VerificationStatus } from '../types/campus';
import { campusService } from '../services/firebase/campusService';
import { authService } from '../services/firebase/authService';
import { auditService } from '../services/firebase/auditService';
import { VerificationBadge } from '../components/layout/VerificationBanner';

export const BuildingManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentAdmin] = useState(() => authService.getCurrentAdmin());
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    campusService.getBuildings().then(setBuildings);
  }, [currentAdmin, navigate]);

  const handleStatusChange = async (buildingId: string, newStatus: VerificationStatus) => {
    await campusService.updateBuilding(buildingId, { verificationStatus: newStatus });
    await auditService.logAction(
      'UPDATE_BUILDING_STATUS',
      'building',
      buildingId,
      currentAdmin?.email || 'admin',
      `Updated verification status to ${newStatus}`
    );
    setStatusMessage('Building status updated successfully.');
    setTimeout(() => setStatusMessage(''), 3000);
    const updated = await campusService.getBuildings();
    setBuildings(updated);
  };

  const handleSaveBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBuilding) return;

    await campusService.updateBuilding(editingBuilding.id, editingBuilding);
    await auditService.logAction(
      'EDIT_BUILDING',
      'building',
      editingBuilding.id,
      currentAdmin?.email || 'admin',
      `Updated building details for ${editingBuilding.name}`
    );
    setEditingBuilding(null);
    setStatusMessage('Building details saved.');
    setTimeout(() => setStatusMessage(''), 3000);
    const updated = await campusService.getBuildings();
    setBuildings(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/dashboard"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Campus Block Management</h1>
          <p className="text-xs text-slate-500">
            Review, verify, and update university blocks and floor attributes.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl">
          {statusMessage}
        </div>
      )}

      {/* Buildings Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {buildings.map((b) => (
            <div key={b.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {b.shortCode}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">{b.name}</h3>
                  <VerificationBadge status={b.verificationStatus} size="sm" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{b.description}</p>
                <div className="text-[11px] text-slate-400">
                  Branches: {b.knownBranches.join(', ') || 'General Admin'} • Source: {b.source}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={b.verificationStatus}
                  onChange={(e) => handleStatusChange(b.id, e.target.value as VerificationStatus)}
                  className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 font-medium text-slate-700"
                >
                  <option value="pending">Pending Verification</option>
                  <option value="verified">Officially Verified</option>
                  <option value="needs_correction">Needs Correction</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  type="button"
                  onClick={() => setEditingBuilding(b)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Building Modal */}
      {editingBuilding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Edit {editingBuilding.name}</h3>
            <form onSubmit={handleSaveBuilding} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Building Description
                </label>
                <textarea
                  rows={3}
                  value={editingBuilding.description}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, description: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Floor Information Summary
                </label>
                <input
                  type="text"
                  value={editingBuilding.floorsSummary}
                  onChange={(e) =>
                    setEditingBuilding({ ...editingBuilding, floorsSummary: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBuilding(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
