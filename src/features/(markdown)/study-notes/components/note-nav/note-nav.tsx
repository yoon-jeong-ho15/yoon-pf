"use client";

import { CategoryTree } from "@/types";
import { useNoteNav } from "./use-note-nav";
import MobileNoteNav from "./mobile-note-nav";
import DesktopNoteNav from "./desktop-note-nav";

interface NavigationProps {
  tree: CategoryTree[];
}

export default function NoteNav({ tree }: NavigationProps) {
  const navState = useNoteNav(tree);

  return (
    <>
      <MobileNoteNav tree={tree} navState={navState} />
      <DesktopNoteNav tree={tree} navState={navState} />
    </>
  );
}
