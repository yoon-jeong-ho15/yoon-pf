import type { LinkMetadata } from "@/types";

export const BUILD_FETCH_TIMEOUT_MS: number;
export const SERVER_FETCH_TIMEOUT_MS: number;
export const DEFAULT_CACHE_TTL_MS: number;

export type MetadataFetchFailureReason = "http" | "timeout" | "network";

export type MetadataFetchFailure = {
  ok: false;
  reason: MetadataFetchFailureReason;
  error: string;
  status?: number;
};

export type MetadataFetchResult =
  | {
      ok: true;
      metadata: LinkMetadata;
    }
  | MetadataFetchFailure;

export type FetchUrlMetadataOptions = {
  timeoutMs?: number;
  fetchFn?: typeof fetch;
  now?: () => number;
};

export type ResolveMetadataOptions = FetchUrlMetadataOptions & {
  ttlMs?: number;
};

export type MetadataResolution =
  | {
      kind: "cached";
      metadata: LinkMetadata;
    }
  | {
      kind: "refreshed";
      metadata: LinkMetadata;
    }
  | {
      kind: "stale";
      metadata: LinkMetadata;
      failure: MetadataFetchFailure;
    }
  | {
      kind: "failed";
      metadata: LinkMetadata;
      failure: MetadataFetchFailure;
    };

export function extractMetadataFromHtml(
  url: string,
  html: string,
  fetchedAt?: number,
): LinkMetadata;

export function isMetadataExpired(
  entry: LinkMetadata | undefined,
  now?: number,
  ttlMs?: number,
): boolean;

export function fetchUrlMetadata(
  url: string,
  options?: FetchUrlMetadataOptions,
): Promise<MetadataFetchResult>;

export function resolveMetadataEntry(
  url: string,
  cachedEntry: LinkMetadata | undefined,
  options?: ResolveMetadataOptions,
): Promise<MetadataResolution>;
