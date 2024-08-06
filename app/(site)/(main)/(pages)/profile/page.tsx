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
import Navbar from "@/components/navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateProfile, User } from "firebase/auth";
import { auth, db } from "@/app/firebase/firebase.config";
import { toast } from "@/components/ui/use-toast";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { setUser } from "@/app/redux/userSlice/userSlice";

export default function Auth() {
  const [username, setUsername] = useState("");
  const user: User = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
    }
  }, [user]);

  const handelSave = () => {
    if (user) {
      updateProfile(auth.currentUser!, {
        displayName: username,
      })
        .then(() => {})
        .catch((error) => {});
      toast({
        title: "Success",
        description: "Profile Updated",
        variant: "default",
      });

      const _user = auth.currentUser;
      if (_user) {
        setDoc(doc(db, "users", _user.uid), {
          ..._user.providerData?.[0],
          displayName: username,
        })
          .then(async (e) => {
            try {
              const q = query(
                collection(db, "Projects"),
                where("owner.email", "==", _user.email)
              );
              const querySnapshot = await getDocs(q);

              querySnapshot.forEach(async (document) => {
                const docRef = doc(db, "Projects", document.id);
                await updateDoc(docRef, {
                  "owner.displayName": username,
                });
              });
            } catch (error) {
              console.error("Error updating owner name: ", error);
            }
          })
          .then((e) => {
            dispatch(
              setUser({ ..._user.providerData?.[0], displayName: username })
            );
            // setIsLoading(false);
          });
      }
      // const unsubscribe = auth.onAuthStateChanged((userCred) => {
      //   if (userCred) {
      //   } else {
      //   }
      // });
      // return () => unsubscribe();
    }
  };

  return (
    <main className="w-full h-screen bg-[#15232d]">
      <Navbar></Navbar>
      <div className="w-full h-full flex justify-center items-center">
        <Card className="w-[380px] bg-[#193549] text-white border-[#122738]">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </CardContent>
          <CardFooter className="grid grid-flow-row gap-4">
            <Button
              className="w-full"
              onClick={(e) => {
                handelSave();
              }}
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
