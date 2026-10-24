"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { WorkItem } from "@/data/works";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function WorksGallery({ initialWorks }: { initialWorks: WorkItem[] }) {
  const [activeWork, setActiveWork] = useState<WorkItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!activeWork) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveWork(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeWork]);

  if (initialWorks.length === 0) {
    return (
      <div className="py-20 text-center text-muted">
        등록된 작업물이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {initialWorks.map((work) => (
          <button
            key={work.image}
            type="button"
            onClick={() => setActiveWork(work)}
            className="group cursor-pointer border border-default bg-surface rounded overflow-hidden flex flex-col text-left transition-all duration-200 hover:border-muted hover:shadow-md focus:outline-none focus:ring-1 focus:ring-default"
          >
            <div className="relative w-full aspect-square bg-layout-bg overflow-hidden border-b border-default">
              <ImageWithFallback
                src={work.image}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="p-3 flex items-center justify-between gap-2">
              <span className="font-medium text-sm truncate group-hover:text-foreground">
                {work.title}
              </span>
              {work.year && (
                <span className="text-xs text-muted font-mono shrink-0">
                  {work.year}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox / Enlarged Image Modal */}
      {mounted &&
        activeWork &&
        createPortal(
          <div
            className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-8"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setActiveWork(null)}
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div className="relative z-999 max-w-5xl max-h-[92vh] w-full flex flex-col items-center bg-surface border border-default rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              {/* Header with Title, Year, Close */}
              <div className="w-full flex items-center justify-between px-4 py-3 border-b border-default bg-layout-bg/50">
                <div className="flex items-baseline gap-2.5 truncate">
                  <h2 className="font-bold text-base md:text-lg truncate">
                    {activeWork.title}
                  </h2>
                  {activeWork.year && (
                    <span className="text-xs text-muted font-mono">
                      {activeWork.year}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveWork(null)}
                  className="p-1 rounded text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                  aria-label="닫기"
                >
                  <XMarkIcon className="size-6" />
                </button>
              </div>

              {/* Enlarged Image Area */}
              <div
                className="relative w-full flex-1 flex items-center justify-center p-2 md:p-4 bg-layout-bg min-h-[50vh] max-h-[80vh]"
                onClick={() => setActiveWork(null)}
              >
                <div className="relative w-full h-[75vh] max-h-[75vh]">
                  <ImageWithFallback
                    src={activeWork.image}
                    alt={activeWork.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
