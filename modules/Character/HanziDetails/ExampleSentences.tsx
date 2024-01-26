import DragToScrollWrapper from "@/components/DragToScrollWrapper";
import React from "react";
import { HanziApiResponse } from "../types";
import clsx from "clsx";
import { Popover } from "@/components/Popover";
import { AudioButton } from "../AudioButton";

export function ExampleSentences({ hanzi, lessons }: { hanzi: string; lessons: HanziApiResponse["lessons"] }) {
  const [currentLevel, setCurrentLevel] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (lessons.length > 0) {
      setCurrentLevel(lessons[0].lessonInfo.level.toLowerCase());
    }
  }, [lessons]);

  const lessonLevelSet = new Set(lessons.map((lesson) => lesson.lessonInfo.level.toLowerCase()));
  const lessonLevels = Array.from(lessonLevelSet);

  const currentLesson = lessons.filter((lesson) => lesson.lessonInfo.level.toLowerCase() === currentLevel);
  const regex = new RegExp(`(${hanzi})`);

  return (
    <>
      {lessonLevels.length > 1 && (
        <DragToScrollWrapper key={hanzi}>
          {lessonLevels.map((level) => {
            return (
              <button
                onClick={() => {
                  setCurrentLevel(level);
                }}
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
          const splitted = lesson.simplified.split(regex);

          return (
            <li key={index} className="list-none">
              <div className="font-chinese">
                <Popover>
                  <Popover.Trigger className="text-left sm:text-lg">
                    {splitted.map((part) => {
                      if (part === hanzi)
                        return (
                          <span className="text-wheat" key={part}>
                            {hanzi}
                          </span>
                        );
                      return part;
                    })}
                    <AudioButton size="small" key={lesson.audioUrl} url={lesson.audioUrl} />
                  </Popover.Trigger>
                  <Popover.Content
                    align="start"
                    className="text-xs sm:text-sm leading-5 font-chinese text-white px-2 max-w-[calc(100vw-1rem)] md:max-w-[calc(540px-1rem)]"
                  >
                    <p>{lesson.pinyin}</p>
                  </Popover.Content>
                </Popover>
              </div>
              <p className="text-sm sm:text-base text-gray">{lesson.english}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
