import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ref,
  ...props
}: ButtonProps) {
  let variantStyles =
    "bg-surface border border-default hover:bg-hover-bg focus:ring-2 focus:ring-focus-ring";
  if (variant === "outline")
    variantStyles =
      "bg-transparent border border-muted hover:bg-hover-bg text-foreground";
  if (variant === "ghost")
    variantStyles =
      "bg-transparent hover:bg-hover-bg text-foreground border border-transparent";

  let sizeStyles = "h-10 px-4 py-2";
  if (size === "sm") sizeStyles = "h-8 px-3 text-sm";
  if (size === "lg") sizeStyles = "h-11 px-8 text-lg";
  if (size === "icon") sizeStyles = "flex items-center justify-center p-0"; // Let custom width/height apply via className

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded transition-all focus:outline-none",
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    />
  );
}
