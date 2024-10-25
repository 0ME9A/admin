"use client";
import { useRouter } from "next/navigation";
import React from "react";

function Create() {
  const router = useRouter();

  return (
    <div
      className={
        "text-2xl bg-navy-800 border-2 border-navy-700 rounded-xl w-full text-center relative"
      }
    >
      <label htmlFor="newData" className="w-full h-full block p-10 py-24 rounded-xl cursor-pointer">Create New Data +</label>
      <button id="newData" className="hidden" onClick={()=> router.push("?action=create")}>Create New Data +</button>
    </div>
  );
}

export default Create;
