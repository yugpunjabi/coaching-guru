// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjfyJ8lpW5Dyd3yuH-R9XdfYZVQ6L54Dg",
  authDomain: "projects-2025-f492f.firebaseapp.com",
  projectId: "projects-2025-f492f",
  storageBucket: "projects-2025-f492f.appspot.com",
  messagingSenderId: "340105311884",
  appId: "1:340105311884:web:baae7fd615e418ff276da9"
};

const app = initializeApp(firebaseConfig);

// ✅ Use getAuth and Firestore without persistence
export const auth = getAuth(app);
export const db = getFirestore(app);
