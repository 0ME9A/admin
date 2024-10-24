"use client";
import { siteMap } from "@/data/sitemap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Sidebar() {
  const pathName = usePathname();
  console.log(pathName.split("/")[2]);
  return (
    <div className="bg-accent-500 h-full w-fit p-2">
      <ul>
        {siteMap.map((item) => (
          <li key={item.id}>
            <Link
              href={`/admin${item.url}`}
              className={`p-2 px-4 capitalize block rounded-full hover:bg-accent-600 ${pathName}`}
            >
              {item.name}
              {pathName.startsWith(`/admin${item.url}`)?"Y":"N"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
