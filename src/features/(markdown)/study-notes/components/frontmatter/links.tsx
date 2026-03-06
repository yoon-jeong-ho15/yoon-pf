"use client";

import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { LinkMetadata } from "../../../lib/metadata";
import { useMetadata } from "@/components/provider/metadata-provider";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { getDomainFromURL } from "@/features/(markdown)/utils/util";

export default function Links({
  type,
  value,
}: {
  type: "category" | "note";
  value: string[];
}) {
  const metadataMap = useMetadata();

  return (
    <ul className="flex w-full items-center gap-1">
      {value.map((url, i) => {
        const metaData = metadataMap?.[url];
        return <LinkItem key={url} url={url} metaData={metaData} />;
      })}
    </ul>
  );
}

function LinkItem({ url, metaData }: { url: string; metaData?: LinkMetadata }) {
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const linkRef = useRef<HTMLLIElement>(null);

  const handleMouseEnter = () => {
    if (linkRef.current) {
      setRect(linkRef.current.getBoundingClientRect());
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <li
      ref={linkRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <a
        href={url}
        target="_blank"
        title={metaData?.title || url}
        className="flex gap-1 rounded-lg py-1 px-1.5 bg-white hover:bg-mist-200  transition-colors items-center cursor-pointer"
      >
        <div className="size-3">
          {" "}
          {metaData?.icon ? (
            <img src={metaData.icon} alt={metaData.title || "Link icon"} />
          ) : (
            <AtSymbolIcon className="" />
          )}
        </div>
      </a>
      {isHovered &&
        rect &&
        metaData &&
        createPortal(
          <LinkPreview metaData={metaData} rect={rect} />,
          document.body,
        )}
    </li>
  );
}

function LinkPreview({
  metaData,
  rect,
}: {
  metaData: LinkMetadata;
  rect: DOMRect;
}) {
  return (
    <div
      className="fixed z-50 w-64 bg-white border border-gray-200 shadow-xl rounded-lg flex flex-col overflow-hidden pointer-events-none"
      style={{
        top: Math.min(rect.bottom + 8, window.innerHeight - 200),
        left: Math.max(
          0,
          Math.min(rect.left + rect.width / 2, window.innerWidth - 130),
        ),
        transform: "translateX(-50%)",
      }}
    >
      {metaData.image && (
        <div className="w-full h-32 relative overflow-hidden bg-gray-100">
          <img
            src={metaData.image}
            alt={metaData.title || "Link preview"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <h4 className="font-bold text-sm line-clamp-2 leading-tight mb-1">
          {metaData.title}
        </h4>
        <p className="text-xs line-clamp-2 mb-2">{metaData.description}</p>
        <div className="text-[10px] truncate text-gray-500">
          {new URL(metaData.url).hostname}
        </div>
      </div>
    </div>
  );
}

export function SidebarLink({ url, isLast }: { url: string; isLast: boolean }) {
  const metadataMap = useMetadata();
  const metaData = metadataMap?.[url];
  const [isHovered, setIsHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (linkRef.current) {
      setRect(linkRef.current.getBoundingClientRect());
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <span className="relative">
      <a
        ref={linkRef}
        href={url}
        className="text-orange-800 hover:underline"
        target="_blank"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {`"${getDomainFromURL(url)}"`}
      </a>
      {!isLast && ","}
      {isHovered &&
        rect &&
        metaData &&
        createPortal(
          <LinkPreview metaData={metaData} rect={rect} />,
          document.body,
        )}
    </span>
  );
}
