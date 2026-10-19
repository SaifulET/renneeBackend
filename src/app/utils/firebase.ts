import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';
import config from '../config';

// Initialize Firebase Admin SDK
// Ideally, use GOOGLE_APPLICATION_CREDENTIALS env var, or load from file
if (!getApps().length) {
  try {
    if (config.firebase.service_account_path) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require(config.firebase.service_account_path);
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      initializeApp();
    }
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

const admin = {
  auth: () => getAuth(),
  messaging: () => getMessaging(),
};

export default admin;
