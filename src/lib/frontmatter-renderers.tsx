import React from "react";
import { SidebarLink } from "@/components/(markdown)/links";

export const FRONTMATTER_RENDERERS: Record<
  string,
  (val: string) => React.ReactNode
> = {
  link: (itemUrl) => <SidebarLink url={itemUrl} />,
};
