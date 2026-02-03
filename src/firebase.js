import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAYoZAOJyDIrzqSI9GufE_OMx1MvYUwgaQ",
    authDomain: "supia-nuria-dhakil-madra-a66fe.firebaseapp.com",
    projectId: "supia-nuria-dhakil-madra-a66fe",
    storageBucket: "supia-nuria-dhakil-madra-a66fe.firebasestorage.app",
    messagingSenderId: "70161410628",
    appId: "1:70161410628:web:a3cc506d08bc8a9fb02a11",
    measurementId: "G-F90JTPGP37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services globally
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
