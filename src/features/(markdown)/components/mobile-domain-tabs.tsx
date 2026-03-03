import { useScroll } from "@/hooks/useScroll";
import { Domain } from "@/types";
import { motion } from "motion/react";
import { ActiveSelection } from "@/hooks/use-category-navigation";

export default function MobileDomainTabs({
  domains,
  showingDomain,
  setActiveSelection,
}: {
  domains: Domain[];
  showingDomain: Domain | null;
  setActiveSelection: (selection: ActiveSelection) => void;
}) {
  const scrollRef = useScroll<HTMLUListElement>();

  return (
    <ul
      ref={scrollRef}
      className="flex divide-x divide-gray-300 
                        rounded-t-xl border border-gray-400 border-b-0
                        overflow-hidden w-full"
    >
      {domains.map((domain) => {
        const isSelected =
          showingDomain?.slug.join("/") === domain.slug.join("/");
        return (
          <motion.li
            key={domain.slug.join("/")}
            className={`relative flex items-center justify-center py-2 px-4 shrink-0 
                              ${isSelected ? "bg-neutral-100" : "bg-white"}`}
            onClick={() => {
              setActiveSelection({
                type: "domain",
                slug: domain.slug.join("/"),
              });
            }}
          >
            <span
              className={`relative z-10 transition-colors ${
                isSelected ? "text-slate-900 font-medium" : "text-slate-500"
              }`}
            >
              {domain.frontmatter.title}
            </span>
            {isSelected ? (
              <motion.div
                layoutId="domain-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            ) : null}
          </motion.li>
        );
      })}
      <li />
    </ul>
  );
}
