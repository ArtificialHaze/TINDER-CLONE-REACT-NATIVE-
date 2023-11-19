import React, { createContext, useContext, useMemo, useState } from "react";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";
import { useEffect } from "react";
import { auth } from "./firebase";

const AuthContext = createContext({});

const config = {
  androidClientId: "",
  iosClientId: "",
  scopes: ["", ""],
  permissions: ["", "", "", ""],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }

        setLoadingInitial(false);
      }),
    []
  );

  const logOut = () => {
    setIsLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);

    await Google.logInAsync(config)
      .then(async (loginResult) => {
        if (loginResult.type === "success") {
          const { idToken, accessToken } = loginResult;
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          await signInWithCredential(credential);
        }
        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  const memoValue = useMemo(
    () => ({
      user,
      isLoading,
      error,
      logOut,
      signInWithGoogle,
    }),
    [user, isLoading, error]
  );

  return (
    <AuthContext.Provider value={{ memoValue }}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
