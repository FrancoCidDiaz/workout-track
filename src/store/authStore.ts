import { create } from "zustand";
import { signInWithGoogle, logout, auth } from "../firebaseConfig";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
}

interface AuthStore {
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}


export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    login: async () => {
      try {
        const user = await signInWithGoogle();
        if (user) {
            set({
                user: {
                    uid: user.uid,
                    email: user.email!,
                    displayName: user.displayName!,
                    photoURL: user.photoURL!,
                },
            });
        }
      } catch (error) {
        console.log("error al iniciar sesion con google:" , error)
      }
       
    },
    logout: async () => {
        await logout();
        set({ user: null });
    },
}));


onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      useAuthStore.setState({
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName!,
          photoURL: firebaseUser.photoURL!,
        },
      });
    } else {
      useAuthStore.setState({ user: null });
    }
  });