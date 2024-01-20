import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";

import { Dialog, useDialog } from "@/components/Dialog";
import { HSKLevelItems } from "./HSKLevelItems";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useCompletedCharactersActions, useShowUncompletedOnly } from "@/store";

const levelToHanzi = (level: string) => {
  switch (level) {
    case "1":
      return "一";
    case "2":
      return "二";
    case "3":
      return "三";
    case "4":
      return "四";
    case "5":
      return "五";
    case "6":
      return "六";
    default:
      return "";
  }
};

function ShowUncompletedFirst() {
  const showUncompletedOnly = useShowUncompletedOnly();

  const { toggleSettings } = useCompletedCharactersActions();

  return null;

  return (
    <li>
      <label
        className={clsx(
          "active:bg-mossgreen/20 cursor-pointer transition rounded-md py-2 flex-1 font-medium px-4 md:px-2 flex justify-between gap-2",
          showUncompletedOnly ? "text-mossgreen" : "text-white/20 hover:text-mossgreen/60"
        )}
        htmlFor="uncompleted"
      >
        hide completed
        <div className="relative">
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 grid place-items-center transition active:scale-95 hover:opacity-100 rounded-md text-sm">
            <input
              className="peer absolute inset-0 opacity-0 w-full h-full"
              onChange={toggleSettings}
              checked={showUncompletedOnly}
              type="checkbox"
              id="uncompleted"
            />
            <svg
              className="h-5 w-5 peer-checked:text-mossgreen transition pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                pathLength="1"
                strokeDashoffset="0px"
                strokeDasharray="1px 1px"
              ></path>
            </svg>
          </div>
        </div>
      </label>
    </li>
  );
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const showSidebar = pathname !== "/";

  if (!showSidebar) return null;

  return (
    <aside className="pl-4 pt-4 max-md:hidden sticky top-4 h-fit min-w-64">
      <ul className="space-y-1">
        <HSKLevelItems />
        <ShowUncompletedFirst />
      </ul>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const showSidebar = pathname !== "/";

  const level = pathname.split("/")[2];

  if (!showSidebar) return null;

  return (
    <div className="md:hidden">
      <Dialog>
        <Dialog.Trigger asChild>
          <button className="w-14 h-14 active:translate-y-1 active:shadow-none shadow-b-small shadow-orange-200/70 border-2 border-orange-200/70 rounded-lg backdrop-blur-md bg-black text-orange-200 active:bg-black/40 font-medium">
            <div className="text-[10px] -mb-1">HSK</div>
            <div className="text-base font-chinese">{levelToHanzi(level)}</div>
          </button>
        </Dialog.Trigger>
        <Dialog.Content className="p-3">
          <Dialog.MobilePan />
          <aside className="relative h-fit">
            <ul className="space-y-2">
              <HSKLevelItems />
              <ShowUncompletedFirst />
            </ul>
          </aside>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

export function SidebarItem({
  href,
  children,
  isActive,
  rightItem,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  rightItem?: React.ReactNode;
}) {
  const { closeDialog } = useDialog();
  return (
    <li className="flex rounded-md md:rounded active:bg-softblack items-center gap-4 relative font-medium text-lg list-none">
      <ActiveIndicator isActive={isActive} />
      <Link
        className={clsx(
          "inline-block w-full transition pl-4 py-4",
          isActive ? "translate-x-0" : "md:-translate-x-2",
          !isActive && "opacity-50",
          !rightItem && "pr-4"
        )}
        onClick={closeDialog}
        href={href}
      >
        {children}
      </Link>
      {rightItem && <div className={clsx("transition pr-4", !isActive && "opacity-50")}>{rightItem}</div>}
    </li>
  );
}

const ActiveIndicator = React.memo(
  function ActiveIndicator({ isActive }: { isActive: boolean }) {
    if (!isActive) return null;

    return <motion.div layoutId="active" className="absolute -z-10 inset-0 rounded-md bg-zinc"></motion.div>;
  },
  (prev, curr) => prev.isActive === curr.isActive
);
