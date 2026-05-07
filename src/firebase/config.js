import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDzxKiJjje75-dNMqxE8GeCIPtzFBxNDjk",
  authDomain: "pg-management-f81ff.firebaseapp.com",
  projectId: "pg-management-f81ff",
  storageBucket: "pg-management-f81ff.firebasestorage.app",
  messagingSenderId: "938444752740",
  appId: "1:938444752740:web:dfef203c7ef55fc461dc71",
  measurementId: "G-HW2BLJXW6M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
