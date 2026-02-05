import { LinkMetadata } from "@/lib/metadata";
import { LinkIcon } from "@heroicons/react/24/outline";

const FIELD_RENDERERS: Record<
  string,
  React.FC<{
    value: any;
    label?: string;
    type: "category" | "note";
    metadataMap?: Record<string, LinkMetadata>;
  }>
> = {
  chapter: Chapter,
  title: Title,
  link: Link,
};

export default function Frontmatter({
  type,
  label,
  value,
  metadataMap,
}: {
  type: "category" | "note";
  label: string;
  value: any;
  metadataMap?: Record<string, LinkMetadata>;
}) {
  const Component = FIELD_RENDERERS[label] || Default;
  return (
    <Component
      label={label}
      value={value}
      type={type}
      metadataMap={metadataMap}
    />
  );
}
function Chapter({
  value,
  type,
}: {
  value: string;
  type: "category" | "note";
}) {
  return <h2 className="mb-1 underline">chapter. {value}</h2>;
}

function Title({ value, type }: { value: string; type: "category" | "note" }) {
  const className = {
    category: "text-2xl",
    note: "text-3xl",
  };

  return <h2 className={`font-bold mb-2 ${className[type]}`}>{value}</h2>;
}

function Link({
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
    <div className="flex flex-wrap gap-2">
      {value.map((url, i) => {
        const meta = metadataMap?.[url];

        return (
          <div key={i} className="relative group">
            <a
              href={url}
              target="_blank"
              className="block bg-gray-200 rounded p-1 hover:bg-gray-300 transition-colors"
            >
              <LinkIcon className="size-3" />
            </a>

            {/* 미리보기 카드 (메타데이터가 있을 때만) */}
            {meta && (
              <div className="absolute top-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg hidden group-hover:flex flex-col z-20 overflow-hidden">
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
          </div>
        );
      })}
    </div>
  );
}

function Default({
  value,
  label,
  type,
}: {
  value: any;
  label?: string;
  type: "category" | "note";
}) {
  if (type === "category") {
    return (
      <div className="flex gap-2 text-sm">
        <span className="font-semibold capitalize">{label}:</span>
        <span>{String(value)}</span>
      </div>
    );
  }
  return (
    <div className="flex gap-2 text-xs">
      <span className="font-medium capitalize opacity-80">{label}:</span>
      <span className="">{String(value)}</span>
    </div>
  );
}
