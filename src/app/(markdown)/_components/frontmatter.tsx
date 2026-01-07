import { getUrlMetadata } from "@/lib/metadata";
import { LinkIcon } from "@heroicons/react/24/outline";

const FIELD_RENDERERS: Record<
  string,
  React.FC<{ value: any; label?: string; type: "category" | "note" }>
> = {
  title: Title,
  link: Link,
};

export default function Frontmatter({
  type,
  label,
  value,
}: {
  type: "category" | "note";
  label: string;
  value: any;
}) {
  const Component = FIELD_RENDERERS[label] || Default;
  return <Component label={label} value={value} type={type} />;
}

function Title({ value, type }: { value: string; type: "category" | "note" }) {
  const className = {
    category: "text-xl",
    note: "text-lg",
  };

  return <h2 className={`font-bold mb-2 ${className[type]}`}>{value}</h2>;
}

async function Link({
  type,
  value,
}: {
  type: "category" | "note";
  value: string[];
}) {
  if (!value || value.length === 0) return null;

  const linksMetadata = await Promise.all(
    value.map(async (link) => {
      const metadata = await getUrlMetadata(link);
      return metadata;
    })
  );

  return (
    <div className="flex flex-wrap gap-2">
      {linksMetadata.map((meta, i) => (
        <div key={i} className="relative group">
          <a
            href={meta.url}
            target="_blank"
            className="block bg-gray-200 rounded p-1 hover:bg-gray-300 transition-colors"
          >
            <LinkIcon className="size-3" />
          </a>

          {/* 미리보기 카드*/}
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
              <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight mb-1">
                {meta.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {meta.description}
              </p>
              <div className="text-[10px] text-gray-400 truncate">
                {new URL(meta.url).hostname}
              </div>
            </div>
          </div>
        </div>
      ))}
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
      <div className="flex gap-2 text-sm text-gray-500">
        <span className="font-semibold capitalize">{label}:</span>
        <span>{String(value)}</span>
      </div>
    );
  }
  return (
    <div className="flex gap-2 text-xs text-gray-400">
      <span className="font-medium capitalize opacity-80">{label}:</span>
      <span className="text-gray-600">{String(value)}</span>
    </div>
  );
}
