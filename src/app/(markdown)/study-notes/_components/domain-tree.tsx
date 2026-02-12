import DomainItem from "@/features/(markdown)/components/domain-item";
import SubjectItem from "@/features/(markdown)/components/subject-item";
import type { Domain } from "@/types";

export default function DomainTree({ domains }: { domains: Domain[] }) {
  return (
    <ul className="hidden lg:flex flex-col divide-y divide-gray-500 w-1/6 max-w-70">
      {domains.map((domain) => (
        <DomainItem
          type="desktop"
          frontmatter={domain.frontmatter}
          slug={domain.slug}
          key={domain.frontmatter.title}
        >
          <ul className="py-1">
            {domain.subjects.map((subject) => (
              <SubjectItem
                key={subject.slug.join("/")}
                type="desktop"
                title={subject.frontmatter.title}
                slug={subject.slug}
                totalNotesCount={
                  subject.notes.length +
                  subject.series.reduce((acc, s) => acc + s.notes.length, 0)
                }
              />
            ))}
          </ul>
        </DomainItem>
      ))}
      <div className="flex-1" />
    </ul>
  );
}
