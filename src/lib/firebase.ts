import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import fallbackConfig from '../../firebase-applet-config.json';

// Support both standard Vite environment variables (for Vercel, Netlify, Cloudflare, etc.)
// and bundled firebase-applet-config.json (for out-of-the-box deployment anywhere)
export const resolvedFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || fallbackConfig.firestoreDatabaseId || '',
};

// Initialize Firebase App instance safely
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(resolvedFirebaseConfig);
} else {
  app = getApp();
}

// Resilient Firestore instance initialization
// Safely supports custom database IDs (like AI Studio) and default databases ('(default)')
let db: Firestore;
try {
  const dbId = resolvedFirebaseConfig.firestoreDatabaseId;
  if (dbId && dbId !== '(default)' && dbId !== 'default') {
    db = getFirestore(app, dbId);
  } else {
    db = getFirestore(app);
  }
} catch (err) {
  console.warn('[Firebase] Database initialization notice, falling back to default database instance:', err);
  db = getFirestore(app);
}

export const isFirebaseConfigured = (): boolean => {
  return Boolean(resolvedFirebaseConfig.apiKey && resolvedFirebaseConfig.projectId);
};

export { app, db };
