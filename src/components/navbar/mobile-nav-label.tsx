"use client";

import Link from "next/link";
import { useNav } from "./useNav";

export function MobileNavLabel() {
  const { selectedNavTab } = useNav();

  return (
    <div className="ml-5 text-xl">
      <Link href={selectedNavTab?.href ?? "/"}>{selectedNavTab?.title}</Link>
    </div>
  );
}
