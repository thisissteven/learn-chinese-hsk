import Head from "next/head";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Learn 汉语水平考试 (HSK)</title>
      </Head>
      <main className="py-8 px-4 w-full">
        <h1 className="text-3xl font-semibold">Your Progress:</h1>

        <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-4">
          {Array(6)
            .fill(null)
            .map((_, i) => {
              return (
                <li key={i} className="w-full h-48 border-2 border-border shadow-b-small shadow-border rounded-lg">
                  <button
                    onClick={() => {
                      router.push(`/hsk/${i + 1}/page/1`);
                    }}
                    className="w-full h-full"
                  >
                    HSK {i + 1}
                  </button>
                </li>
              );
            })}
        </ul>
      </main>
    </>
  );
}
