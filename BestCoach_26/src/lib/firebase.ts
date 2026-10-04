import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "@/lib/firebase-config";

export const firebaseConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
].every(Boolean);
const isBrowser = typeof window !== "undefined";
const app = firebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth: Auth = isBrowser && app
  ? getAuth(app)
  : (null as unknown as Auth);
export const db: Firestore = isBrowser && app
  ? getFirestore(app)
  : (null as unknown as Firestore);
export const storage: FirebaseStorage | null = isBrowser && app
  ? getStorage(app)
  : null;