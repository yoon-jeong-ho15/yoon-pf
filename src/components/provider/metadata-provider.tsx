"use client";

import { createContext, useContext } from "react";
import type { LinkMetadata } from "@/types";

const MetadataContext = createContext<Record<string, LinkMetadata>>({});

export function MetadataProvider({
  children,
  metadataMap,
}: {
  children: React.ReactNode;
  metadataMap: Record<string, LinkMetadata>;
}) {
  return (
    <MetadataContext.Provider value={metadataMap}>
      {children}
    </MetadataContext.Provider>
  );
}

export function useMetadata() {
  return useContext(MetadataContext);
}
