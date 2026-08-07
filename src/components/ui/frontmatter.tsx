import * as React from "react";

import { cn } from "@/lib/utils";

const variantStyles = {
  note: {
    container: "bg-surface border border-muted rounded",
    labelWrapper: "shrink-0 whitespace-pre bg-tag-bg px-1",
    labelText: "text-tag-text",
    valueText: "",
  },
  review: {
    container: "border-b border-muted",
    labelWrapper: "after:content-[':'] after:ml-1",
    labelText: "",
    valueText: "",
  },
};

export interface FrontmatterItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | string[];
  variant: "note" | "review";
  layout?: "row" | "col" | "auto";
  renderCustomValue?: (value: string) => React.ReactNode;
}

export function FrontmatterItem({
  label,
  value,
  variant,
  layout = "auto",
  renderCustomValue,
  ...props
}: FrontmatterItemProps) {
  const items = Array.isArray(value) ? value : [value];
  const styles = variantStyles[variant];

  const renderAsCol =
    layout === "col" ||
    (layout === "auto" && variant !== "review" && items.length > 1);

  return (
    <div
      className={cn(
        "flex font-medium",
        renderAsCol
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
          renderAsCol ? "flex-col gap-1 pl-4" : "flex-wrap gap-x-2 gap-y-1",
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
