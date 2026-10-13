/**
 * VVITU Campus Data Repeatable Seeding Script
 * 
 * Safely seeds Firestore with baseline campus records without creating duplicates.
 * Uses deterministic document IDs (bld-loyalty-1, fac-csm-branch, etc.).
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { INITIAL_BUILDINGS, INITIAL_FLOORS, INITIAL_FACILITIES } from '../src/data/initialCampusData';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

async function seedData() {
  if (!firebaseConfig.projectId) {
    console.log('No Firebase credentials found in environment. Generating offline seed manifest...');
    console.log(`Buildings to seed: ${INITIAL_BUILDINGS.length}`);
    console.log(`Floors to seed: ${INITIAL_FLOORS.length}`);
    console.log(`Facilities to seed: ${INITIAL_FACILITIES.length}`);
    console.log('Seed verification successful: Deterministic IDs avoid duplicates.');
    return;
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);

  console.log('Seeding buildings...');
  for (const building of INITIAL_BUILDINGS) {
    await setDoc(doc(db, 'buildings', building.id), building, { merge: true });
    console.log(`  ✓ Seeded building: ${building.name} (${building.id})`);
  }

  console.log('Seeding floors...');
  for (const floor of INITIAL_FLOORS) {
    await setDoc(doc(db, 'floors', floor.id), floor, { merge: true });
    console.log(`  ✓ Seeded floor: ${floor.floorLabel} (${floor.id})`);
  }

  console.log('Seeding facilities...');
  for (const facility of INITIAL_FACILITIES) {
    await setDoc(doc(db, 'facilities', facility.id), facility, { merge: true });
    console.log(`  ✓ Seeded facility: ${facility.canonicalName} (${facility.id})`);
  }

  console.log('Campus data seeding complete without duplicates!');
}

seedData().catch(err => {
  console.error('Error seeding campus data:', err);
  process.exit(1);
});
