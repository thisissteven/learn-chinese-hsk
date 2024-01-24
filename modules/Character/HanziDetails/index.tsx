import * as React from "react";
import { HanziApiResponse } from "../types";
import { BASE_URL } from "@/pages/_app";
import { AudioButton } from "../AudioButton";
import clsx from "clsx";
import { Popover } from "@/components/Popover";
import DragToScrollWrapper from "@/components/DragToScrollWrapper";

export function HanziDetails({ definition, lessons }: HanziApiResponse) {
  // const [currentTab, setCurrentTab] = React.useState<"definition" | "related" | "idioms" | "lessons">("definition");
  const [entryIndex, setEntryIndex] = React.useState(0);
  const [currentLevel, setCurrentLevel] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (lessons.length > 0) {
      setEntryIndex(0);
      setCurrentLevel(lessons[0].lessonInfo.level.toLowerCase());
    }
  }, [lessons]);

  if (definition === null) return <div className="grid place-items-center h-full">Not found</div>;

  const currentEntry = definition.entries[entryIndex];
  const entryLength = definition.entries.length;

  const lessonLevelSet = new Set(lessons.map((lesson) => lesson.lessonInfo.level.toLowerCase()));
  const lessonLevels = Array.from(lessonLevelSet);

  const currentLesson = lessons.filter((lesson) => lesson.lessonInfo.level.toLowerCase() === currentLevel);

  const hanzi = definition.simplified;
  const pinyin = currentEntry.pinyin;
  const audioUrl = BASE_URL + `/api/audio/${encodeURI(hanzi)}?pinyin=${pinyin}`;

  return (
    <div className="overflow-y-auto flex-1 scrollbar-none py-4">
      <div className="space-y-2">
        <div className="flex items-end gap-2 px-4">
          <p className="text-6xl font-chinese">{definition.simplified}</p>
          <div>
            <AudioButton key={audioUrl} url={audioUrl} />
            <p className="font-medium">{currentEntry.pinyin}</p>
          </div>
        </div>
        {entryLength > 1 && (
          <div className="space-x-2 px-4">
            {definition.entries.map((_, index) => {
              return (
                <button
                  onClick={() => setEntryIndex(index)}
                  className={clsx(
                    "rounded-md px-4 text-sm py-0.5 border",
                    entryIndex === index ? "bg-white text-black border-white" : "border-softzinc"
                  )}
                  key={index}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        )}

        <HanziDefinition entry={currentEntry} />

        {lessonLevels.length > 1 && (
          <DragToScrollWrapper>
            {lessonLevels.map((level) => {
              return (
                <button
                  onClick={() => setCurrentLevel(level)}
                  className={clsx(
                    "rounded-md px-4 text-sm py-0.5 border",
                    currentLevel === level ? "bg-white text-black border-white" : "border-softzinc"
                  )}
                  key={level}
                >
                  {level}
                </button>
              );
            })}
          </DragToScrollWrapper>
        )}
        <ul className="relative space-y-2 px-4">
          {currentLesson.map((lesson, index) => {
            return (
              <li key={index} className="list-none">
                <div className="font-chinese">
                  <Popover>
                    <Popover.Trigger className="text-left">
                      {lesson.simplified}
                      <AudioButton size="small" key={lesson.audioUrl} url={lesson.audioUrl} />
                    </Popover.Trigger>
                    <Popover.Content
                      align="start"
                      className="text-xs leading-5 font-chinese text-white px-2 max-w-[calc(100vw-1rem)] md:max-w-[calc(540px-1rem)]"
                    >
                      <p>{lesson.pinyin}</p>
                    </Popover.Content>
                  </Popover>
                </div>
                <p className="text-sm text-gray">{lesson.english}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function HanziDefinition({ entry }: { entry: HanziApiResponse["definition"]["entries"][number] }) {
  return (
    <ul className="relative ml-8">
      {entry.definitions.map((definition, index) => {
        return (
          <li key={index} className="list-disc">
            {definition}
          </li>
        );
      })}
    </ul>
  );
}
