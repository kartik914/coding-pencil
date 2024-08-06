"use client";

import { db } from "@/app/firebase/firebase.config";
import LoadingPage from "@/components/loading/loadingPage";
import Navbar from "@/components/navbar/navbar";
import { Input } from "@/components/ui/input";
import { User } from "firebase/auth";
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
import { useSelector } from "react-redux";

export default function Explore() {
  const user: User = useSelector((state: any) => state.user.user);
  const [fetchedProjects, setFetchedProjects] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (user) {
      const porjectQuery = query(
        collection(db, "Projects"),
        where("private", "==", false),
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
        ) : (
          <>
            <h1 className="text-2xl">Explore Projects</h1>
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
        )}
      </div>
    </main>
  );
}
