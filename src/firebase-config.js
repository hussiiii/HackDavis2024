import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyDisYxJmBfM2fW0WeL-Cr2HQ0IotOAcJe8",
  authDomain: "aggiehouse-2b485.firebaseapp.com",
  projectId: "aggiehouse-2b485",
  storageBucket: "aggiehouse-2b485.appspot.com",
  messagingSenderId: "878953083839",
  appId: "1:878953083839:web:ae80806b578cf06290e70a",
  measurementId: "G-LW2T3HG2HX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };