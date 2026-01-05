import { usePathname } from "next/navigation";

export type NavTab = {
  title: string;
  href: string;
};

export function useNav() {
  const pathname = usePathname();

  const navTabs: NavTab[] = [
    { title: "home", href: "/" },
    { title: "about", href: "/about" },
    { title: "notes", href: "/study-notes" },
    { title: "pedia", href: "/pedia" },
  ];

  const getSelectedNavItem = () => {
    if (pathname === "/") return navTabs[0];
    if (pathname.startsWith("/about")) return navTabs[1];
    if (pathname.startsWith("/study-notes")) return navTabs[2];
    if (pathname.startsWith("/pedia")) return navTabs[3];
    return undefined;
  };

  const selectedNavTab = getSelectedNavItem();

  return { selectedNavTab, navTabs };
}
