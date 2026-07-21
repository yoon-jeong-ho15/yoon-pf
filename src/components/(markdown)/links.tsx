"use client";

import { LinkMetadata } from "@/types";
import { useMetadata } from "@/components/provider/metadata-provider";
import { getDomainFromURL } from "@/lib/frontmatter";
import { HoverCard } from "@/components/ui/hover-card";

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
          {metaData.title}
        </h4>
        <p className="text-xs line-clamp-2 mb-2">{metaData.description}</p>
        <div className="text-[10px] truncate text-muted">
          {new URL(metaData.url).hostname}
        </div>
      </div>
    </div>
  );
}

export function SidebarLink({ url }: { url: string }) {
  const metadataMap = useMetadata();
  const metaData = metadataMap?.[url];

  return (
    <span className="relative">
      <HoverCard
        content={metaData ? <LinkPreview metaData={metaData} /> : null}
      >
        <a href={url} className="hover:underline" target="_blank">
          {`${getDomainFromURL(url)}`}
        </a>
      </HoverCard>
    </span>
  );
}
