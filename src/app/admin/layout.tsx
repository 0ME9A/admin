import Sidebar from "@/components/Sidebar";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border h-dvh flex">
      <Sidebar />
      {children}
    </div>
  );
}

export default Layout;
