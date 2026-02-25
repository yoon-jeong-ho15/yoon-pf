"use client";

import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { LinkMetadata } from "../../lib/metadata";
import { useMetadata } from "../metadata-provider";

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

        return (
          <li key={url} className="relative group">
            <a
              href={url}
              target="_blank"
              title={metaData?.title || url}
              className="flex gap-1 rounded-lg py-1 px-1.5 bg-mist-200 hover:bg-white hover:outline outline-slate-600 transition-colors items-center"
            >
              <div className="size-3">
                {" "}
                {metaData.icon ? (
                  <img
                    src={metaData.icon}
                    alt={metaData.title || "Link icon"}
                  />
                ) : (
                  <AtSymbolIcon className="" />
                )}
              </div>
            </a>
            {metaData && <LinkPreview metaData={metaData} />}
          </li>
        );
      })}
    </ul>
  );
}

function LinkPreview({ metaData }: { metaData: LinkMetadata }) {
  return (
    <div
      className="absolute top-[130%] left-1/2 -translate-x-1/2 w-64 
                bg-white border border-gray-200 shadow-xl rounded-lg 
                hidden group-hover:flex flex-col z-20 overflow-hidden"
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
        <div className="text-[10px] truncate">
          {new URL(metaData.url).hostname}
        </div>
      </div>
    </div>
  );
}
