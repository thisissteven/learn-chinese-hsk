import clsx from "clsx";
import * as React from "react";
import useSWRImmutable from "swr/immutable";

export function AudioButton({ url, size = "normal" }: { url: string; size?: "small" | "normal" }) {
  const { data, mutate } = useSWRImmutable<string | undefined>(url, () => undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <button
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        let audio;
        if (data) {
          audio = new Audio(data);
        } else {
          const response = await fetch(url);
          const blob = await response.blob();

          const objectURL = URL.createObjectURL(blob);

          mutate(objectURL, {
            revalidate: false,
          });

          audio = new Audio(objectURL);
        }

        audio.addEventListener("ended", () => {
          setIsLoading(false);
        });

        audio.play();
      }}
      className="opacity-50 disabled:opacity-100 active:opacity-100 transition"
    >
      <svg
        className={clsx(size === "small" && "w-5 h-5", size === "normal" && "w-6 h-6")}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  );
}
