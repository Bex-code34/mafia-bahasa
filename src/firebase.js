import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC93SoYV5IsdLnIriHFnSjPhlZDzG0zWyg",
  authDomain: "mafia-bahasa.firebaseapp.com",
  projectId: "mafia-bahasa",
  storageBucket: "mafia-bahasa.firebasestorage.app",
  messagingSenderId: "24067588620",
  appId: "1:24067588620:web:5ae5ee6c89cffdd11e2429",
  measurementId: "G-4JY5XRB2JV"
};

export const app = initializeApp(firebaseConfig);

export const analyticsPromise =
isSupported().then((yes) => {
  if (yes) {
    return getAnalytics(app);
  }

  return null;
});