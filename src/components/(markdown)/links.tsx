"use client";

import { LinkMetadata } from "@/types";
import { useMetadata } from "@/hooks/useMetadata";
import { HoverPopupCard } from "@/components/ui/hover-popup-card";

function getDomainFromURL(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function LinkPreview({ metaData }: { metaData: LinkMetadata }) {
  return (
    <div className="w-64 bg-surface border border-muted shadow-xl rounded-lg flex flex-col overflow-hidden">
      {metaData.image && (
        <div className="w-full h-32 relative overflow-hidden bg-layout-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={metaData.image}
            alt={metaData.title || "Link preview"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <h4 className="font-bold text-sm line-clamp-2 leading-tight mb-1">
          {metaData.title || metaData.url}
        </h4>
        {metaData.description && (
          <p className="text-xs line-clamp-2 mb-2">{metaData.description}</p>
        )}
        <div className="text-[10px] truncate text-muted">
          {getDomainFromURL(metaData.url) || metaData.url}
        </div>
      </div>
    </div>
  );
}

export function LinkWithPreview({ url }: { url: string }) {
  const metaData = useMetadata(url);

  return (
    <span className="relative">
      <HoverPopupCard
        content={metaData ? <LinkPreview metaData={metaData} /> : null}
      >
        <a href={url} className="hover:underline" target="_blank">
          {getDomainFromURL(url) || url}
        </a>
      </HoverPopupCard>
    </span>
  );
}
