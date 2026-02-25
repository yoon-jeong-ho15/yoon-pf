import Links from "./links";
import Tags from "./tags";

export default function NoteFrontmatter({
  label,
  value,
  isArray,
  Icon,
}: {
  label: string;
  value: any;
  isArray: boolean;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const isLink = label === "link";
  const isTags = label === "tags";

  return (
    <div
      className={`flex flex-col gap-1 py-2 px-5 items-center justify-center divide-y bg-white rounded-full text-xs
        shadow-gray-700 shadow-[2px_2px_0_1px]`}
    >
      <div
        className={`min-w-10 flex items-center gap-1 w-full justify-start px-1 py-0.5`}
      >
        <Icon className="size-3 stroke-black" />
        <span className="text-[10px] capitalize">{label}</span>
      </div>
      {isLink ? (
        <Links value={value} type={"note"} />
      ) : isTags ? (
        <Tags value={value} type={"note"} />
      ) : isArray ? (
        <ul className="flex w-full items-center gap-0.5 animate-text-slide">
          {value.map((item: any, i: number) => (
            <li key={i} className="px-1 text-center whitespace-nowrap">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <span className="flex-1 flex w-full items-center justify-center">
          {value}
        </span>
      )}
    </div>
  );
}
