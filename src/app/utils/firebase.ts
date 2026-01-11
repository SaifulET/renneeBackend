import admin from 'firebase-admin';
import config from '../config';

// Initialize Firebase Admin SDK
// Ideally, use GOOGLE_APPLICATION_CREDENTIALS env var, or load from file
if (!admin.apps.length) {
  try {
    if (config.firebase.service_account_path) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require(config.firebase.service_account_path);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

export default admin;
