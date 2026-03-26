import { CategoryTree } from "@/types";
import NavContent from "./nav-content";
import { useNoteNav } from "../../hooks/use-note-nav";

interface Props {
  tree: CategoryTree[];
  navState: ReturnType<typeof useNoteNav>;
}

export default function DesktopNoteNav({ tree, navState }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-62 lg:w-72 bg-surface divide-y divide-gray-400 sticky top-0 max-h-screen border-r border-gray-500">
      <NavContent tree={tree} {...navState} />
    </aside>
  );
}
