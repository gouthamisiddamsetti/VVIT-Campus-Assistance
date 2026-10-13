import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Plus, Edit3, ArrowLeft, Search, CheckCircle, ShieldAlert } from 'lucide-react';
import { Facility, VerificationStatus, FacilityCategory } from '../types/campus';
import { campusService } from '../services/firebase/campusService';
import { authService } from '../services/firebase/authService';
import { auditService } from '../services/firebase/auditService';
import { VerificationBadge } from '../components/layout/VerificationBanner';

export const FacilityManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentAdmin] = useState(() => authService.getCurrentAdmin());

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    campusService.getFacilities().then(setFacilities);
  }, [currentAdmin, navigate]);

  const handleStatusChange = async (facId: string, newStatus: VerificationStatus) => {
    await campusService.updateFacilityVerification(
      facId,
      newStatus,
      currentAdmin?.email || 'admin'
    );
    await auditService.logAction(
      'UPDATE_VERIFICATION_STATUS',
      'facility',
      facId,
      currentAdmin?.email || 'admin',
      `Changed status to ${newStatus}`
    );
    setStatusMessage('Facility verification status updated.');
    setTimeout(() => setStatusMessage(''), 3000);
    const updated = await campusService.getFacilities();
    setFacilities(updated);
  };

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFacility) return;

    await campusService.updateFacility(
      editingFacility.id,
      editingFacility,
      currentAdmin?.email || 'admin'
    );
    await auditService.logAction(
      'EDIT_FACILITY',
      'facility',
      editingFacility.id,
      currentAdmin?.email || 'admin',
      `Updated facility attributes for ${editingFacility.canonicalName}`
    );
    setEditingFacility(null);
    setStatusMessage('Facility attributes updated successfully.');
    setTimeout(() => setStatusMessage(''), 3000);
    const updated = await campusService.getFacilities();
    setFacilities(updated);
  };

  const filtered = facilities.filter((f) => {
    if (statusFilter !== 'all' && f.verificationStatus !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        f.canonicalName.toLowerCase().includes(q) ||
        (f.buildingName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

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
          <h1 className="text-2xl font-extrabold text-slate-900">Facility Directory Management</h1>
          <p className="text-xs text-slate-500">
            Verify campus records, update floor numbers and rooms, or audit unconfirmed attributes.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl">
          {statusMessage}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search facility name or block..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 font-medium text-slate-700"
          >
            <option value="all">All Verification Statuses</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Officially Verified</option>
            <option value="needs_correction">Needs Correction</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Facilities List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map((fac) => (
            <div key={fac.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{fac.canonicalName}</h3>
                  <VerificationBadge status={fac.verificationStatus} size="sm" />
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Block: <strong>{fac.buildingName || 'Shared'}</strong></span>
                  <span>
                    Floor:{' '}
                    {fac.floorLabel ? (
                      <strong>{fac.floorLabel}</strong>
                    ) : (
                      <span className="text-amber-600 italic">Unconfirmed</span>
                    )}
                  </span>
                  <span>
                    Room:{' '}
                    {fac.roomNumber ? (
                      <strong>{fac.roomNumber}</strong>
                    ) : (
                      <span className="text-amber-600 italic">Unconfirmed</span>
                    )}
                  </span>
                </div>
                {fac.unknownDetails.length > 0 && (
                  <div className="text-[11px] text-amber-700 bg-amber-50/50 px-2 py-0.5 rounded inline-block">
                    Pending: {fac.unknownDetails[0]}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={fac.verificationStatus}
                  onChange={(e) => handleStatusChange(fac.id, e.target.value as VerificationStatus)}
                  className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 font-medium text-slate-700"
                >
                  <option value="pending">Pending Verification</option>
                  <option value="verified">Officially Verified</option>
                  <option value="needs_correction">Needs Correction</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  type="button"
                  onClick={() => setEditingFacility(fac)}
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

      {/* Edit Modal */}
      {editingFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900">
              Edit {editingFacility.canonicalName}
            </h3>

            <form onSubmit={handleSaveFacility} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Floor Label (e.g., Ground Floor, 3rd Floor)
                </label>
                <input
                  type="text"
                  value={editingFacility.floorLabel || ''}
                  onChange={(e) =>
                    setEditingFacility({ ...editingFacility, floorLabel: e.target.value || null })
                  }
                  placeholder="Leave blank if unconfirmed"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  value={editingFacility.roomNumber || ''}
                  onChange={(e) =>
                    setEditingFacility({ ...editingFacility, roomNumber: e.target.value || null })
                  }
                  placeholder="Do not fabricate sample numbers"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reported Operating Hours
                </label>
                <input
                  type="text"
                  value={editingFacility.openingHours || ''}
                  onChange={(e) =>
                    setEditingFacility({ ...editingFacility, openingHours: e.target.value || null })
                  }
                  placeholder="e.g., 12:00 PM – 1:30 PM daily (Reported)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Description
                </label>
                <textarea
                  rows={3}
                  value={editingFacility.locationDescription}
                  onChange={(e) =>
                    setEditingFacility({ ...editingFacility, locationDescription: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFacility(null)}
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
