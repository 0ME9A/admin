import Breadcrumb from "@/components/Breadcrumb";
import Sidebar from "@/components/Sidebar";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh flex bg-navy-900 container mx-auto">
      <Sidebar />
      <div className={"p-2 w-full"}>
        <div className="p-2 w-full">
          <Breadcrumb />
        </div>
        {children}
      </div>
    </div>
  );
}

export default Layout;
