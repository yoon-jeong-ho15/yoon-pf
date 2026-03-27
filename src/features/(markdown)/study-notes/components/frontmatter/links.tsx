"use client";

import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { LinkMetadata } from "@/types";
import { useMetadata } from "@/components/provider/metadata-provider";
import { getDomainFromURL } from "@/features/(markdown)/utils/util";
import { HoverCard } from "@/components/ui/hover-card";

export default function Links({ value }: { value: string[] }) {
  const metadataMap = useMetadata();

  return (
    <ul className="flex w-full items-center gap-1">
      {value.map((url) => {
        const metaData = metadataMap?.[url];
        return <LinkItem key={url} url={url} metaData={metaData} />;
      })}
    </ul>
  );
}

function LinkItem({ url, metaData }: { url: string; metaData?: LinkMetadata }) {
  return (
    <li>
      <HoverCard
        content={metaData ? <LinkPreview metaData={metaData} /> : null}
      >
        <a
          href={url}
          target="_blank"
          title={metaData?.title || url}
          className="flex gap-1 rounded-lg py-1 px-1.5 bg-white hover:bg-mist-200 transition-colors items-center cursor-pointer"
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
      </HoverCard>
    </li>
  );
}

function LinkPreview({
  metaData,
}: {
  metaData: LinkMetadata;
}) {
  return (
    <div className="w-64 bg-white border border-gray-200 shadow-xl rounded-lg flex flex-col overflow-hidden">
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

  return (
    <span className="relative">
      <HoverCard
        content={metaData ? <LinkPreview metaData={metaData} /> : null}
      >
        <a
          href={url}
          className="text-orange-800 hover:underline"
          target="_blank"
        >
          {`"${getDomainFromURL(url)}"`}
        </a>
      </HoverCard>
      {!isLast && ","}
    </span>
  );
}
