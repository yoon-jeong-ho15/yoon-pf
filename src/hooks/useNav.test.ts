import { beforeEach, describe, expect, test, vi } from "vitest";

let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import { NAV_TABS, type NavTab, useNav } from "./useNav";

describe("useNav", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  test("matches home only on exact / path", () => {
    mockPathname = "/";
    expect(useNav()).toEqual({
      navTabs: NAV_TABS,
      selectedNavTab: { title: "home", href: "/" },
      selectedIndex: 0,
    });
  });

  test("matches /blogs and nested /blogs/review/example routes", () => {
    mockPathname = "/blogs";
    expect(useNav()).toEqual({
      navTabs: NAV_TABS,
      selectedNavTab: { title: "blogs", href: "/blogs" },
      selectedIndex: 2,
    });

    mockPathname = "/blogs/review/example";
    expect(useNav()).toEqual({
      navTabs: NAV_TABS,
      selectedNavTab: { title: "blogs", href: "/blogs" },
      selectedIndex: 2,
    });
  });

  test("does not match /blogshelf to /blogs or home", () => {
    mockPathname = "/blogshelf";
    expect(useNav()).toEqual({
      navTabs: NAV_TABS,
      selectedNavTab: undefined,
      selectedIndex: -1,
    });
  });

  test("computes active tab and index by href even when tab order changes", () => {
    const reorderedTabs: NavTab[] = [
      { title: "blogs", href: "/blogs" },
      { title: "works", href: "/works" },
      { title: "home", href: "/" },
      { title: "about", href: "/about" },
    ];

    mockPathname = "/";
    expect(useNav(reorderedTabs)).toEqual({
      navTabs: reorderedTabs,
      selectedNavTab: { title: "home", href: "/" },
      selectedIndex: 2,
    });

    mockPathname = "/blogs";
    expect(useNav(reorderedTabs)).toEqual({
      navTabs: reorderedTabs,
      selectedNavTab: { title: "blogs", href: "/blogs" },
      selectedIndex: 0,
    });

    mockPathname = "/blogs/review/example";
    expect(useNav(reorderedTabs)).toEqual({
      navTabs: reorderedTabs,
      selectedNavTab: { title: "blogs", href: "/blogs" },
      selectedIndex: 0,
    });

    mockPathname = "/blogshelf";
    expect(useNav(reorderedTabs)).toEqual({
      navTabs: reorderedTabs,
      selectedNavTab: undefined,
      selectedIndex: -1,
    });
  });
});
