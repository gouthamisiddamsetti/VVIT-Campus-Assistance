import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Building, Floor, Facility, VerificationStatus } from '../../types/campus';
import { INITIAL_BUILDINGS, INITIAL_FLOORS, INITIAL_FACILITIES } from '../../data/initialCampusData';

const LOCAL_STORAGE_KEYS = {
  BUILDINGS: 'vvitu_buildings_v1',
  FLOORS: 'vvitu_floors_v1',
  FACILITIES: 'vvitu_facilities_v1',
};

// Initialize local cache if not set
function getLocalStore<T>(key: string, initial: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setLocalStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to write to local storage', err);
  }
}

export const campusService = {
  async getBuildings(): Promise<Building[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'buildings'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Building));
        }
      } catch (err) {
        console.warn('Firestore fetch buildings failed, falling back to local store:', err);
      }
    }
    return getLocalStore<Building>(LOCAL_STORAGE_KEYS.BUILDINGS, INITIAL_BUILDINGS);
  },

  async getBuildingById(id: string): Promise<Building | null> {
    const buildings = await this.getBuildings();
    return buildings.find(b => b.id === id) || null;
  },

  async getFloors(buildingId?: string): Promise<Floor[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const q = buildingId
          ? query(collection(db, 'floors'), where('buildingId', '==', buildingId))
          : collection(db, 'floors');
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Floor));
        }
      } catch (err) {
        console.warn('Firestore fetch floors failed, falling back to local store:', err);
      }
    }
    const all = getLocalStore<Floor>(LOCAL_STORAGE_KEYS.FLOORS, INITIAL_FLOORS);
    return buildingId ? all.filter(f => f.buildingId === buildingId) : all;
  },

  async getFacilities(): Promise<Facility[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'facilities'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Facility));
        }
      } catch (err) {
        console.warn('Firestore fetch facilities failed, falling back to local store:', err);
      }
    }
    return getLocalStore<Facility>(LOCAL_STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
  },

  async getFacilityById(id: string): Promise<Facility | null> {
    const facilities = await this.getFacilities();
    return facilities.find(f => f.id === id) || null;
  },

  async updateFacilityVerification(id: string, status: VerificationStatus, updatedBy: string): Promise<void> {
    const now = new Date().toISOString();
    if (isFirebaseConfigured() && db) {
      try {
        const ref = doc(db, 'facilities', id);
        await updateDoc(ref, {
          verificationStatus: status,
          updatedAt: now,
          updatedBy,
        });
      } catch (err) {
        console.error('Firestore update error:', err);
      }
    }

    const current = getLocalStore<Facility>(LOCAL_STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
    const updated = current.map(f => (f.id === id ? { ...f, verificationStatus: status, updatedAt: now, updatedBy } : f));
    setLocalStore(LOCAL_STORAGE_KEYS.FACILITIES, updated);
  },

  async updateFacility(id: string, updates: Partial<Facility>, updatedBy: string): Promise<void> {
    const now = new Date().toISOString();
    const payload = { ...updates, updatedAt: now, updatedBy };

    if (isFirebaseConfigured() && db) {
      try {
        const ref = doc(db, 'facilities', id);
        await updateDoc(ref, payload);
      } catch (err) {
        console.error('Firestore update error:', err);
      }
    }

    const current = getLocalStore<Facility>(LOCAL_STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
    const updated = current.map(f => (f.id === id ? { ...f, ...payload } : f));
    setLocalStore(LOCAL_STORAGE_KEYS.FACILITIES, updated);
  },

  async createFacility(facility: Facility): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'facilities', facility.id), facility);
      } catch (err) {
        console.error('Firestore insert error:', err);
      }
    }

    const current = getLocalStore<Facility>(LOCAL_STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
    setLocalStore(LOCAL_STORAGE_KEYS.FACILITIES, [...current, facility]);
  },

  async updateBuilding(id: string, updates: Partial<Building>): Promise<void> {
    const now = new Date().toISOString();
    const payload = { ...updates, updatedAt: now };

    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'buildings', id), payload);
      } catch (err) {
        console.error('Firestore update building error:', err);
      }
    }

    const current = getLocalStore<Building>(LOCAL_STORAGE_KEYS.BUILDINGS, INITIAL_BUILDINGS);
    const updated = current.map(b => (b.id === id ? { ...b, ...payload } : b));
    setLocalStore(LOCAL_STORAGE_KEYS.BUILDINGS, updated);
  },

  async resetToInitialData(): Promise<void> {
    setLocalStore(LOCAL_STORAGE_KEYS.BUILDINGS, INITIAL_BUILDINGS);
    setLocalStore(LOCAL_STORAGE_KEYS.FLOORS, INITIAL_FLOORS);
    setLocalStore(LOCAL_STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
  }
};
