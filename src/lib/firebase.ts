import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore, 
  FirestoreSettings,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
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
// CRITICAL: experimentalForceLongPolling: true prevents WebChannel streaming timeouts
// ("Could not reach Cloud Firestore backend. Backend didn't respond within 10 seconds")
// in proxied environments, Cloud Run containers, and browser sandboxed iframes.
const firestoreSettings: FirestoreSettings = {
  experimentalForceLongPolling: true,
};

let db: Firestore;
const dbId = resolvedFirebaseConfig.firestoreDatabaseId;
const isCustomDb = Boolean(dbId && dbId !== '(default)' && dbId !== 'default');

try {
  if (isCustomDb) {
    db = initializeFirestore(app, firestoreSettings, dbId);
  } else {
    db = initializeFirestore(app, firestoreSettings);
  }
} catch {
  // If Firestore is already initialized (e.g. during module HMR or multiple instances), retrieve existing instance
  try {
    if (isCustomDb) {
      db = getFirestore(app, dbId);
    } else {
      db = getFirestore(app);
    }
  } catch (err) {
    console.warn('[Firebase] Fallback to default getFirestore:', err);
    db = getFirestore(app);
  }
}

// Initialize Auth
let auth: Auth;
try {
  auth = getAuth(app);
} catch {
  auth = getAuth();
}

// Validate Connection to Firestore on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Firestore offline notice: Client is operating in local/offline cache mode.');
    }
  }
}
testConnection();

export const isFirebaseConfigured = (): boolean => {
  return Boolean(resolvedFirebaseConfig.apiKey && resolvedFirebaseConfig.projectId);
};

export { app, db, auth };
