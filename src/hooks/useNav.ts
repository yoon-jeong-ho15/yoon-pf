import { usePathname } from "next/navigation";

export type NavTab = {
  title: string;
  href: string;
};

export const NAV_TABS: NavTab[] = [
  { title: "home", href: "/" },
  { title: "about", href: "/about" },
  { title: "blogs", href: "/blogs" },
  { title: "works", href: "/works" },
];

export function isNavTabActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  const normalizedHref = href.endsWith("/") ? href.slice(0, -1) : href;
  return (
    pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`)
  );
}

export function resolveSelectedNav(
  pathname: string | null | undefined,
  navTabs: NavTab[] = NAV_TABS,
) {
  const selectedIndex = pathname
    ? navTabs.findIndex((tab) => isNavTabActive(pathname, tab.href))
    : -1;
  const selectedNavTab =
    selectedIndex === -1 ? undefined : navTabs[selectedIndex];

  return {
    navTabs,
    selectedNavTab,
    selectedIndex,
  };
}

export function useNav(navTabs: NavTab[] = NAV_TABS) {
  const pathname = usePathname();
  return resolveSelectedNav(pathname, navTabs);
}
