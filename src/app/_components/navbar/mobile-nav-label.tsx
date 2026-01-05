"use client";

import Link from "next/link";
import { useNav } from "./_hooks/useNav";

export function MobileNavLabel() {
  const { selectedNavTab } = useNav();

  return (
    <div className="md:hidden ml-5 font-bold text-xl">
      <Link href={selectedNavTab?.href ?? "/"}>{selectedNavTab?.title}</Link>
    </div>
  );
}
