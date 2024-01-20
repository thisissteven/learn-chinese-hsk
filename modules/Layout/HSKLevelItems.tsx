import { CHARACTERS_PER_LEVEL, HSK_LEVELS, Level } from "@/data";
import { useCompletedCharacters } from "@/store";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./Sidebar";
import clsx from "clsx";
import ProgressBar from "@/components/ProgressBar";
import { useLastPage } from "@/store/useLastPage";
import { ResetButton } from "@/components/ResetButton";

export function HSKLevelItems() {
  const pathname = usePathname();
  const completedCharacters = useCompletedCharacters();

  return HSK_LEVELS.map((level) => {
    const isActive = pathname.includes(`/hsk/${level}`);

    const progress = completedCharacters[level].length / CHARACTERS_PER_LEVEL[level];
    const completedCount = completedCharacters[level].length;

    return (
      <HSKLevelItem key={level} completedCount={completedCount} progress={progress} isActive={isActive} level={level} />
    );
  });
}

function HSKLevelItem({
  level,
  completedCount,
  progress,
  isActive,
}: {
  level: Level;
  completedCount: number;
  progress: number;
  isActive: boolean;
}) {
  const totalCharacters = CHARACTERS_PER_LEVEL[level];
  const lastPage = useLastPage();

  return (
    <SidebarItem
      rightItem={<ResetButton disabled={progress === 0} level={level} />}
      key={level}
      isActive={isActive}
      href={`/hsk/${level}?page=${lastPage[level]}`}
    >
      <div className={clsx("flex items-center justify-between", progress === 1 && "text-orange-400")}>
        <span className={clsx("text-sm", progress === 1 && "text-yellow-500")}>HSK {level}</span>
        <span className="text-xs">
          <span className={clsx(progress === 0 && "text-red-500", progress > 0 && progress < 1 && "text-yellow-500")}>
            {completedCount}
          </span>{" "}
          / {totalCharacters}
        </span>
      </div>
      <div className="mt-0.5">
        <ProgressBar value={progress} />
      </div>
    </SidebarItem>
  );
}
