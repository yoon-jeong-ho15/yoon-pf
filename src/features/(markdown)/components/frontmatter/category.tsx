import Links from "./links";
import Tags from "./tags";

export default function CategoryFrontmatter({
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
    <div className="flex gap-2 items-center py-1.5 divide-x text-xs">
      <div className="min-w-10 flex items-center justify-center gap-1">
        <Icon className="size-3 stroke-black" />
      </div>
      {isLink ? (
        <Links value={value} type={"category"} />
      ) : isTags ? (
        <Tags value={value} type={"category"} />
      ) : isArray ? (
        <ul className="flex w-full items-center gap-0.5 animate-text-slide">
          {value.map((item: any, i: number) => (
            <li key={i} className="px-1 text-center whitespace-nowrap">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <span className="flex-1 w-full px-2">{value}</span>
      )}
    </div>
  );
}
