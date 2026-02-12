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
  return (
    <div
      className={`flex gap-2 items-center p-0.5 divide-x ${
        type === "note" ? "flex-col items-start gap-0 divide-x-0 divide-y" : ""
      }`}
    >
      <div
        className={`min-w-10 flex items-center justify-center gap-1 ${
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
          <span key={tag} className="px-2 py-1 underline">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
