import { TagIcon } from "@heroicons/react/24/outline";

export default function Tags({
  label,
  value,
  type,
}: {
  label: string;
  value: string[];
  type: "note" | "category";
}) {
  if (!value || value.length === 0) return null;

  return (
    <div
      className={`flex gap-2 items-center divide-x ${
        type === "note"
          ? "lg:flex-col items-start gap-0 divide-x-0 divide-y"
          : ""
      }`}
    >
      <div
        className={`min-w-12 flex items-center justify-center gap-1 ${
          type === "note" ? ":w-full justify-start px-1 py-0.5" : ""
        }`}
      >
        <TagIcon className="size-3 stroke-black" />
        {type === "note" && (
          <span className="text-[10px] capitalize">{label}</span>
        )}
      </div>
      <div>
        {value.map((tag) => (
          <p key={tag} className="px-2 py-1 underline inline-block">
            #{tag}
          </p>
        ))}
      </div>
    </div>
  );
}
