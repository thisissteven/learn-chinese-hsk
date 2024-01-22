import { ChineseCharacter } from "@/data";
import { BASE_URL } from "@/pages/_app";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { preload } from "swr";

export async function preloadHanziDetails(hanzi: string) {
  await preload(`hanzi/${hanzi}`, async (url) => {
    const response = await fetch(`${BASE_URL}/api/${url}`);
    const data = await response.json();
    return data;
  });
}

export function CharacterCard({
  id,
  hanzi,
  pinyin,
  translations,
  isFlipped,
  isCompleted,
  hanziHref,
  onFlip,
  onCompleteToggle,
}: ChineseCharacter & {
  hanziHref: string;
  isCompleted: boolean;
  onCompleteToggle: () => void;
  onFlip: () => void;
  isFlipped: boolean;
}) {
  return (
    <>
      <style jsx>{`
        .card {
          transition: transform 0.5s;
          transform-style: preserve-3d;
        }

        .card-flipped {
          transform: rotateY(180deg);
        }

        .card-content {
          -webkit-backface-visibility: hidden; /* Safari */
          backface-visibility: hidden;
        }

        .text-flipped {
          transform: rotateY(180deg);
        }
      `}</style>
      <div onClick={onFlip} className="select-none font-chinese text-3xl aspect-square">
        <div className={clsx("relative w-full h-full card", isFlipped && "card-flipped")}>
          <div
            className={clsx(
              "card-content has-[input:active]:scale-[98%] transition absolute inset-0 border-2 shadow-b-small rounded-lg grid place-items-center bg-softblack",
              isCompleted ? "border-mossgreen shadow-mossgreen text-wheat" : "border-border shadow-border"
            )}
          >
            <div className="relative">
              {hanzi}

              <div
                className={clsx(
                  "absolute top-6 left-1/2 -translate-x-1/2 transition",
                  isCompleted ? "opacity-100" : "opacity-0"
                )}
              >
                {isCompleted && (
                  <Link
                    onMouseEnter={() => preloadHanziDetails(hanzi)}
                    onClick={(e) => e.stopPropagation()}
                    className="whitespace-nowrap text-sm hover:underline underline-offset-[3px]"
                    href={hanziHref}
                    shallow
                  >
                    view details
                  </Link>
                )}
              </div>
            </div>

            <MarkAsCompleted isCompleted={isCompleted} onClick={onCompleteToggle} />

            <div className="absolute right-4 bottom-4 text-sm">{id}</div>
          </div>
          <div
            className={clsx(
              "card-content absolute inset-0 border-2 shadow-b-small rounded-lg bg-softblack flex flex-col items-center justify-center text-flipped px-4",
              isCompleted ? "border-mossgreen shadow-mossgreen text-wheat" : "border-border shadow-border"
            )}
          >
            <div className="text-2xl">{pinyin}</div>
            <div className="text-sm text-center">{translations.join(", ")}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function MarkAsCompleted({ isCompleted, onClick }: { isCompleted: boolean; onClick: () => void }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={clsx(
        "absolute right-4 top-4 w-8 h-8 grid place-items-center transition active:scale-95 hover:opacity-100 rounded-md text-sm",
        !isCompleted && "active:bg-mossgreen/10"
      )}
    >
      <input
        checked={isCompleted}
        onChange={onClick}
        type="checkbox"
        className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Checkmark />
    </div>
  );
}

export function Checkmark() {
  return (
    <svg
      className="h-6 w-6 text-white/20 peer-active:text-mossgreen/50 peer-checked:text-mossgreen transition pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
        pathLength="1"
        strokeDashoffset="0px"
        strokeDasharray="1px 1px"
      ></path>
    </svg>
  );
}
