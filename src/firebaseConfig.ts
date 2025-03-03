// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA-sxykPTSW8oRfPpGAJ71Nqn57QB1SZxw",
    authDomain: "workout-track-54fed.firebaseapp.com",
    projectId: "workout-track-54fed",
    storageBucket: "workout-track-54fed.firebasestorage.app",
    messagingSenderId: "1099186710374",
    appId: "1:1099186710374:web:ea3b56e1a772e0a2990aa7",
    measurementId: "G-415WKJVC1E"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


const signInWithGoogle = async () => {
 
  try {
    console.log("Intentando abrir el pop-up...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Usuario autenticado:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error al autenticar con Google:", error);
    return null;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("Cierre de sesión exitoso");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export { auth, signInWithGoogle, logout };
