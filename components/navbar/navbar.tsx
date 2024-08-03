// components/Navbar.tsx
import React from "react";

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <nav className="w-full h-12 bg-[#15232d] p-4 flex flex-row fixed justify-between items-center">
      <div className="text-white text-xl">Logo</div>
      <div className="mt-4">{children}</div>
      <div className="flex space-x-4 text-white">Profile</div>
    </nav>
  );
};

export default Navbar;
