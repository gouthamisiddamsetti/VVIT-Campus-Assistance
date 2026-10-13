import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Archive } from 'lucide-react';
import { VerificationStatus } from '../../types/campus';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'md' }) => {
  const configs = {
    pending: {
      label: 'Pending Verification',
      bg: 'bg-black text-[#E67E6A] border-[#E67E6A]/60',
      icon: Clock,
    },
    verified: {
      label: 'Officially Verified',
      bg: 'bg-[#E67E6A] text-white border-[#E67E6A]',
      icon: CheckCircle,
    },
    needs_correction: {
      label: 'Needs Correction',
      bg: 'bg-neutral-900 text-white border-neutral-700',
      icon: AlertTriangle,
    },
    archived: {
      label: 'Archived',
      bg: 'bg-neutral-100 text-neutral-600 border-neutral-300',
      icon: Archive,
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border shadow-2xs ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

export const GlobalVerificationAlert: React.FC = () => {
  return (
    <div className="bg-black border-b border-[#E67E6A]/40 px-4 py-2 text-xs text-white flex items-center justify-center gap-2 text-center">
      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#E67E6A]" />
      <span>
        Campus records currently display initial university records pending independent verification. All verified records adhere to official VVIT campus maps.
      </span>
    </div>
  );
};
