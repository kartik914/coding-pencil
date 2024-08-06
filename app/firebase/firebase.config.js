import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAX-6bdZTLLgm0E5p5nwfVUBlPX0dY8YWQ",
  authDomain: "coding-pencil.firebaseapp.com",
  projectId: "coding-pencil",
  storageBucket: "coding-pencil.appspot.com",
  messagingSenderId: "227610380213",
  appId: "1:227610380213:web:875d5f5fd8dfb4e4a17bfc",
  measurementId: "G-JWYKNC4DQN",
};

const firebase_app =
  getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebase_app);
const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);
const imageDb = getStorage(firebase_app);

export { firebase_app, auth, db, imageDb };

// Its amazing that nothing is discovered by doing things right
