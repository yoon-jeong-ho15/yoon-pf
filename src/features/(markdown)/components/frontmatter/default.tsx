import {
  CalendarIcon,
  HashtagIcon,
  TagIcon,
  UserIcon,
  BuildingLibraryIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

const ICON_MAP: Record<string, React.ElementType> = {
  category: BookmarkIcon,
  order: HashtagIcon,
  date: CalendarIcon,
  author: UserIcon,
  instructor: UserIcon,
  tags: TagIcon,
  provide: BuildingLibraryIcon,
  publish: BookOpenIcon,
};

export default function Default({
  value,
  label,
  type,
}: {
  value: any;
  label: string;
  type: "category" | "note";
}) {
  const Icon = ICON_MAP[label] || QuestionMarkCircleIcon;
  const isArray = Array.isArray(value) && value.length > 1;

  return (
    <div
      className={`flex gap-2 items-center p-0.5 divide-x ${
        type === "note"
          ? "lg:flex-col items-start gap-0 divide-x-0 divide-y"
          : ""
      }`}
    >
      <div
        className={`min-w-10 flex items-center justify-center gap-1 ${
          type === "note" ? ":w-full justify-start px-1 py-0.5" : ""
        }`}
      >
        <Icon className="size-3 stroke-black" />
        {type === "note" && (
          <span className="text-[10px] capitalize">{label}</span>
        )}
      </div>
      {isArray ? (
        <div className="flex-1 w-full text-slide-container overflow-hidden">
          <ul className="flex w-full items-center gap-0.5 animate-text-slide">
            {value.map((item, i) => (
              <li key={i} className="px-1 text-center whitespace-nowrap">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <span className="flex-1 w-full px-2">{value}</span>
      )}
    </div>
  );
}
