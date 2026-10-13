export type VerificationStatus = 'pending' | 'verified' | 'needs_correction' | 'archived';

export type DataSource = 'project_owner' | 'official_university' | 'administrator' | 'other_documented';

export type FacilityCategory =
  | 'academic'
  | 'laboratory'
  | 'administrative'
  | 'seminar_hall'
  | 'library'
  | 'medical'
  | 'dining'
  | 'event_space'
  | 'utility'
  | 'hostel'
  | 'sports'
  | 'transport'
  | 'other';

export type UserRole = 'master_admin' | 'directory_admin' | 'auditor';

export interface Building {
  id: string;
  name: string;
  shortCode: string;
  aliases: string[];
  description: string;
  knownBranches: string[];
  knownFacilities: string[];
  totalFloorsKnown: number | null;
  floorsSummary: string;
  verificationStatus: VerificationStatus;
  source: DataSource;
  isPublished: boolean;
  schematicCoords?: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorLabel: string;
  floorNumber: number | null;
  description: string;
  verificationStatus: VerificationStatus;
}

export interface Facility {
  id: string;
  canonicalName: string;
  aliases: string[];
  category: FacilityCategory;
  buildingId: string | null;
  buildingName: string | null;
  floorId: string | null;
  floorLabel: string | null;
  roomNumber: string | null;
  locationDescription: string;
  nearbyLandmarks: string[];
  openingHours: string | null;
  contactDetails: string | null;
  capacity: number | null;
  coordinates: { x: number; y: number } | null;
  verificationStatus: VerificationStatus;
  source: DataSource;
  isPublished: boolean;
  unknownDetails: string[];
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface FeedbackSubmission {
  id: string;
  facilityId?: string;
  facilityName?: string;
  buildingId?: string;
  userSuggestedCorrection: string;
  reporterName?: string;
  reporterEmail?: string;
  status: 'pending' | 'reviewed' | 'applied' | 'rejected';
  submittedAt: string;
  adminNotes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  targetType: 'building' | 'facility' | 'floor' | 'feedback' | 'role';
  targetId: string;
  adminEmail: string;
  timestamp: string;
  details: string;
}

export interface AdminProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  lastLogin?: string;
}

export interface SearchFilter {
  query?: string;
  buildingId?: string;
  category?: FacilityCategory | 'all';
  verificationStatus?: VerificationStatus | 'all';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  matchedFacilities?: Array<{
    id: string;
    canonicalName: string;
    buildingName: string | null;
    verificationStatus: VerificationStatus;
  }>;
  clarificationOptions?: string[];
  isFallback?: boolean;
}
