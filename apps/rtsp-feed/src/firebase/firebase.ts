// import Firebase
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAgNT8ZSIaxKcY_rSwYkMTUgESxdduyQBU",
  authDomain: "test-18476.firebaseapp.com",
  databaseURL: "https://test-18476-default-rtdb.firebaseio.com",
  projectId: "test-18476",
  storageBucket: "test-18476.firebasestorage.app",
  messagingSenderId: "1003135702045",
  appId: "1:1003135702045:web:a8a9b6af410e56857462f4",
  measurementId: "G-MXK7MK2HFZ",
};

const app = initializeApp(firebaseConfig);
const firebaseDatabase = getDatabase(app);

export default firebaseDatabase;
