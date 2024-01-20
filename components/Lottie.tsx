import React from "react";
import { LottieOptions, useLottie } from "lottie-react";
import { replaceColor } from "lottie-colorify";
import { preload } from "swr";
import useSWRImmutable from "swr/immutable";

export const animationDatas = {
  "progress-bar-splash": "lottie/2a62162ea93d55dee67189cc47bd98ab",
  "duo-loading": "vendor/fa3d16bb6533dc46e7703fe9dfe74d97",
} as const;

export const prefetchLottie = (id: keyof typeof animationDatas) => {
  preload(`lottie?id=${animationDatas[id]}`, async (suffix: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${suffix}`);
    const data = await response.json();
    return data;
  });
};

export function useLottieData(
  id: keyof typeof animationDatas,
  options: {
    color?: "blue" | "default";
  } & Omit<LottieOptions, "animationData"> = {
    color: "default",
  }
) {
  const { data } = useSWRImmutable(`lottie?id=${animationDatas[id]}`);

  const [animationData, setAnimationData] = React.useState(null);

  const { color, ...rest } = options;

  React.useEffect(() => {
    if (data) {
      switch (color) {
        case "blue":
          setAnimationData(replaceColor([255, 200, 0], [60, 77, 255], data));
          break;
        default:
          setAnimationData(data);
          break;
      }
    }
  }, [data, color]);

  const lottie = useLottie({
    animationData,
    ...rest,
  });

  return lottie;
}
