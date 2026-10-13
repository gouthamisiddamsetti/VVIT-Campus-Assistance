import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';
import { AdminProfile, UserRole } from '../../types/campus';

const LOCAL_ADMIN_KEY = 'vvitu_active_admin_session';

// Demo administrator accounts for local development and testing
export const DEMO_ADMIN_ACCOUNTS: Record<string, { role: UserRole; name: string; pass: string }> = {
  'vvitu@ac.in': {
    role: 'master_admin',
    name: 'Chief Campus Administrator (Master Admin)',
    pass: 'vvitu@123',
  },
  'master.admin@vvitu.edu.in': {
    role: 'master_admin',
    name: 'Chief Campus Administrator',
    pass: 'VVITU@Master2026',
  },
  'directory.admin@vvitu.edu.in': {
    role: 'directory_admin',
    name: 'Academic Directory Manager',
    pass: 'VVITU@Directory2026',
  },
  'auditor@vvitu.edu.in': {
    role: 'auditor',
    name: 'Quality & Audit Inspector',
    pass: 'VVITU@Auditor2026',
  },
};

function safeStorageGet(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {}
  return null;
}

function safeStorageSet(key: string, val: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
    }
  } catch {}
}

function safeStorageRemove(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch {}
}

export const authService = {
  getCurrentAdmin(): AdminProfile | null {
    const raw = safeStorageGet(LOCAL_ADMIN_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return null;
  },

  async login(email: string, password: string): Promise<AdminProfile> {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. If Firebase Auth is configured, attempt real Firebase sign in
    if (isFirebaseConfigured() && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        const role: UserRole =
          trimmedEmail === 'vvitu@ac.in' || trimmedEmail.includes('master')
            ? 'master_admin'
            : trimmedEmail.includes('auditor')
            ? 'auditor'
            : 'directory_admin';

        const profile: AdminProfile = {
          uid: cred.user.uid,
          email: cred.user.email || trimmedEmail,
          displayName: cred.user.displayName || trimmedEmail.split('@')[0],
          role,
          lastLogin: new Date().toISOString(),
        };

        safeStorageSet(LOCAL_ADMIN_KEY, JSON.stringify(profile));
        return profile;
      } catch (err) {
        // Fallback to local demo checks if live Firebase call failed or offline
        console.warn('Firebase Auth failed, checking local credentials:', err);
      }
    }

    // 2. Local demo credentials authentication
    const demo = DEMO_ADMIN_ACCOUNTS[trimmedEmail];
    if (demo && demo.pass === password) {
      const profile: AdminProfile = {
        uid: `demo-${demo.role}`,
        email: trimmedEmail,
        displayName: demo.name,
        role: demo.role,
        lastLogin: new Date().toISOString(),
      };
      safeStorageSet(LOCAL_ADMIN_KEY, JSON.stringify(profile));
      return profile;
    }

    throw new Error('Invalid email or password. Please check your administrator credentials.');
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured() && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Firebase sign out error:', err);
      }
    }
    safeStorageRemove(LOCAL_ADMIN_KEY);
  },

  hasPermission(role: UserRole, action: 'verify' | 'edit' | 'delete' | 'manage_admins' | 'audit'): boolean {
    if (role === 'master_admin') return true;
    if (role === 'directory_admin') {
      return action === 'edit' || action === 'verify';
    }
    if (role === 'auditor') {
      return action === 'audit';
    }
    return false;
  },
};
