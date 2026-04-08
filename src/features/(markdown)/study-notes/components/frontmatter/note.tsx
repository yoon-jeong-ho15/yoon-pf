import Links from "./links";
import Tags from "./tags";

export default function NoteFrontmatter({
  label,
  value,
  isArray,
  iconNode,
}: {
  label: string;
  value: string | string[];
  isArray: boolean;
  iconNode: React.ReactNode;
}) {
  const isLink = label === "link";
  const isTags = label === "tags";

  return (
    <div
      className="flex flex-col gap-1 py-2 px-5 items-center justify-center divide-y border rounded-full text-xs bg-amber-100 shadow-gray-700 shadow-[2px_2px_0_1px] min-w-16 max-w-full"
    >
      <div
        className="min-w-10 flex items-center gap-1 w-full justify-start px-1 py-0.5"
      >
        {iconNode}
        <span className="text-[10px] capitalize">{label}</span>
      </div>
      <div className="w-full overflow-hidden">
        {isLink ? (
          <Links value={value as string[]} />
        ) : isTags ? (
          <Tags value={value as string[]} />
        ) : isArray ? (
          <ul className="flex w-full items-center gap-0.5">
            {(value as string[]).map((item: string, i: number) => (
              <li key={i} className="px-1 text-center whitespace-nowrap">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <span className="">{value}</span>
        )}
      </div>
    </div>
  );
}
