import { LinkMetadata } from "@/features/(markdown)/lib/metadata";
import { LinkIcon } from "@heroicons/react/24/outline";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
export default function Link({
  type,
  value,
  metadataMap,
}: {
  type: "category" | "note";
  value: string[];
  metadataMap?: Record<string, LinkMetadata>;
}) {
  if (!value || value.length === 0) return null;

  return (
    <h2
      className={`flex gap-2 items-center rounded-full m-0.5 p-0.5 divide-x
        bg-white/30 `}
    >
      <div className="w-10 flex justify-center">
        <LinkIcon className="size-3" />
      </div>

      <ul className="flex-1 flex gap-1 items-center">
        {value.map((url, i) => {
          const meta = metadataMap?.[url];

          return (
            <li key={i} className="relative group">
              <a
                href={url}
                target="_blank"
                className="block bg-gray-100/50 rounded p-0.5 hover:bg-gray-200 transition-colors"
              >
                <AtSymbolIcon className="size-3" />
              </a>

              {/* 미리보기 카드 (메타데이터가 있을 때만) */}
              {meta && (
                <div
                  className="absolute top-[130%] left-1/2 -translate-x-1/2 w-64 
                bg-white border border-gray-200 shadow-xl rounded-lg 
                hidden group-hover:flex flex-col z-20 overflow-hidden"
                >
                  {meta.image && (
                    <div className="w-full h-32 relative overflow-hidden bg-gray-100">
                      <img
                        src={meta.image}
                        alt={meta.title || "Link preview"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-bold text-sm line-clamp-2 leading-tight mb-1">
                      {meta.title}
                    </h4>
                    <p className="text-xs line-clamp-2 mb-2">
                      {meta.description}
                    </p>
                    <div className="text-[10px] truncate">
                      {new URL(meta.url).hostname}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </h2>
  );
}
