import { usePathname } from "next/navigation";

export type NavTab = {
  title: string;
  href: string;
};

export const NAV_TABS: NavTab[] = [
  { title: "home", href: "/" },
  { title: "about", href: "/about" },
  { title: "blogs", href: "/blogs" },
  { title: "notes", href: "/study-notes" },
];

export function useNav() {
  const pathname = usePathname();

  function getSelectedNavTab() {
    if (pathname === "/") return NAV_TABS[0];
    if (pathname.startsWith("/about")) return NAV_TABS[1];
    if (pathname.startsWith("/blogs")) return NAV_TABS[2];
    if (pathname.startsWith("/study-notes") || pathname.startsWith("/nsearch"))
      return NAV_TABS[3];
    return undefined;
  }

  const selectedNavTab = getSelectedNavTab();
  const selectedIndex = NAV_TABS.findIndex(
    (t) => t.title === selectedNavTab?.title
  );

  return {
    navTabs: NAV_TABS,
    selectedNavTab,
    selectedIndex,
  };
}
