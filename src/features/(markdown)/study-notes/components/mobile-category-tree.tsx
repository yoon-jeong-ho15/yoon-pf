"use client";

import { Domain } from "@/types";
import { useEffect } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { ToggleButton } from "@/components/button";
import MobileDomainTabs from "./mobile-domain-tabs";
import MobileSubjectList from "./mobile-subject-list";
import MobileNoteList, { MobileTreeNote } from "./mobile-note-list";
import { useCategoryNavigation } from "@/hooks/use-category-navigation";

export default function MobileCategoryTree({ domains }: { domains: Domain[] }) {
  const {
    isOpen,
    setIsOpen,
    setActiveSelection,
    showingDomain,
    currentSubject,
    showingSubject,
    displayNotes,
  } = useCategoryNavigation(domains);

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
    <div className="sticky top-0 flex flex-col md:hidden text-sm z-10">
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
                <MobileDomainTabs
                  domains={domains}
                  showingDomain={showingDomain}
                  setActiveSelection={setActiveSelection}
                />

                <MobileSubjectList
                  showingDomain={showingDomain}
                  currentSubject={currentSubject}
                  showingSubject={showingSubject}
                  setActiveSelection={setActiveSelection}
                />
              </div>

              <MobileNoteList
                displayNotes={displayNotes as MobileTreeNote[]}
                setIsOpen={setIsOpen}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
