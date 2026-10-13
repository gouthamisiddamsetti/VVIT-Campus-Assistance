import { AuditLog } from '../../types/campus';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

const LOCAL_AUDIT_KEY = 'vvitu_audit_logs_v1';

function getLocalAudit(): AuditLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_AUDIT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalAudit(logs: AuditLog[]): void {
  try {
    localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save audit logs to local store', err);
  }
}

export const auditService = {
  async logAction(
    action: string,
    targetType: AuditLog['targetType'],
    targetId: string,
    adminEmail: string,
    details: string
  ): Promise<void> {
    const entry: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      targetType,
      targetId,
      adminEmail,
      timestamp: new Date().toISOString(),
      details,
    };

    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'auditLogs'), entry);
      } catch (err) {
        console.warn('Firestore audit log error, saving locally:', err);
      }
    }

    const current = getLocalAudit();
    setLocalAudit([entry, ...current.slice(0, 99)]);
  },

  async getLogs(): Promise<AuditLog[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'auditLogs'));
        if (!snap.empty) {
          return snap.docs
            .map(d => ({ id: d.id, ...d.data() } as AuditLog))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
      } catch (err) {
        console.warn('Firestore fetch audit logs error:', err);
      }
    }
    return getLocalAudit();
  },
};
