// src/features/auth/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASl5rMwYdTVFFMf2Tvgy53ob4Zcw3czgI",
  authDomain: "netacheck-d4265.firebaseapp.com",
  projectId: "netacheck-d4265",
  storageBucket: "netacheck-d4265.appspot.com",
  messagingSenderId: "1061025694641",
  appId: "1:1061025694641:web:077c88add93f73b403f390",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
