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
      className={`flex gap-2 items-center rounded-full my-1 p-0.5 divide-x
        bg-white/30 text-slate-700 text-sm`}
    >
      <div className="min-w-10 flex justify-center">
        <Icon className="size-3 stroke-black" />
      </div>
      {isArray ? (
        <div className="flex-1 text-slide-container overflow-hidden">
          <ul className="flex w-full items-center gap-0.5 animate-text-slide">
            {value.map((item, i) => (
              <li key={i} className="px-1 text-center whitespace-nowrap">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <span className="flex-1 px-2 whitespace-nowrap">{value}</span>
      )}
    </div>
  );
}
