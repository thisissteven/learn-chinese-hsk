import type {
  InferGetStaticPropsType,
  GetStaticPaths,
  GetStaticPropsContext,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  GetServerSideProps,
} from "next";
import { promises as fs } from "fs";
import { CHARACTERS_PER_PAGE, ChineseCharacter, HSK_LEVELS, Level } from "@/data";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import Head from "next/head";
import { useCompletedCharacters, useCompletedCharactersActions } from "@/store";
import { CharacterCard } from "@/components/CharacterCard";
import { useLastPageActions } from "@/store/useLastPage";
import { MobileSidebar } from "@/modules/Layout/Sidebar";

async function getCharactersOnLevel(level: string | number) {
  const file = await fs.readFile(process.cwd() + getFilePath(level), "utf8");
  const characters: Array<ChineseCharacter> = JSON.parse(file);
  return characters;
}

const getFilePath = (level: string | number) => `/data/hsk-level-${level}.json`;

export const getServerSideProps = async ({ params, res }: GetServerSidePropsContext) => {
  res.setHeader("Cache-Control", "public, s-maxage=86400, must-revalidate");

  const level = params?.level as string;

  const allCharacters = await getCharactersOnLevel(level);
  const allPreviousLevelCharacters = await getCharactersOnLevel(parseInt(level) - 1 ? parseInt(level) - 1 : 1);

  const totalPages = Math.ceil(allCharacters.length / CHARACTERS_PER_PAGE);
  const previousLevelTotalPages = Math.ceil(allPreviousLevelCharacters.length / CHARACTERS_PER_PAGE);
  const currentLevel = parseInt(level) as Level;

  return {
    props: {
      allCharacters,
      totalPages,
      previousLevelTotalPages,
      currentLevel,
      hasPreviousLevel: currentLevel > 1,
      hasNextLevel: currentLevel < 6,
    },
  };
};

function usePagination({
  allCharacters,
  totalPages,
  currentLevel,
  previousLevelTotalPages,
  hasPreviousLevel,
  hasNextLevel,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const searchParams = useSearchParams();

  const currentPage = searchParams.get("page") ?? "1";

  const { updateLastPage } = useLastPageActions();

  React.useEffect(() => {
    if (currentPage) {
      updateLastPage(currentLevel, currentPage);
    }
  }, [currentLevel, currentPage, updateLastPage]);

  const characters = React.useMemo(() => {
    return allCharacters.slice(
      (parseInt(currentPage) - 1) * CHARACTERS_PER_PAGE,
      parseInt(currentPage) * CHARACTERS_PER_PAGE
    );
  }, [allCharacters, currentPage]);

  const canNextLevel = Boolean(currentPage && parseInt(currentPage) === totalPages && hasNextLevel);
  const canPreviousLevel = Boolean(currentPage && parseInt(currentPage) === 1 && hasPreviousLevel);

  const previousHref = canPreviousLevel
    ? `/hsk/${currentLevel - 1}?page=${previousLevelTotalPages}`
    : `/hsk/${currentLevel}?page=${parseInt(currentPage) - 1}`;

  const nextHref = canNextLevel ? `/hsk/${currentLevel + 1}` : `/hsk/${currentLevel}?page=${parseInt(currentPage) + 1}`;

  return {
    characters,
    currentPage: parseInt(currentPage),
    canNextLevel,
    canPreviousLevel,
    previousHref,
    nextHref,
  };
}

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [flippedCard, setFlippedCard] = React.useState<number | null>(null);

  const ref = React.useRef<HTMLDivElement>(null);

  const { characters, currentPage, canNextLevel, canPreviousLevel, previousHref, nextHref } = usePagination(props);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [characters]);

  const title = `HSK ${props.currentLevel} Page ${currentPage}`;

  const { addCompletedCharacters, removeCompletedCharacters, hydrateSettings, hydrateCompletedCharacters } =
    useCompletedCharactersActions();

  const completedCharacters = useCompletedCharacters();
  const currentCompletedCharacters = completedCharacters[props.currentLevel];

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      hydrateCompletedCharacters();
      hydrateSettings();
    }
  }, [hydrateCompletedCharacters, hydrateSettings]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="relative w-full">
        <div ref={ref} className="w-full h-dvh overflow-y-auto scrollbar">
          <div className="px-4 sm:pr-8 py-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4">
            {characters.map((character) => {
              const isCompleted = currentCompletedCharacters.includes(character.id);
              return (
                <CharacterCard
                  isFlipped={flippedCard === character.id}
                  isCompleted={currentCompletedCharacters.includes(character.id)}
                  onCompleteToggle={() => {
                    if (isCompleted) {
                      removeCompletedCharacters(props.currentLevel, character.id);
                    } else {
                      addCompletedCharacters(props.currentLevel, character.id);
                    }
                  }}
                  onFlip={() => {
                    if (flippedCard === character.id) {
                      setFlippedCard(null);
                      return;
                    }
                    setFlippedCard(character.id);
                  }}
                  key={character.id}
                  {...character}
                />
              );
            })}
          </div>
        </div>
        <div className="fixed md:absolute w-full sm:right-4 px-2 bottom-2 flex justify-end mt-8 gap-2">
          <MobileSidebar />

          <Pagination
            currentPage={currentPage}
            totalPages={props.totalPages}
            canNextLevel={canNextLevel}
            canPreviousLevel={canPreviousLevel}
            previousHref={previousHref}
            nextHref={nextHref}
          />
        </div>
      </div>
    </>
  );
}
