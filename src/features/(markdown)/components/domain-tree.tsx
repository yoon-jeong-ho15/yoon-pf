import DomainItem from "@/features/(markdown)/components/domain-item";
import SubjectItem from "@/features/(markdown)/components/subject-item";
import type { Domain } from "@/types";

export default function DomainTree({ domains }: { domains: Domain[] }) {
  return (
    <nav
      className="hidden 
    md:flex md:flex-row md:divide-y md:divide-x-0
    xl:flex-col xl:divide-y-0 xl:divide-x
    divide-gray-500
    w-1/5 xl:w-1/6 max-w-70"
    >
      {domains.map((domain) => (
        <DomainItem
          type="desktop"
          frontmatter={domain.frontmatter}
          slug={domain.slug}
          key={domain.frontmatter.title}
          noteCount={domain.notes.length}
        >
          {domain.subjects.map((subject) => {
            const subjectTotalNoteCount =
              subject.notes.length +
              subject.series.reduce((acc, s) => acc + s.notes.length, 0);
            return (
              <SubjectItem
                key={subject.slug.join("/")}
                type="desktop"
                title={subject.frontmatter.title}
                slug={subject.slug}
                totalNotesCount={subjectTotalNoteCount}
              />
            );
          })}
        </DomainItem>
      ))}
    </nav>
  );
}
