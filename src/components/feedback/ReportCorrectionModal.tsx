import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Facility } from '../../types/campus';
import { feedbackService } from '../../services/feedback/feedbackService';

interface ReportCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFacility?: Facility | null;
}

export const ReportCorrectionModal: React.FC<ReportCorrectionModalProps> = ({
  isOpen,
  onClose,
  targetFacility,
}) => {
  const [correctionText, setCorrectionText] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (correctionText.trim().length < 5) {
      setErrorMsg('Please describe the correction in detail (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackService.submitCorrection({
        facilityId: targetFacility?.id,
        facilityName: targetFacility?.canonicalName,
        buildingId: targetFacility?.buildingId || undefined,
        userSuggestedCorrection: correctionText,
        reporterName,
        reporterEmail,
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCorrectionText('');
    setSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-correction-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 id="report-correction-title" className="font-bold text-base">
              Suggest Location Correction
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close correction modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg text-slate-900">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your suggestion has been queued for verification by a campus administrator.
              To maintain data integrity, campus records will only update once verified.
            </p>
            <button
              onClick={handleResetAndClose}
              type="button"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {targetFacility && (
              <div className="bg-blue-50 border border-blue-200/60 p-3 rounded-xl text-xs text-blue-900">
                <span className="font-bold">Facility:</span> {targetFacility.canonicalName}
                {targetFacility.buildingName && ` (${targetFacility.buildingName})`}
              </div>
            )}

            <div>
              <label htmlFor="correction-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Correction Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="correction-input"
                rows={4}
                required
                value={correctionText}
                onChange={(e) => setCorrectionText(e.target.value)}
                placeholder="e.g., The SAC Room is specifically located beside the Board Room on the 1st floor, or room number is 104..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reporter-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  id="reporter-name"
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Student / Faculty name"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="reporter-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email (Optional, for updates)
                </label>
                <input
                  id="reporter-email"
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="name@vvitu.edu.in"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Suggestion'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
