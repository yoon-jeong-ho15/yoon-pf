import DomainItem from "./_components/domain-item";
import SubjectItem from "./_components/subject-item";

import { getDomains } from "./_lib/data";

export default function StudyNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domains = getDomains();

  return (
    <div id="study-notes-layout" className="bg-note-gradient flex-1">
      <div className="flex divide-x divide-gray-500 border-y border-gray-500 mt-4 mb-16">
        <div className="w-3"></div>
        <ul
          className="flex flex-col 
          divide-y divide-gray-500
          w-1/7 min-w-48"
        >
          {domains.map((domain) => (
            <DomainItem
              type="compact"
              frontmatter={domain.frontmatter}
              slug={domain.slug}
              key={domain.frontmatter.title}
            >
              <ul className="py-1">
                {domain.subjects.map((subject) => (
                  <SubjectItem
                    key={subject.slug.join("/")}
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

        <div
          id=""
          className="flex-1 flex flex-col divide-y divide-gray-500 
          xl:flex-row xl:divide-x"
        >
          {children}
        </div>

        <div className="w-3"></div>
      </div>
    </div>
  );
}
