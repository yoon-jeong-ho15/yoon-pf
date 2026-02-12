"use client";

import DomainItem from "@/features/(markdown)/components/domain-item";
import SubjectItem from "@/features/(markdown)/components/subject-item";
import { Domain } from "@/types";
import { useState, useEffect } from "react";
import SubCategoryItem from "@/features/(markdown)/components/sub-category-item";
import PostItem from "@/features/(markdown)/components/post-item";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/24/outline";

export default function MobileCategoryTree({ domains }: { domains: Domain[] }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(false);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const currentSubject = domains
    .flatMap((d) => d.subjects)
    .find((s) => pathname?.includes(s.slug.join("/")));
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState<"subject" | "series" | null>(
    null,
  );

  const showingSubject = selectedSubject
    ? domains
        .flatMap((domain) => domain.subjects)
        .find((subject) => subject.slug.join("/") === selectedSubject)
    : domains
        .flatMap((domain) => domain.subjects)
        .find(
          (subject) =>
            subject.slug.join("/") === currentSubject?.slug.join("/"),
        );

  const currentSeries = domains
    .flatMap((d) => d.subjects)
    .flatMap((s) => s.series)
    .find((s) => pathname?.includes(s.slug.join("/")));

  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  const showingSeries = selectedSeries
    ? domains
        .flatMap((d) => d.subjects)
        .flatMap((s) => s.series)
        .find((s) => s.slug.join("/") === selectedSeries)
    : domains
        .flatMap((d) => d.subjects)
        .flatMap((s) => s.series)
        .find((s) => s.slug.join("/") === currentSeries?.slug.join("/"));

  const selectedCategory =
    categoryType === "series"
      ? selectedSeries
        ? showingSeries
        : currentSeries
      : selectedSubject
        ? showingSubject
        : currentSubject;

  const sortedNotes = selectedCategory?.notes.sort(
    (a, b) => (a.frontmatter.order || 0) - (b.frontmatter.order || 0),
  );

  function handleToggle() {
    setIsExpanded(!isExpanded);
    setSelectedSubject(null);
    setSelectedSeries(null);
  }

  return (
    <div className="sticky top-0 flex flex-col lg:hidden divide-y divide-gray-500 text-sm">
      <div className="flex h-8 items-center border-b border-gray-500 bg-white">
        <button
          onClick={handleToggle}
          className="flex items-center justify-center gap-2 p-1 border-r border-gray-500"
        >
          {isExpanded ? (
            <>
              <span className="w-10">접기</span>
              <ChevronDoubleUpIcon className="w-6 h-6" />
            </>
          ) : (
            <>
              <span className="w-10">펼치기</span>
              <ChevronDoubleDownIcon className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-8 left-0 w-full z-20 bg-black/30 overflow-y-auto"
            style={{ height: "calc(100vh - 1.25rem)" }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white divide-y divide-gray-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {domains.map((domain) => (
                  <DomainItem
                    key={domain.frontmatter.title}
                    type="mobile"
                    frontmatter={domain.frontmatter}
                    slug={domain.slug}
                  >
                    <ul className="flex-1 flex">
                      {domain.subjects.map((subject) => (
                        <SubjectItem
                          key={subject.slug.join("/")}
                          type="mobile"
                          title={subject.frontmatter.title}
                          slug={subject.slug}
                          totalNotesCount={
                            subject.notes.length +
                            subject.series.reduce(
                              (acc, s) => acc + s.notes.length,
                              0,
                            )
                          }
                          onSelect={() => {
                            setCategoryType("subject");
                            setSelectedSeries(null);
                            setSelectedSubject(subject.slug.join("/"));
                          }}
                          isSelectedSubject={
                            selectedSubject === subject.slug.join("/")
                          }
                        />
                      ))}
                    </ul>
                  </DomainItem>
                ))}
              </div>
              <div className="flex divide-x divide-gray-500">
                <div className="bg-lime-200 min-h-20 w-40 shrink-0 grow-0">
                  <div className="flex justify-center border-b border-dotted p-2">
                    <span className="whitespace-nowrap overflow-hidden">
                      {showingSubject?.frontmatter.title}
                    </span>
                  </div>
                  <ul>
                    {showingSubject && showingSubject?.series.length > 0 ? (
                      showingSubject?.series.map((series) => (
                        <SubCategoryItem
                          key={series.slug.join("/")}
                          type="mobile"
                          title={series.frontmatter.title}
                          slug={series.slug}
                          noteCount={series.notes.length}
                          onSelect={() => {
                            setCategoryType("series");
                            setSelectedSeries(series.slug.join("/"));
                          }}
                          isSelectedSeries={
                            selectedSeries === series.slug.join("/")
                          }
                        />
                      ))
                    ) : (
                      <li className="text-center p-2 text-slate-600">
                        하위 분류 없음
                      </li>
                    )}
                  </ul>
                </div>
                <div className="flex-1 flex flex-col bg-indigo-200/60 min-w-0">
                  <span className="text-center border-b border-dotted p-2">
                    {categoryType === "series"
                      ? showingSeries?.frontmatter.title
                      : "노트"}
                  </span>
                  <ul
                    className="overflow-y-auto"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {sortedNotes && sortedNotes?.length > 0 ? (
                      sortedNotes?.map((note, i) => (
                        <PostItem
                          key={note.slug.join("/")}
                          type="mobile"
                          title={note.frontmatter.title}
                          order={note.frontmatter.order}
                          slug={note.slug}
                          i={i}
                          onSelect={() => setIsExpanded(false)}
                        />
                      ))
                    ) : (
                      <li className="text-center p-2 text-slate-600">
                        노트 없음
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
