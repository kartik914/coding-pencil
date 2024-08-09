"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sendEmailVerification, User } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, RadioTower, Telescope, User as UserImage } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/firebase.config";
import { removeUser } from "@/app/redux/userSlice/userSlice";
import { MdOutlineSendToMobile } from "react-icons/md";
import { toast } from "../ui/use-toast";
import { IoIosAdd } from "react-icons/io";

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.user.user);

  const logOutClick = async () => {
    await signOut(auth);
    dispatch(removeUser());
  };

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
    <nav className="w-full h-12 bg-[#15232d] p-4 py-8 flex flex-row fixed justify-between items-center shadow-xl">
      <Link href={"/"}>
        <div className="text-white text-xl whitespace-nowrap">
          Coding Pencil
        </div>
      </Link>
      <div className="w-full px-20 flex justify-start items-start">
        {children}
      </div>
      <div className="flex space-x-4 text-white">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={user?.photoURL || ""} alt="@shadcn" />
              <AvatarFallback className="bg-slate-600">
                {user?.displayName?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0) ||
                  "C"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          {auth.currentUser?.emailVerified && (
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Hi, {user?.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={"/project"}>
                  <DropdownMenuItem>
                    <IoIosAdd className="mr-2 h-4 w-4" />
                    <span>New Project</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={"/profile"}>
                  <DropdownMenuItem>
                    <UserImage className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* <DropdownMenuItem>
                  <RadioTower className="mr-2 h-4 w-4" />
                  <span>Live Coding</span>
                </DropdownMenuItem> */}
                <Link href={"/explore"}>
                  <DropdownMenuItem>
                    <Telescope className="mr-2 h-4 w-4" />
                    <span>Explore</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logOutClick()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
          {!auth.currentUser?.emailVerified && (
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Hi, {user?.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => sendVarificationEmail()}>
                <MdOutlineSendToMobile className="mr-2 h-4 w-4" />
                <span>Send Varification</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logOutClick()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
