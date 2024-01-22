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
      setCurrentLevel(lessons[0].lessonInfo.level);
    }
  }, [lessons]);

  const currentEntry = definition.entries[entryIndex];
  const entryLength = definition.entries.length;

  const lessonLevelSet = new Set(lessons.map((lesson) => lesson.lessonInfo.level));
  const lessonLevels = Array.from(lessonLevelSet);

  const currentLesson = lessons.filter((lesson) => lesson.lessonInfo.level === currentLevel);

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
                    "rounded-full px-4 text-sm py-0.5 border",
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
        <ul className="relative pl-4">
          {currentEntry.definitions.map((definition, index) => {
            return (
              <li key={index} className="list-disc">
                {definition}
              </li>
            );
          })}
        </ul>

        {lessonLevels.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {lessonLevels.map((level, index) => {
              return (
                <button
                  onClick={() => setCurrentLevel(level)}
                  className={clsx(
                    "rounded-full px-4 text-sm py-0.5 border",
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
        <ul className="relative pl-4">
          {currentLesson.map((lesson, index) => {
            return (
              <li key={index} className="list-disc">
                <div className="flex">
                  <p>{lesson.simplified}</p>
                  <AudioButton size="small" key={lesson.audioUrl} url={lesson.audioUrl} />
                </div>
                <p>{lesson.pinyin}</p>
                <p>{lesson.english}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
