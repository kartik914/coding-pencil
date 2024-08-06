"use client";

import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/context/ProtectedRoute";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logOut } = useAuth();
  const router = useRouter();

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
