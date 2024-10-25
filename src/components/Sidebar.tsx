"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { siteMap } from "@/data/sitemap";
import Link from "next/link";
import React from "react";

function Sidebar() {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="bg-navy-900 text-white/75 h-full w-fit p-2">
      <ul>
        {siteMap.map((item) => (
          <li key={item.id}>
            <Link
              href={`/admin${item.url}`}
              className={`p-2 px-4 flex justify-between items-center gap-4 capitalize rounded-full hover:bg-navy-800 hover:text-white ${
                segment === item.id || (item.id === "home" && segment === null)
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
              {/* <span className={"p-2 bg-red-500"}></span> */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
