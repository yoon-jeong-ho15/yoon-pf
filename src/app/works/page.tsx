import WorksGallery from "@/components/works/works-gallery";
import { WORKS } from "@/data/works";

export const metadata = {
  title: "Works | 윤정호",
  description: "Works by Yoon Jeong Ho",
};

export default function WorksPage() {
  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4 md:p-6 max-w-7xl w-full mx-auto">
      <div className="bg-surface border border-default w-full p-4 md:p-6 rounded-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight border-b border-default pb-3">
          Works
        </h1>
        <WorksGallery initialWorks={WORKS} />
      </div>
    </div>
  );
}
