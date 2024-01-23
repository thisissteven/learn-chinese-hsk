import React from "react";
import { LinkButton } from "./LinkButton";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  canNextLevel: boolean;
  canPreviousLevel: boolean;
  previousHref: string;
  nextHref: string;
};

export default function Pagination({
  currentPage,
  canNextLevel,
  canPreviousLevel,
  totalPages,
  previousHref,
  nextHref,
}: PaginationProps) {
  return (
    <div className="max-sm:w-full flex justify-center items-center gap-2">
      <LinkButton
        prefetch={false}
        shallow={currentPage !== 1}
        href={previousHref}
        disabled={currentPage === 1 && !canPreviousLevel}
      >
        &#x2190;
      </LinkButton>

      <LinkButton
        prefetch={false}
        shallow={currentPage !== totalPages}
        href={nextHref}
        disabled={currentPage === totalPages && !canNextLevel}
      >
        &#x2192;
      </LinkButton>
    </div>
  );
}
