import { LinkIcon } from "@heroicons/react/24/outline";
import { Category, Note } from "@/types";
import { getUrlMetadata } from "@/lib/metadata";
import { sortFrontmatter } from "../_lib/util";

type RendererConfig = {
  Component: (props: any) => React.ReactNode | Promise<React.ReactNode>;
  useCommonWrapper: boolean;
};

const CATEGORY_RENDERERS: Record<string, RendererConfig> = {
  title: { Component: Title, useCommonWrapper: false },
  link: { Component: Links, useCommonWrapper: true },
  instructor: { Component: Instructor, useCommonWrapper: true },

  chapter: { Component: () => null, useCommonWrapper: false },
};

const NOTE_RENDERERS: Record<string, RendererConfig> = {
  title: { Component: Title, useCommonWrapper: false },
  link: { Component: Links, useCommonWrapper: true },
  tags: { Component: Default, useCommonWrapper: true },
};

export function FrontmatterSection({
  data,
  type,
  parentData,
}: {
  data: Record<string, any>;
  type: "category" | "note";
  parentData?: any;
}) {
  const sorted = sortFrontmatter(data);

  return (
    <>
      {sorted.map(([key, value]) => {
        if (type === "category") {
          return (
            <CategoryField
              key={key}
              label={key}
              value={value}
              category={parentData}
            />
          );
        } else {
          return (
            <NoteField key={key} label={key} value={value} note={parentData} />
          );
        }
      })}
    </>
  );
}

export default function CategoryField({
  label,
  value,
  category,
}: {
  label: string;
  value: any;
  category: Category;
}) {
  const config = CATEGORY_RENDERERS[label];
  const Component = config?.Component || Default;
  const useCommonWrapper = config?.useCommonWrapper ?? true;

  if (useCommonWrapper) {
    return (
      <div className="mt-2 flex gap-2 text-sm text-gray-500">
        <span className="font-semibold min-w-20 capitalize">{label}:</span>
        <div className="flex-1">
          <Component value={value} category={category} />
        </div>
      </div>
    );
  }

  return <Component value={value} category={category} />;
}

export function NoteField({
  label,
  value,
  note,
}: {
  label: string;
  value: any;
  note: Note;
}) {
  const config = NOTE_RENDERERS[label];
  const Component = config?.Component || Default;
  const useCommonWrapper = config?.useCommonWrapper ?? true;

  if (useCommonWrapper) {
    return (
      <div className="mt-1 flex gap-2 text-xs text-gray-400">
        <span className="font-medium min-w-16 capitalize opacity-80">
          {label}:
        </span>
        <div className="flex-1">
          <Component value={value} className="text-gray-600" />
        </div>
      </div>
    );
  }

  return <Component value={value} className="" />;
}

export function Title({
  value,
  category,
  className = "",
}: {
  value: any;
  category?: Category;
  className?: string;
}) {
  if (!category)
    return <h1 className={`text-2xl font-bold ${className}`}>{value}</h1>;
  return (
    <h1 className={`text-xl font-bold mb-2 ${className}`}>
      <span className="mr-2 text-base">
        {category.frontmatter.chapter && `ch.${category.frontmatter.chapter}`}
      </span>
      {value as string}
    </h1>
  );
}

export async function Links({
  value,
  className = "",
}: {
  value: string[];
  className?: string;
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
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg hidden group-hover:flex flex-col z-20 overflow-hidden">
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

export function Instructor({
  value,
  className = "",
}: {
  value: string[];
  className?: string;
}) {
  return (
    <div className="flex items-center gap-2 group cursor-pointer relative w-fit">
      <div className="flex gap-1">
        {value.map((p, i) => (
          <div key={i} className="">
            {p}
          </div>
        ))}
      </div>

      <div className="absolute left-full ml-2 top-0 bg-white border border-gray-200 shadow-lg p-2 rounded hidden group-hover:block z-10 w-48 text-xs text-gray-700">
        <p className="font-bold mb-1">{String(value)}</p>
        <p>Click to see more notes from this instructor.</p>
      </div>
    </div>
  );
}

export function Default({
  value,
  className = "",
}: {
  value: any;
  className?: string;
}) {
  return (
    <span>
      {Array.isArray(value)
        ? value.join(", ")
        : typeof value === "object"
        ? JSON.stringify(value)
        : String(value)}
    </span>
  );
}
