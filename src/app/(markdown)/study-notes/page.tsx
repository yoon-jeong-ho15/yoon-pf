import Search from "@/features/(markdown)/components/search";

export default function Page() {
  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4">
      <div className="flex items-end flex-wrap gap-6 text-4xl">
        <Search path={"nsearch"} />
      </div>
    </div>
  );
}
