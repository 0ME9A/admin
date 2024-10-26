// components/Breadcrumb.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname(); // Get the current path
  const pathSegments = pathname.split("/").filter(Boolean); // Split and remove empty segments

  return (
    <nav aria-label="breadcrumb" className="flex space-x-2 text-gray-600">
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/"); // Build link for each segment
        const isLast = index === pathSegments.length;

        return (
          <code key={index} className="flex items-center lowercase">
            <Link href={href} className={isLast ? "" : "text-gray-200"}>
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Link>
            {!isLast && <code className="mx-2">/</code>}
          </code>
        );
      })}
    </nav>
  );
}
