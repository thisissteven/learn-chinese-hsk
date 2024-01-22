import { cn } from "@/utils/cn";
import Link, { LinkProps } from "next/link";

type LinkButtonProps = {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
} & LinkProps;

export function LinkButton({ disabled = false, className, children, ...rest }: LinkButtonProps) {
  return (
    <Link
      aria-disabled={disabled}
      className={cn(
        "select-none inline-block text-center max-sm:flex-1 bg-black active:bg-black/40 text-orange-200 rounded-lg px-6 py-3.5 font-medium active:shadow-none active:translate-y-1 shadow-b-small shadow-orange-200/70 border-2 border-orange-200/70 aria-disabled:pointer-events-none backdrop-blur-md aria-disabled:bg-softblack aria-disabled:text-orange-200/50 aria-disabled:shadow-orange-200/30 aria-disabled:border-orange-200/50",
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
