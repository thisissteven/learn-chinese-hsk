import { Layout } from "@/modules/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { M_PLUS_Rounded_1c, Noto_Sans } from "next/font/google";
import React from "react";
import { SWRConfig } from "swr";

const font = M_PLUS_Rounded_1c({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });
const notoSans = Noto_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: async (suffix) => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${suffix}`);
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}
