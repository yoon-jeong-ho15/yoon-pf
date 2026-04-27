import { getMDTree } from "@/features/(markdown)/lib/data";

export default function Page() {
  const tree = getMDTree("blogs");

  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4">
      개발중
    </div>
  );
}
