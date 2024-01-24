import { Drawer as VaulDrawer } from "vaul";
import React from "react";

import { cn } from "@/utils/cn";

type DrawerProps = Parameters<typeof VaulDrawer.Root>[0];
type DrawerContentProps = Parameters<typeof VaulDrawer.Content>[0];

export function Drawer({ children, ...props }: DrawerProps) {
  return <VaulDrawer.Root {...props}>{children}</VaulDrawer.Root>;
}

function DrawerContent({ children, className, ...props }: DrawerContentProps) {
  return (
    <VaulDrawer.Portal>
      <VaulDrawer.Overlay className="fixed inset-0 bg-black/50 brightness-0" />
      <VaulDrawer.Content
        className={cn(
          "p-3 pt-4 focus:outline-none bg-black text-white rounded-t-[10px] fixed bottom-0 left-0 right-0",
          className
        )}
        {...props}
      >
        {children}
      </VaulDrawer.Content>
    </VaulDrawer.Portal>
  );
}

Drawer.Content = DrawerContent;

Drawer.Trigger = VaulDrawer.Trigger;

Drawer.Close = VaulDrawer.Close;

Drawer.MobilePan = function MobilePan() {
  return <div className="md:hidden mx-auto rounded-full h-1 w-8 bg-softzinc mb-3"></div>;
};
