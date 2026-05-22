import * as React from "react";

import { cn } from "@/lib/utils";

const variantStyles = {
  note: {
    container: "bg-surface border border-gray-500",
    labelWrapper: "shrink-0 whitespace-pre bg-slate-200 px-1",
    labelText: "text-blue-800",
    valueText: "",
  },
  review: {
    container: "border-b border-gray-400",
    labelWrapper: "after:content-[':'] after:ml-1",
    labelText: "",
    valueText: "",
  },
};

export interface FrontmatterItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | string[];
  variant: "note" | "review";
  renderCustomValue?: (value: string) => React.ReactNode;
}

export function FrontmatterItem({
  label,
  value,
  variant,
  renderCustomValue,
  ...props
}: FrontmatterItemProps) {
  const items = Array.isArray(value) ? value : [value];
  const styles = variantStyles[variant];

  const renderAsArray =
    Array.isArray(value) &&
    variant !== "review" &&
    (label.toLowerCase() === "link" || items.length > 1);

  return (
    <div
      className={cn(
        "flex font-medium",
        renderAsArray
          ? "flex-col items-start gap-1"
          : "flex-row items-start gap-2",
        styles.container,
      )}
      {...props}
    >
      <div className={styles.labelWrapper}>
        <span className={styles.labelText}>{label}</span>
      </div>

      <div
        className={cn(
          "flex",
          renderAsArray ? "flex-col gap-1 pl-4" : "flex-wrap gap-x-2 gap-y-1",
        )}
      >
        {items.map((item) => {
          return (
            <span
              key={item}
              className={cn("flex whitespace-pre", styles.valueText)}
            >
              {renderCustomValue ? (
                renderCustomValue(item)
              ) : (
                <span>{item}</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
