// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCP26lOVBK6nDSqGPcafyUedGdFW9bpgJs",
  authDomain: "blocky-builds.firebaseapp.com",
  projectId: "blocky-builds",
  storageBucket: "blocky-builds.firebasestorage.app",
  messagingSenderId: "1065648120253",
  appId: "1:1065648120253:web:9a4465eb555afcbcea72d4",
  measurementId: "G-9920RZLL2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Initialize Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Expose sign in/out methods globally
window.signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    alert(`Signed in as ${user.displayName}`);
    console.log(user);
  } catch (error) {
    console.error("Sign-in error:", error);
  }
};

window.signOutUser = async () => {
  await signOut(auth);
  alert("Signed out");
};
