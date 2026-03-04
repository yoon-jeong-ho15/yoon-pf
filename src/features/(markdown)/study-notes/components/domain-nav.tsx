"use client";

import { d2Coding, menlo, nanumGothicCoding } from "@/app/fonts";
import RowScrollTabs from "@/components/row-scroll-tabs";
import { Domain } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DomainNav({ domains }: { domains: Domain[] }) {
  const pathname = usePathname();

  return (
    <nav
      className={`${d2Coding.className} hidden font-medium
      md:flex md:flex-col md:w-full md:p-3 md:justify-center
      xl:w-1/6 xl:max-w-70 xl:pl-2 xl:justify-start xl:gap-2 
      `}
    >
      <div>
        <span className="text-fuchsia-600">{"const "}</span>
        <span>{"domains"}</span>
        <span>{" = "}</span>
        <span className="text-blue-500">{"["}</span>
        <span className="xl:hidden text-green-800">{" // scroll"}</span>
      </div>
      {domains.map((domain, i) => (
        <div
          key={domain.slug.join("/")}
          className="flex 
          md:items-center md:gap-4 md:pl-3 md:text-nowrap
          xl:flex-col xl:items-start xl:gap-0 xl:text-wrap xl:overflow-x-hidden"
        >
          <div className="flex items-center gap-2">
            <Link href={`/study-notes/${domain.slug.join("/")}`} className="">
              <span className="text-blue-800">{`"${domain.frontmatter.title}"`}</span>
            </Link>
            <span>{" : "}</span>
            <span className="">{" { "}</span>
          </div>

          <RowScrollTabs
            className=" 
          md:items-center md:gap-2 
          xl:flex-col xl:items-start xl:pl-3
          "
            activeSelector="[data-active='true']"
          >
            {domain.subjects.map((subject, i) => {
              const href = `/study-notes/${subject.slug.join("/")}`;
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <div
                  key={subject.slug.join("/")}
                  data-active={isActive ? "true" : undefined}
                >
                  <Link
                    href={href}
                    className={`hover:bg-zinc-200 ${isActive ? "bg-zinc-200 underline decoration-red-500 decoration-dotted decoration-2 " : ""}`}
                  >
                    <span className="text-orange-800">
                      {`"${subject.frontmatter.title}"`}
                    </span>
                  </Link>
                  {i !== domain.subjects.length - 1 && <span>,</span>}
                </div>
              );
            })}
          </RowScrollTabs>

          <div className="flex">
            <span className="">{" }"}</span>
            {i !== domains.length - 1 && <span>,</span>}
          </div>
        </div>
      ))}
      <div>
        <span className="text-blue-500">{"]"}</span>
        <span className="text-gray-500">{";"}</span>
      </div>
    </nav>
  );
}
