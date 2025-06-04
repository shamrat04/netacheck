// src/features/auth/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASl5rMwYdTVFFMf2Tvgy53ob4Zcw3czgI",
  authDomain: "netacheck-d4265.firebaseapp.com",
  projectId: "netacheck-d4265",
  storageBucket: "netacheck-d4265.appspot.com", // ✅ FIXED
  messagingSenderId: "1061025694641",
  appId: "1:1061025694641:web:cc74dfa5829160a503f390"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
