import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileEdit, ArrowLeft, Check, X, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';
import { FeedbackSubmission } from '../types/campus';
import { feedbackService } from '../services/feedback/feedbackService';
import { authService } from '../services/firebase/authService';
import { auditService } from '../services/firebase/auditService';

export const FeedbackManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentAdmin] = useState(() => authService.getCurrentAdmin());

  const [feedbackList, setFeedbackList] = useState<FeedbackSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'applied' | 'rejected'>('all');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin/login');
      return;
    }
    feedbackService.getAllFeedback().then(setFeedbackList);
  }, [currentAdmin, navigate]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: FeedbackSubmission['status'],
    adminNotes: string = ''
  ) => {
    await feedbackService.updateFeedbackStatus(id, newStatus, adminNotes);
    await auditService.logAction(
      'REVIEW_FEEDBACK',
      'feedback',
      id,
      currentAdmin?.email || 'admin',
      `Marked feedback suggestion as ${newStatus}`
    );
    setStatusMessage(`Feedback status updated to ${newStatus}.`);
    setTimeout(() => setStatusMessage(''), 3000);
    const updated = await feedbackService.getAllFeedback();
    setFeedbackList(updated);
  };

  const filtered = feedbackList.filter((fb) => {
    if (statusFilter !== 'all' && fb.status !== statusFilter) return false;
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
          <h1 className="text-2xl font-extrabold text-slate-900">User Location Corrections</h1>
          <p className="text-xs text-slate-500">
            Review reported corrections. Feedback submissions never automatically modify directory records.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl">
          {statusMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'reviewed', 'applied', 'rejected'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st} ({feedbackList.filter((f) => (st === 'all' ? true : f.status === st)).length})
          </button>
        ))}
      </div>

      {/* Feedback Items */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {item.facilityName || 'General Campus Suggestion'}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'applied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(item.submittedAt).toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                  <strong>User Suggestion:</strong> "{item.userSuggestedCorrection}"
                </div>

                {(item.reporterName || item.reporterEmail) && (
                  <div className="text-[11px] text-slate-400">
                    Reported by: {item.reporterName || 'Anonymous'}{' '}
                    {item.reporterEmail && `(${item.reporterEmail})`}
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {item.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, 'applied', 'Verified and confirmed on campus')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Apply</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, 'reviewed', 'Inspected by directory admin')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, 'rejected', 'Does not match campus ground plan')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">
            No feedback entries matching this filter.
          </div>
        )}
      </div>
    </div>
  );
};
