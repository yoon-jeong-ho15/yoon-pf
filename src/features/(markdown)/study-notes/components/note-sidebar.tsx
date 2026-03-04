import { CategoryFrontmatter, Subject, Series, Note } from "@/types";
import { d2Coding } from "@/app/fonts";
import { getDomainFromURL, sortFrontmatter } from "../../utils/util";
import Link from "next/link";
import SubCategoryItem from "./sub-category-item";
import PostItem from "./post-item";
import { SidebarLink } from "./frontmatter/links";

export default function NoteSidebar({
  mainInfo,
  subCategories,
  notes,
}: {
  mainInfo: {
    title: string;
    description: string;
    frontmatter: CategoryFrontmatter;
    slug: string[];
    count: number;
  };
  subCategories: (Subject | Series)[];
  notes: Note[];
}) {
  const sortedFrontmatter = sortFrontmatter(mainInfo.frontmatter).filter(
    ([key]) => key !== "title",
  );

  const mainType = mainInfo.slug.length === 1 ? "domain" : "subject";
  const subType = mainType === "domain" ? "subject" : "series";

  return (
    <div
      id={"note-sidebar"}
      className={`${d2Coding.className}
        hidden text-base font-medium 
        md:flex md:flex-col md:h-full md:w-72
        `}
    >
      <div className="pl-3 py-3">
        <div>
          <span className={color.const}>{"const "}</span>
          <span>{`${mainType} = `}</span>
          <span className={color.brace}>{`{`}</span>
        </div>

        <div className="pl-3">
          {sortedFrontmatter.map(([key, value], index) => {
            if (key === "link") {
              return (
                <div key={key}>
                  <div className={color.comment}>{"// click"}</div>
                  <span className={color.key}>{`${key}`}</span>
                  <span>{" : ["}</span>
                  <div className="pl-3 flex flex-col">
                    {value.map((item: string, index: number) => (
                      <SidebarLink
                        key={item}
                        url={item}
                        isLast={index === value.length - 1}
                      />
                    ))}
                  </div>
                  <span>{`]`}</span>
                  {index < sortedFrontmatter.length - 1 && ","}
                </div>
              );
            }
            if (Array.isArray(value) && value.length > 1) {
              return (
                <div key={key}>
                  <span className={color.key}>{`${key}`}</span>
                  <span>{" : ["}</span>
                  <div className="pl-3 flex flex-col">
                    {value.map((item: string, index: number) => (
                      <span key={item}>
                        <span className={color.value}>{`"${item}"`}</span>
                        {index < value.length - 1 && ","}
                      </span>
                    ))}
                  </div>
                  <span>{`]`}</span>
                  {index < sortedFrontmatter.length - 1 && ","}
                </div>
              );
            }
            return (
              <div key={key}>
                <span className={color.key}>{key}</span>
                <span>{" : "}</span>
                <span className={color.value}>{`"${value}"`}</span>
                {index < sortedFrontmatter.length - 1 && ","}
              </div>
            );
          })}
        </div>

        <div className="pl-3 mt-3">
          <div className={color.comment}>{"// click, see all"}</div>
          <span className={color.key}>{"title"}</span>
          <span>{" : "}</span>
          <Link
            href={`/study-notes/${mainInfo.slug.join("/")}`}
            className={color.value}
          >{`"${mainInfo.title}"`}</Link>
        </div>

        <div className="pl-3 mt-3">
          <div className={color.comment}>{"// click, filter by series"}</div>
          {subCategories.length > 0 ? (
            <>
              <span className={color.key}>{`${subType}`}</span>
              <span>{" : ["}</span>
              <div className="pl-3 flex flex-col">
                {subCategories.map((subItem, index) => (
                  <SubCategoryItem
                    variant={"desktop"}
                    key={subItem.slug.join("/")}
                    title={subItem.frontmatter.title}
                    slug={subItem.slug}
                  />
                ))}
              </div>
              <span>{`]`}</span>
            </>
          ) : (
            <>
              <span className={color.key}>{`${subType}`}</span>
              <span>{" : "}</span>
              <span className={color.value}>{`null`}</span>
            </>
          )}
        </div>

        <div className="pl-3 mt-3">
          <div className={color.comment}>{"// click"}</div>
          {notes.length > 0 ? (
            <>
              <span className={`${color.key}`}>{`notes`}</span>
              <span>{" : ["}</span>
              <div className="pl-3 flex flex-col">
                {notes.map((note, index) => (
                  <PostItem
                    variant={"desktop"}
                    key={note.slug.join("/")}
                    title={note.frontmatter.title}
                    order={note.frontmatter.order}
                    slug={note.slug}
                    i={index}
                  />
                ))}
              </div>
              <span>{`]`}</span>
            </>
          ) : (
            <>
              <span className={color.key}>{`notes`}</span>
              <span>{" : "}</span>
              <span className={color.value}>{`null`}</span>
            </>
          )}
        </div>

        <div>
          <span className={color.brace}>{`}`}</span>
          <span className={color.semicolon}>{`;`}</span>
        </div>
      </div>
    </div>
  );
}

const color = {
  comment: "text-green-800",
  const: "text-fuchsia-600",
  brace: "text-blue-500",
  semicolon: "text-gray-500",
  key: "text-blue-800",
  key2: "text-blue-800",
  value: "text-orange-800",
};
