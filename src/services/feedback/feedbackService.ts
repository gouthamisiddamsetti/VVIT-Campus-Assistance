import { FeedbackSubmission } from '../../types/campus';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

const LOCAL_FEEDBACK_KEY = 'vvitu_feedback_v1';

function getLocalFeedback(): FeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalFeedback(items: FeedbackSubmission[]): void {
  try {
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save feedback to local store', err);
  }
}

export const feedbackService = {
  async submitCorrection(data: {
    facilityId?: string;
    facilityName?: string;
    buildingId?: string;
    userSuggestedCorrection: string;
    reporterName?: string;
    reporterEmail?: string;
  }): Promise<FeedbackSubmission> {
    const trimmedText = data.userSuggestedCorrection?.trim();
    if (!trimmedText || trimmedText.length < 5) {
      throw new Error('Please enter a descriptive correction details (minimum 5 characters).');
    }

    const item: FeedbackSubmission = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      facilityId: data.facilityId,
      facilityName: data.facilityName,
      buildingId: data.buildingId,
      userSuggestedCorrection: trimmedText,
      reporterName: data.reporterName?.trim(),
      reporterEmail: data.reporterEmail?.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'feedback'), item);
      } catch (err) {
        console.warn('Firestore feedback submit error, using local store:', err);
      }
    }

    const existing = getLocalFeedback();
    setLocalFeedback([item, ...existing]);
    return item;
  },

  async getAllFeedback(): Promise<FeedbackSubmission[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'feedback'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as FeedbackSubmission));
        }
      } catch (err) {
        console.warn('Firestore get feedback error, using local store:', err);
      }
    }
    return getLocalFeedback();
  },

  async updateFeedbackStatus(
    id: string,
    status: FeedbackSubmission['status'],
    adminNotes?: string
  ): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'feedback', id), {
          status,
          adminNotes: adminNotes || '',
        });
      } catch (err) {
        console.warn('Firestore update feedback error:', err);
      }
    }

    const items = getLocalFeedback();
    const updated = items.map(f => (f.id === id ? { ...f, status, adminNotes } : f));
    setLocalFeedback(updated);
  },
};
