"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import { signOut } from "next-auth/react";
import { siteMap } from "@/data/sitemap";
import { useState } from "react";
import PrimaryBtn from "./buttons/PrimaryBtn";
import Link from "next/link";

function Sidebar() {
  const segment = useSelectedLayoutSegment();
  const [menuState, setMenuState] = useState(false);

  return (
    <>
      <button
        className="bg-red-500 hover:bg-red-600 p-2 rounded-full text-white fixed top-2 right-2 z-[11] sm:hidden"
        onClick={() => setMenuState(!menuState)}
        type="button"
        title="menu"
      >
        {menuState ? <HiMenuAlt3 /> : <IoCloseSharp />}
      </button>
      <div
        className={`bg-navy-900/90 text-white/75 h-full w-full sm:w-fit p-2 absolute sm:static z-10 duration-300 ${
          menuState ? "-left-full" : "left-0"
        }`}
      >
        <div className="py-2 flex justify-between items-center">
          <h1 className="font-bold text-lg text-white">Admin / 24x7 </h1>
        </div>
        <ul>
          {siteMap.map((item) => (
            <li key={item.id}>
              <Link
                href={`/admin${item.url}`}
                className={`p-2 px-4 flex justify-between items-center gap-4 capitalize rounded-full hover:bg-navy-800 hover:text-white ${
                  segment === item.id ||
                  (item.id === "home" && segment === null)
                    ? "bg-navy-800 text-white"
                    : ""
                }`}
              >
                {item.name}
                <span
                  className={`size-2 bg-accent-500 block rounded-full opacity-0 ${
                    segment === item.id ||
                    (item.id === "home" && segment === null)
                      ? "opacity-100"
                      : ""
                  }`}
                ></span>
              </Link>
            </li>
          ))}
        </ul>
        <PrimaryBtn className="w-full" onClick={() => signOut()}>
          Sign out
        </PrimaryBtn>
      </div>
    </>
  );
}

export default Sidebar;
