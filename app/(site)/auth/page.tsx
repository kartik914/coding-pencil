"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { auth, db } from "@/app/firebase/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { setUser } from "@/app/redux/userSlice/userSlice";
import LoadingPage from "@/components/loading/loadingPage";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { logIn, signUp } = useAuth();
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        setDoc(
          doc(db, "users", userCred?.uid),
          userCred?.providerData?.[0]
        ).then((e) => {
          dispatch(setUser(userCred?.providerData?.[0]));
          // setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    user && router.push("/");
  }, [user]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      logIn(email, password).then((data: any) => {
        if (data.status === 200) {
          router.push("/");
          toast({
            title: "Success",
            description: data.message,
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegistration = async (e: any) => {
    e.preventDefault();
    try {
      signUp(username, email, password).then((data: any) => {
        if (data.status === 200) {
          router.push("/");
          toast({
            title: "Success",
            description: data.message,
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
      .then((userCredentials) => {
        // window.location.reload();
        console.log("Google Auth");
        return 200;
      })
      .catch((error) => {
        console.error(error);
        return 400;
      });
  };

  return (
    <main className="w-full h-screen flex justify-center items-center bg-[#15232d]">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <Card className="w-[380px] bg-[#193549] text-white border-[#122738]">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              {isSignUp ? "Sign Up" : "Log In"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {isSignUp && (
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter className="grid grid-flow-row gap-4">
            <div className="text-xs flex gap-2 justify-end items-end">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <span
                className="text-blue-400 cursor-pointer"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </span>
            </div>
            <Button
              className="w-full"
              onClick={(e) => {
                isSignUp ? handleRegistration(e) : handleLogin(e);
              }}
            >
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
            <Button
              className="w-full flex flex-row gap-4"
              onClick={async () => await signInWithGoogle()}
            >
              <FaGoogle />
              Login With Google
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
