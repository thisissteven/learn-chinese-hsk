import * as RadixDialog from "@radix-ui/react-dialog";
import React from "react";

import { cn } from "@/utils/cn";
import { DialogStateReturnType } from "./hook";

type DialogContextProps = {
  overlayRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  closeDialog: () => void;
};

const DialogContext = React.createContext({} as DialogContextProps);

function useSharedDialog() {
  return React.useContext(DialogContext);
}

type DialogProps = {
  children: React.ReactNode;
  dialogState: DialogStateReturnType;
};

export function SharedDialog({ children, dialogState: { open, onOpenChange, overlayRef, contentRef } }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContext.Provider
        value={{
          overlayRef,
          contentRef,
          closeDialog: () => onOpenChange(false),
        }}
      >
        {children}
      </DialogContext.Provider>
    </RadixDialog.Root>
  );
}

type DialogContentProps = {
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  canEscape?: boolean;
};

function SharedDialogContent({ children, className, overlayClassName, canEscape = true }: DialogContentProps) {
  const { overlayRef, closeDialog, contentRef } = useSharedDialog();

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        ref={overlayRef}
        data-dialog-overlay
        data-dialog-state="initial"
        className={cn("fixed inset-0 z-30 w-full h-full bg-black/50 brightness-0", overlayClassName)}
      />
      <RadixDialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          if (canEscape) closeDialog();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          if (canEscape) closeDialog();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          if (canEscape) closeDialog();
        }}
        ref={contentRef}
        data-dialog-content
        data-dialog-state="initial"
        className={cn(
          "fixed z-30 md:top-1/2 left-1/2 shadow-md focus:outline-none",
          "overflow-y-auto scrollbar bg-black text-white",

          // default
          "w-full rounded-md max-h-[80dvh]",

          // desktop styles override
          "md:w-[calc(100%-2rem)] md:max-w-[540px]",
          "md:[--scale-from:0.96] md:[--scale-to:1]",
          "md:[--y-from:-48%] md:[--y-to:-50%]",

          // mobile styles override
          "max-md:[--y-from:100%] max-md:[--y-to:0%]",
          "max-md:bottom-0 max-md:rounded-t-lg max-md:rounded-b-none",
          className
        )}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

SharedDialog.Content = SharedDialogContent;

SharedDialog.Trigger = RadixDialog.Trigger;

SharedDialog.Close = RadixDialog.Close;

SharedDialog.MobilePan = function MobilePan() {
  return <div className="md:hidden mx-auto rounded-full h-1 w-8 bg-softzinc mb-3"></div>;
};
