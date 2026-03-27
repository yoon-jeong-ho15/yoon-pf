import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    "bg-surface border border-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300";
  if (variant === "outline")
    variantStyles =
      "bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-900";
  if (variant === "ghost")
    variantStyles =
      "bg-transparent hover:bg-gray-100 text-gray-900 border border-transparent";

  let sizeStyles = "h-10 px-4 py-2";
  if (size === "sm") sizeStyles = "h-8 px-3 text-sm";
  if (size === "lg") sizeStyles = "h-11 px-8 text-lg";
  if (size === "icon")
    sizeStyles = "flex items-center justify-center p-0"; // Let custom width/height apply via className

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded transition-all focus:outline-none ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    />
  );
}
