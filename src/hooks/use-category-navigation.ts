import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Domain } from "@/types";

export type ActiveSelection =
  | { type: "domain"; slug: string }
  | { type: "subject"; slug: string }
  | null;

export function useCategoryNavigation(domains: Domain[]) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSelection, setActiveSelection] = useState<ActiveSelection>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const allSubjects = useMemo(
    () => domains.flatMap((d) => d.subjects),
    [domains],
  );

  const {
    currentDomain,
    currentSubject,
    showingDomain,
    showingSubject,
    selectedCategory,
  } = useMemo(() => {
    const defaultDomain = domains.find((d) =>
      pathname?.includes(d.slug.join("/")),
    );
    const defaultSubject = allSubjects.find((s) =>
      pathname?.includes(s.slug.join("/")),
    );

    let activeDomain: Domain | undefined;
    let activeSubject: Domain["subjects"][0] | null | undefined = null;

    if (activeSelection?.type === "domain") {
      activeDomain = domains.find(
        (d) => d.slug.join("/") === activeSelection.slug,
      );
    } else if (activeSelection?.type === "subject") {
      activeSubject = allSubjects.find(
        (s) => s.slug.join("/") === activeSelection.slug,
      );

      activeDomain = activeSubject
        ? domains.find((d) =>
            d.subjects.some(
              (s) => s.slug.join("/") === activeSubject?.slug.join("/"),
            ),
          )
        : defaultDomain;
    } else {
      activeDomain = defaultDomain;
      activeSubject = defaultSubject;
    }

    const category =
      activeSelection?.type === "subject" ||
      (!activeSelection && defaultSubject)
        ? activeSubject || defaultSubject
        : activeDomain || defaultDomain;

    return {
      currentDomain: defaultDomain,
      currentSubject: defaultSubject,
      showingDomain: activeDomain || null,
      showingSubject: activeSubject || null,
      selectedCategory: category || null,
    };
  }, [domains, allSubjects, pathname, activeSelection]);

  const displayNotes = useMemo(() => {
    if (!selectedCategory) return [];

    const notes =
      "series" in selectedCategory
        ? [
            ...selectedCategory.notes,
            ...selectedCategory.series.flatMap((s) => s.notes),
          ]
        : [...selectedCategory.notes];

    return notes.sort(
      (a, b) => (a.frontmatter.order || 0) - (b.frontmatter.order || 0),
    );
  }, [selectedCategory]);

  return {
    isOpen,
    setIsOpen,
    activeSelection,
    setActiveSelection,
    currentDomain,
    currentSubject,
    showingDomain,
    showingSubject,
    displayNotes,
  };
}
