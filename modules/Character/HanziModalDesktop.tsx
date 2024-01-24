import { useRouter } from "next/router";
import { SharedDialog } from "@/components/Dialog";
import { useDialogState } from "@/components/Dialog/hook";
import useSWRImmutable from "swr/immutable";
import * as React from "react";
import { LoadingBar } from "@/components/Loader";
import IdHanziMap from "@/data/id-hanzi-map.json";
import { LinkButton } from "@/components/LinkButton";
import { MarkAsCompleted, preloadHanziDetails } from "@/components/CharacterCard";
import { BASE_URL, useAudio } from "@/pages/_app";
import { HanziApiResponse } from "./types";
import { HanziDetails } from "./HanziDetails";
import { useCompletedCharacters, useCompletedCharactersActions } from "@/store";
import { LAST_VIEWED_HANZI_KEY } from "@/store/useLastViewedHanzi";

export type IdHanziMapKey = keyof typeof IdHanziMap;

export function HanziModalDesktop() {
  const router = useRouter();
  const hanzi = router.query.hanzi as IdHanziMapKey;

  React.useEffect(() => {
    if (typeof window !== "undefined" && hanzi) {
      localStorage.setItem(LAST_VIEWED_HANZI_KEY, hanzi);
    }
  }, [hanzi]);

  const currentHanziId = IdHanziMap[hanzi];
  const previousHanziId = (parseInt(currentHanziId) - 1).toString() as IdHanziMapKey;
  const nextHanziId = (parseInt(currentHanziId) + 1).toString() as IdHanziMapKey;

  const previousHanzi = currentHanziId == "1" ? undefined : IdHanziMap[previousHanziId];
  const nextHanzi = currentHanziId == "5000" ? undefined : IdHanziMap[nextHanziId];

  const dialogState = useDialogState();

  const { stopAudio } = useAudio();

  React.useEffect(() => {
    if (hanzi) {
      dialogState.onOpenChange(true);
    } else {
      dialogState.onOpenChange(false);
      stopAudio();
    }
  }, [dialogState, hanzi, stopAudio]);

  const { data, isLoading } = useSWRImmutable<HanziApiResponse>(
    hanzi ? `hanzi/${hanzi}` : null,
    async (url) => {
      const response = await fetch(`${BASE_URL}/api/${url}`);
      const data = await response.json();
      return data;
    },
    {
      keepPreviousData: true,
    }
  );

  const completedCharacters = useCompletedCharacters();
  const currentCompletedCharacters = data?.definition && !isLoading ? completedCharacters[data.definition.hsk] : null;
  const isCompleted = currentCompletedCharacters && currentCompletedCharacters.includes(parseInt(currentHanziId));

  const { addCompletedCharacters, removeCompletedCharacters } = useCompletedCharactersActions();

  return (
    <SharedDialog
      dialogState={{
        ...dialogState,
        onOpenChange(_) {
          router.push(`/hsk/${router.query.level}?page=${router.query.page}`, undefined, { shallow: true });
        },
      }}
    >
      <SharedDialog.Content className="h-full px-0 pt-4 flex flex-col pb-[72px]">
        <SharedDialog.MobilePan />

        {data && <HanziDetails {...data} />}

        <div className="absolute top-8 md:top-4 left-0 right-0 mx-4 bg-gradient-to-b from-black h-6"></div>
        <div className="absolute bottom-14 md:bottom-12 left-0 right-0 mx-4 bg-gradient-to-t from-black h-12"></div>

        {isLoading && (
          <div className="grid place-items-center absolute inset-0 bg-black/50 mb-8">
            {<LoadingBar className="scale-150" visible />}
          </div>
        )}

        <MarkAsCompleted
          className="absolute top-12 md:top-9 right-4 md:right-8 w-12 h-12"
          checkmarkClassName="w-8 h-8"
          isCompleted={Boolean(isCompleted)}
          onClick={() => {
            if (!data) return;
            if (isCompleted) {
              removeCompletedCharacters(data?.definition.hsk, parseInt(currentHanziId));
            } else {
              addCompletedCharacters(data?.definition.hsk, parseInt(currentHanziId));
            }
          }}
        />

        <div className="absolute flex gap-2 bottom-0 left-0 right-0 px-3 pb-3 md:px-4 md:pb-4">
          <LinkButton
            prefetch={false}
            onMouseEnter={() => {
              if (previousHanzi) preloadHanziDetails(previousHanzi);
            }}
            disabled={!previousHanzi}
            className="flex-1 shadow-none border-zinc text-white aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-white/50"
            href={`/hsk/${router.query.level}?hanzi=${previousHanzi}&page=${router.query.page}`}
            shallow
          >
            &#x2190; {previousHanzi}
          </LinkButton>
          <LinkButton
            prefetch={false}
            onMouseEnter={() => {
              if (nextHanzi) preloadHanziDetails(nextHanzi);
            }}
            disabled={!nextHanzi}
            className="flex-1 shadow-none border-zinc text-white aria-disabled:shadow-none aria-disabled:border-zinc aria-disabled:text-white/50"
            href={`/hsk/${router.query.level}?hanzi=${nextHanzi}&page=${router.query.page}`}
            shallow
          >
            {nextHanzi} &#x2192;
          </LinkButton>
        </div>
      </SharedDialog.Content>
    </SharedDialog>
  );
}
