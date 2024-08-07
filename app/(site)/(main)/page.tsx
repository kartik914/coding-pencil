"use client";

import { auth, db } from "@/app/firebase/firebase.config";
import LoadingPage from "@/components/loading/loadingPage";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { sendEmailVerification, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const user: User = useSelector((state: any) => state.user.user);
  const [fetchedProjects, setFetchedProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (user) {
      const porjectQuery = query(
        collection(db, "Projects"),
        where("owner.email", "==", user.email),
        orderBy("id", "desc")
      );
      const unsubscribe = onSnapshot(porjectQuery, (querySnaps) => {
        const projectList = querySnaps.docs.map((doc) => doc.data());
        setProjects(
          projectList.map((project) => {
            return {
              id: project.id,
              title: project.title,
              owner: project.owner,
              html: project.html,
              css: project.css,
              js: project.js,
              private: project.private,
            };
          })
        );
        setFetchedProjects(true);
      });
    }
  }, [user]);

  const sendVarificationEmail = async () => {
    try {
      if (!user?.emailVerified) {
        sendEmailVerification(auth.currentUser!, {
          url: "https://coding-pencil.netlify.app/",
        });
        toast({
          title: "Success",
          description: "Varification email sent",
          variant: "default",
        });
      } else {
        toast({
          title: "Success",
          description: "Email already verified",
          variant: "default",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen h-screen">
      <Navbar>
        <div className="w-full relative">
          <IoSearch className="absolute left-2 top-3" />
          <Input
            type="text"
            placeholder="Search"
            className="w-full pl-10"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>
      </Navbar>
      <div className="w-full h-full p-8 pt-20 pb-12">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoadingPage />
          </div>
        ) : auth.currentUser?.emailVerified || false ? (
          <>
            <h1 className="text-2xl">Your Projects</h1>
            <hr />
            <div className="w-full h-full flex justify-center items-center">
              {projects.length > 0 ? (
                <div className="w-full h-full p-4 grid grid-flow-col grid-cols-4">
                  {projects.map((project, index) => {
                    if (
                      project.title
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    ) {
                      return (
                        <Link
                          href={`/project?id=${project.id}`}
                          className="w-min h-min"
                          key={index}
                        >
                          <div className="size-80 bg-gray-800 relative rounded-2xl overflow-hidden cursor-pointer">
                            <iframe
                              className="h-full w-full object-cover"
                              srcDoc={`
                                  <html>
                                  <head>
                                  </head>
                                  <style>
                                  ${project.css}
                                  </style>
                                  <body>
                                  ${project.html}
                                  <script>${project.js}</script>
                                  </body>
                                  </html>`}
                              scrolling="no"
                            ></iframe>
                            <div className="absolute bottom-0 p-4 flex flex-row gap-4 w-full h-min bg-slate-700">
                              <div className="size-12 bg-gray-600 flex justify-center items-center text-3xl rounded-xl">
                                <p>{project.title.charAt(0).toUpperCase()}</p>
                              </div>
                              <div className="">
                                <p>{project.title}</p>
                                <p className="text-sm">
                                  {project.owner.displayName}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-4 justify-center items-center">
                  <p className="text-lg">No Projects Found</p>
                  <div className="border p-4 rounded-lg">
                    <Link
                      href={"/project"}
                      onClick={() => setIsLoading(true)}
                      className=" flex justify-center items-center flex-row gap-4"
                    >
                      Create New Project
                      <FaPlus />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <p className="text-2xl">Verify Your Email</p>
            <p className="text-lg">
              Please verify your email to access your projects
            </p>
            <Button onClick={sendVarificationEmail} className="">
              Send Verification Email
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
