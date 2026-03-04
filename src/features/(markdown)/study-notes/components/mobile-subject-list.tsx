import { useScrollToActive } from "@/hooks/useScrollToActive";
import { Domain } from "@/types";
import { motion } from "motion/react";
import { ActiveSelection } from "@/hooks/use-category-navigation";

export default function MobileSubjectList({
  showingDomain,
  currentSubject,
  showingSubject,
  setActiveSelection,
}: {
  showingDomain: Domain | null;
  currentSubject: Domain["subjects"][0] | null | undefined;
  showingSubject: Domain["subjects"][0] | null | undefined;
  setActiveSelection: (selection: ActiveSelection) => void;
}) {
  const listRef = useScrollToActive<HTMLUListElement>(
    currentSubject
      ? `[data-subject-slug="${currentSubject.slug.join("/")}"]`
      : null,
  );

  return (
    <ul
      ref={listRef}
      className="flex flex-col gap-1 py-1 px-2 h-46
       bg-slate-100 overflow-y-scroll border border-gray-400
       rounded-b-xl"
    >
      {showingDomain &&
        showingDomain.subjects.map((subject) => {
          const isSelected =
            showingSubject?.slug.join("/") === subject.slug.join("/");
          return (
            <motion.div
              key={subject.slug.join("/")}
              data-subject-slug={subject.slug.join("/")}
              className={`relative flex items-center gap-1 py-2 px-4 rounded 
              border border-gray-300 h-12 cursor-pointer
            ${
              currentSubject?.slug.join("/") === subject.slug.join("/")
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
  );
}
