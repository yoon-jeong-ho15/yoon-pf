"use client";

import { Domain } from "@/types";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ToggleButton } from "@/components/button";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";
import { useScroll } from "@/hooks/useScroll";
import { useScrollToActive } from "@/hooks/useScrollToActive";
import PostItem from "@/features/(markdown)/study-notes/components/post-item";
import RowScrollTabs from "@/components/row-scroll-tabs";

export type MobileTreeNote = {
  slug: string[];
  frontmatter: {
    title: string;
    order?: number;
    [key: string]: any;
  };
};

export default function NoteNav({ domains }: { domains: Domain[] }) {
  const {
    isOpen,
    setIsOpen,
    setActiveSelection,
    showingDomain,
    currentSubject,
    showingSubject,
    displayNotes,
  } = useCategoryNavigation(domains);

  const scrollRef = useScroll<HTMLUListElement>();
  const listRef = useScrollToActive<HTMLUListElement>(
    currentSubject
      ? `[data-subject-slug="${currentSubject.slug.join("/")}"]`
      : null,
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsOpen]);

  function handleToggle() {
    setIsOpen(!isOpen);
    setActiveSelection(null); // Reset selection on toggle
  }

  return (
    <div className="sticky top-0 flex flex-col text-sm z-10 w-full xl:w-72 xl:shrink-0">
      <div
        className={`flex h-8 items-center border-b border-gray-500 bg-white transition-colors
        ${isOpen ? "border-transparent " : ""}`}
      >
        <ToggleButton onClick={handleToggle} isExpanded={isOpen} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-8 left-0 w-full z-20 bg-black/30 overflow-y-auto"
            style={{ height: "calc(100vh - 1.25rem)" }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col gap-2 bg-white px-1 pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-1">
                {/* MobileDomainTabs */}
                <RowScrollTabs>
                  {domains.map((domain) => {
                    const isSelected =
                      showingDomain?.slug.join("/") === domain.slug.join("/");
                    return (
                      <motion.div
                        key={domain.slug.join("/")}
                        className={`relative flex items-center justify-center 
                          py-2 px-4 shrink-0`}
                        onClick={() => {
                          setActiveSelection({
                            type: "domain",
                            slug: domain.slug.join("/"),
                          });
                        }}
                      >
                        <span className={`relative z-10`}>
                          {domain.frontmatter.title}
                        </span>
                        {isSelected ? (
                          <motion.div
                            layoutId="domain-tab"
                            className="absolute inset-1 bg-gray-100 rounded"
                            initial={false}
                            transition={{ type: "spring", duration: 0.4 }}
                          />
                        ) : null}
                      </motion.div>
                    );
                  })}
                </RowScrollTabs>

                {/* MobileSubjectList */}
                <ul
                  ref={listRef}
                  className="flex flex-col gap-1 py-1 px-2 h-46
                   bg-slate-100 overflow-y-scroll border border-gray-400
                   rounded-b-xl"
                >
                  {showingDomain &&
                    showingDomain.subjects.map((subject) => {
                      const isSelected =
                        showingSubject?.slug.join("/") ===
                        subject.slug.join("/");
                      return (
                        <motion.div
                          key={subject.slug.join("/")}
                          data-subject-slug={subject.slug.join("/")}
                          className={`relative flex items-center gap-1 py-2 px-4 rounded 
                          border border-gray-300 h-12 cursor-pointer
                        ${
                          currentSubject?.slug.join("/") ===
                          subject.slug.join("/")
                            ? "bg-amber-100"
                            : "bg-white"
                        }`}
                          onClick={() => {
                            setActiveSelection({
                              type: "subject",
                              slug: subject.slug.join("/"),
                            });
                          }}
                        >
                          <span className="relative z-20 truncate">
                            {subject.frontmatter.title}
                          </span>
                          {isSelected ? (
                            <motion.div
                              layoutId="subject-tab"
                              className="absolute inset-0 bg-lime-100 rounded z-10"
                              initial={false}
                              transition={{ type: "spring", duration: 0.4 }}
                            />
                          ) : null}
                        </motion.div>
                      );
                    })}
                </ul>
              </div>

              {/* MobileNoteList */}
              <div className="flex flex-col">
                <span className="border border-gray-400 border-b-0 rounded-t-xl p-2">
                  {"노트"}
                </span>
                <ul
                  className="overflow-y-scroll h-46 w-full bg-slate-100 
                  border border-gray-400 rounded-b-xl"
                  style={{ scrollbarWidth: "none" }}
                >
                  {displayNotes && displayNotes.length > 0 ? (
                    (displayNotes as MobileTreeNote[]).map((note, i) => (
                      <PostItem
                        key={note.slug.join("/")}
                        variant="mobile"
                        title={note.frontmatter.title}
                        order={note.frontmatter.order}
                        slug={note.slug}
                        i={i}
                        onSelect={() => setIsOpen(false)}
                      />
                    ))
                  ) : (
                    <li className="text-center p-2 text-slate-600">
                      노트 없음
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
