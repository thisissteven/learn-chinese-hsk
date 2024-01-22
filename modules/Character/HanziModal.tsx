import { useRouter } from "next/router";
import { SharedDialog } from "@/components/Dialog";
import { useDialogState } from "@/components/Dialog/hook";
import useSWRImmutable from "swr/immutable";
import * as React from "react";
import { LoadingBar } from "@/components/Loader";
import IdHanziMap from "@/data/id-hanzi-map.json";
import { Button } from "@/components/Button";
import { LinkButton } from "@/components/LinkButton";
import { preloadHanziDetails } from "@/components/CharacterCard";

type HanziApiResponse = {
  definition: Array<{
    simplified: string;
    pinyin: string;
    definition: string;
  }>;

  audioUrl: string;

  related: Array<{
    simplified: string;
    pinyin: string;
    definition: string;
  }>;

  idioms: Array<{
    simplified: string;
    pinyin: string;
    definition: string;
  }>;

  lessons: Array<{
    simplified: string;
    pinyin: string;
    english: string;
    audioUrl: string;
    lessonInfo: {
      level: string;
    };
  }>;
};

type IdHanziMapKey = keyof typeof IdHanziMap;

export function HanziModal() {
  const router = useRouter();
  const hanzi = router.query.hanzi as IdHanziMapKey;

  const currentHanziId = IdHanziMap[hanzi];
  const previousHanziId = (parseInt(currentHanziId) - 1).toString() as IdHanziMapKey;
  const nextHanziId = (parseInt(currentHanziId) + 1).toString() as IdHanziMapKey;

  const previousHanzi = currentHanziId == "1" ? undefined : IdHanziMap[previousHanziId];
  const nextHanzi = currentHanziId == "5000" ? undefined : IdHanziMap[nextHanziId];

  const dialogState = useDialogState();

  React.useEffect(() => {
    if (hanzi) {
      dialogState.onOpenChange(true);
    } else {
      dialogState.onOpenChange(false);
    }
  }, [dialogState, hanzi]);

  const { data, isLoading } = useSWRImmutable<HanziApiResponse>(hanzi ? `hanzi/${hanzi}` : null);

  return (
    <SharedDialog
      dialogState={{
        ...dialogState,
        onOpenChange(_) {
          router.push(`/hsk/${router.query.level}?page=${router.query.page}`, undefined, { shallow: true });
        },
      }}
    >
      <SharedDialog.Content className="p-4 h-[calc(100dvh-2rem)] border-t-2 md:border-2 border-orange-200/30 shadow-b-small shadow-orange-200/30 bg-black">
        <SharedDialog.MobilePan />
        {isLoading && (
          <div className="grid place-items-center w-full h-full">{<LoadingBar className="scale-150" visible />}</div>
        )}
        {data && <HanziDetails {...data} />}

        <div className="absolute  flex gap-2 bottom-0 left-0 right-0 p-3 md:p-4">
          <LinkButton
            onMouseEnter={() => {
              if (previousHanzi) preloadHanziDetails(previousHanzi);
            }}
            disabled={!previousHanzi}
            className="flex-1 shadow-orange-200/50 border-orange-200/50 text-orange-200/90"
            href={`/hsk/${router.query.level}?hanzi=${previousHanzi}&page=${router.query.page}`}
            shallow
          >
            &#x2190; {previousHanzi}
          </LinkButton>
          <LinkButton
            onMouseEnter={() => {
              if (nextHanzi) preloadHanziDetails(nextHanzi);
            }}
            disabled={!nextHanzi}
            className="flex-1 shadow-orange-200/50 border-orange-200/50 text-orange-200/90"
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

function HanziDetails({ definition }: HanziApiResponse) {
  return (
    <div>
      <p className="text-3xl">{definition[0].simplified}</p>
      <p className="font-medium">{definition[0].pinyin}</p>
      <p className="">{definition[0].definition}</p>
    </div>
  );
}
