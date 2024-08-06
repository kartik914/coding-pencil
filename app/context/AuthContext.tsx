"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/app/firebase/firebase.config";

// User data type interface
interface UserType {
  email: string | null;
  uid: string | null;
}

// Create auth context
const AuthContext = createContext({});

// Make auth context available across the app by exporting it
export const useAuth = () => useContext<any>(AuthContext);

// Create the auth context provider
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Define the constants for the user and loading state
  const [user, setUser] = useState<UserType>({ email: null, uid: null });
  const [loading, setLoading] = useState<Boolean>(true);

  // Update the state depending on auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          email: user.email,
          uid: user.uid,
        });
      } else {
        setUser({ email: null, uid: null });
      }
    });

    setLoading(false);

    return () => unsubscribe();
  }, []);

  const signUp = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ status: number; data: User | null; message: string }> => {
    let status: number = 404;
    let data: User | null = null;
    let message: string = "";
    const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

    if (username === "" || email === "" || password === "") {
      status = 409;
      data = null;
      message = "Enter Valid Credentials";
      return { status, data, message };
    } else if (!regex.test(email)) {
      status = 409;
      data = null;
      message = "Enter a Valid Email";
      return { status, data, message };
    } else if (password.length < 6) {
      status = 409;
      data = null;
      message = "Password must be at least 6 characters";
      return { status, data, message };
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials: UserCredential) => {
          const user = userCredentials.user;
          updateProfile(user, {
            displayName: username,
          });
          status = 200;
          data = user;
          message = "User Created Successfully";
        })
        .catch((error) => {
          status = 409;
          data = null;
          message = error.message;
        });
    } catch (error: any) {
      status = 409;
      data = null;
      message = error.message;
    }

    return { status, data, message };
  };

  const logIn = async (
    email: string,
    password: string
  ): Promise<{ status: number; data: User | null; message: string }> => {
    let status: number = 404;
    let data: User | null = null;
    let message: string = "";
    const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

    if (email === "" || password === "") {
      status = 409;
      data = null;
      message = "invalid usernmame or password";
      return { status, data, message };
    } else if (!regex.test(email)) {
      status = 409;
      data = null;
      message = "Enter a Valid Email";
      return { status, data, message };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          console.log(userCredentials.user.emailVerified, "Varified");
          const user = userCredentials.user;
          status = 200;
          data = user;
          message = "User Logged In successfully";
        })
        .catch((error) => {
          status = 409;
          data = null;
          message = error.message;
        });
    } catch (error: any) {
      status = 409;
      data = null;
      message = error.message;
    }

    return { status, data, message };
  };

  // Logout the user
  const logOut = async () => {
    setUser({ email: null, uid: null });
    return await signOut(auth);
  };

  // Wrap the children with the context provider
  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
