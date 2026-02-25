import {
  CalendarIcon,
  HashtagIcon,
  TagIcon,
  UserIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  BookmarkIcon,
  NumberedListIcon,
  EllipsisHorizontalCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import CategoryFrontmatter from "./category";
import NoteFrontmatter from "./note";

const ICON_MAP: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  topic: BookmarkIcon,
  order: HashtagIcon,
  date: CalendarIcon,
  author: UserIcon,
  instructor: UserIcon,
  tags: TagIcon,
  provide: BuildingLibraryIcon,
  publish: BookOpenIcon,
  chapter: NumberedListIcon,
  link: LinkIcon,
};

export default function Frontmatter({
  type,
  label,
  value,
  isArray,
}: {
  type: "category" | "note";
  label: string;
  value: any;
  isArray: boolean;
}) {
  const Icon = ICON_MAP[label] || EllipsisHorizontalCircleIcon;

  if (type === "category")
    return (
      <CategoryFrontmatter
        label={label}
        value={value}
        isArray={isArray}
        Icon={Icon}
      />
    );

  if (type === "note") {
    return (
      <NoteFrontmatter
        label={label}
        value={value}
        isArray={isArray}
        Icon={Icon}
      />
    );
  }
}
