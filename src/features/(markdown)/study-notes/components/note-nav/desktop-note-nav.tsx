import { CategoryTree } from "@/types";
import NavContent from "./nav-content";
import { useNoteNav } from "./use-note-nav";

interface Props {
  tree: CategoryTree[];
  navState: ReturnType<typeof useNoteNav>;
}

export default function DesktopNoteNav({ tree, navState }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-80 divide-y divide-gray-400 h-[calc(100vh-(--spacing(16)))]">
      <NavContent tree={tree} {...navState} />
    </aside>
  );
}
