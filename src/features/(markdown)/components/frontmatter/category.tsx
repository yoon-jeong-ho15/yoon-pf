"use client";

import { useEffect, useRef, useState } from "react";
import Links from "./links";
import Tags from "./tags";

export default function CategoryFrontmatter({
  label,
  value,
  isArray,
  iconNode,
}: {
  label: string;
  value: any;
  isArray: boolean;
  iconNode: React.ReactNode;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowMeasure, setOverflowMeasure] = useState(0);

  const isLink = label === "link";
  const isTags = label === "tags";

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.scrollWidth;

        if (textWidth > containerWidth) {
          setIsOverflowing(true);
          setOverflowMeasure(textWidth - containerWidth);
        } else {
          setIsOverflowing(false);
        }
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [value]);

  return (
    <div className="flex min-w-50 max-w-80 gap-2 items-center py-1.5 px-2 divide-x text-xs rounded-lg bg-linear-to-tr from-white to-slate-100 shadow-[1px_1px_0px_1px] shadow-gray-600">
      <div className="min-w-10 flex items-center justify-center gap-1">
        {iconNode}
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden whitespace-nowrap group"
      >
        <div
          ref={textRef}
          className="inline-block transition-transform duration-600 ease-linear 
          group-hover:translate-x-(--hover-x)"
          style={
            isOverflowing
              ? ({
                  "--hover-x": `-${overflowMeasure}px`,
                } as React.CSSProperties)
              : {}
          }
        >
          {isLink ? (
            <Links value={value} type={"category"} />
          ) : isTags ? (
            <Tags value={value} type={"category"} />
          ) : isArray ? (
            <ul className="flex w-full items-center gap-1">
              {value.map((item: any, i: number) => (
                <li
                  key={i}
                  className="flex items-center justify-center px-1 py-0.5 whitespace-nowrap bg-sky-100 rounded"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <span>{value}</span>
          )}
        </div>
      </div>
    </div>
  );
}
