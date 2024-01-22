import * as React from "react";
import { HanziApiResponse } from "../types";
import { BASE_URL } from "@/pages/_app";
import { AudioButton } from "../AudioButton";
import clsx from "clsx";

export function HanziDetails({ definition, lessons }: HanziApiResponse) {
  const [currentTab, setCurrentTab] = React.useState<"definition" | "related" | "idioms" | "lessons">("definition");
  const [entryIndex, setEntryIndex] = React.useState(0);
  const [currentLevel, setCurrentLevel] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (lessons.length > 0) {
      setCurrentLevel(lessons[0].lessonInfo.level.toLowerCase());
    }
  }, [lessons]);

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
        <div className="flex items-end gap-2">
          <p className="text-6xl">{definition.simplified}</p>
          <div>
            <AudioButton key={audioUrl} url={audioUrl} />
            <p className="font-medium">{currentEntry.pinyin}</p>
          </div>
        </div>
        {entryLength > 1 && (
          <div className="space-x-2">
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
          <div className="flex flex-wrap gap-2">
            {lessonLevels.map((level, index) => {
              return (
                <button
                  onClick={() => setCurrentLevel(level)}
                  className={clsx(
                    "rounded-md px-4 text-sm py-0.5 border",
                    currentLevel === level ? "bg-white text-black border-white" : "border-softzinc"
                  )}
                  key={index}
                >
                  {level}
                </button>
              );
            })}
          </div>
        )}
        <ul className="relative space-y-2">
          {currentLesson.map((lesson, index) => {
            return (
              <li key={index} className="list-none">
                <div>
                  {lesson.simplified}
                  <AudioButton size="small" key={lesson.audioUrl} url={lesson.audioUrl} />
                </div>
                {/* <p className="text-sm text-gray">{lesson.pinyin}</p> */}
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
    <ul className="relative pl-4">
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
