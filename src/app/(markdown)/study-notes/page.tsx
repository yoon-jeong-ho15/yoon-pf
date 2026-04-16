import Search, { SearchSkeleton } from "@/features/(markdown)/components/search";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4">
      <div className="flex items-end flex-wrap gap-6 text-4xl">
        <Suspense fallback={<SearchSkeleton />}>
          <Search path={"nsearch"} />
        </Suspense>
      </div>
    </div>
  );
}
