import React from "react";
import PrimaryLink from "./links/PrimaryLink";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  // Generate an array of page numbers
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <ul className="flex justify-center space-x-2 p-2">
      {/* Previous Button */}
      <li>
        <PrimaryLink
          href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
          className={`!py-1 !px-3 bg-transparent`}
        >
          Previous
        </PrimaryLink>
      </li>

      {/* Page Numbers */}
      {pages.map((page) => (
        <li key={page}>
          <PrimaryLink
            href={`?page=${page}`}
            className={`!py-1 !px-2 ${
              currentPage === page
                ? "bg-accent-500 text-white"
                : "bg-transparent"
            }`}
          >
            {page}
          </PrimaryLink>
        </li>
      ))}

      {/* Next Button */}
      <li>
        <PrimaryLink
          href={`?page=${
            currentPage < totalPages ? currentPage + 1 : totalPages
          }`}
          className={`!py-1 !px-3 bg-transparent`}
        >
          Next
        </PrimaryLink>
      </li>
    </ul>
  );
}

export default Pagination;
