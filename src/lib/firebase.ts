import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAJsEQBWs5FABInqsntQyeQYXUo4J66zao',
  authDomain: 'student360demo.firebaseapp.com',
  projectId: 'student360demo',
  storageBucket: 'student360demo.firebasestorage.app',
  messagingSenderId: '291605791186',
  appId: '1:291605791186:web:1f8c3e062b517d07a7480b',
  measurementId: 'G-W3DD2M0CPZ',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  const supported = await isSupported();
  return supported ? getAnalytics(firebaseApp) : null;
}
