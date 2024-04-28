import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from '../firebase-config'

export const useAuth = () => {
    const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
};