import { Layout } from "@/modules/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { M_PLUS_Rounded_1c, Noto_Sans } from "next/font/google";
import React from "react";
import { SWRConfig } from "swr";

const font = M_PLUS_Rounded_1c({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });
const notoSans = Noto_Sans({ subsets: ["latin"] });

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: async (suffix) => {
          const response = await fetch(`${BASE_URL}/api/${suffix}`);
          const data = await response.json();
          return data;
        },
      }}
    >
      <style jsx global>{`
        :root {
          --font-sans: ${font.style.fontFamily};
          --font-chinese: ${notoSans.style.fontFamily};
        }
      `}</style>
      <AudioProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AudioProvider>
    </SWRConfig>
  );
}

type AudioContextValues = {
  playAudio: (url: string, onEnded?: () => void) => void;
  stopAudio: () => void;
};

const AudioContext = React.createContext({} as AudioContextValues);

export function useAudio() {
  return React.useContext(AudioContext);
}

function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  return (
    <AudioContext.Provider
      value={{
        playAudio: (url, onEnded) => {
          audioRef.current = new Audio(url);
          audioRef.current.play();

          if (onEnded) {
            audioRef.current.addEventListener("ended", onEnded);
          }
        },
        stopAudio: () => {
          audioRef.current?.pause();
        },
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
