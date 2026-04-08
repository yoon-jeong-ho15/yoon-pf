import * as React from "react";

import { cn } from "@/lib/utils";

export interface FrontmatterItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | string[];
  renderCustomValue?: (value: string) => React.ReactNode;
}

export function FrontmatterItem({
  label,
  value,
  renderCustomValue,
  className,
  ...props
}: FrontmatterItemProps) {
  const items = Array.isArray(value) ? value : [value];

  const renderAsArray =
    Array.isArray(value) &&
    (label.toLowerCase() === "link" || items.length > 1);

  return (
    <div
      className={cn(
        "flex font-medium",
        renderAsArray
          ? "flex-col items-start gap-1"
          : "flex-row items-start gap-2",
        className,
      )}
      {...props}
    >
      <div className="shrink-0 whitespace-pre bg-slate-200 px-1">
        <span className="text-blue-800">{label}</span>
      </div>

      <div
        className={cn(
          "flex",
          renderAsArray ? "flex-col gap-1 pl-4" : "flex-wrap gap-x-2 gap-y-1",
        )}
      >
        {items.map((item) => {
          return (
            <span key={item} className="flex whitespace-pre">
              {renderCustomValue ? (
                renderCustomValue(item)
              ) : (
                <span className="">{`${item}`}</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
