import Link from "next/link";
import Write from "./write";

export default function BlogNav() {
  return (
    <nav className="flex w-6/12 mt-3 justify-center">
      <div className="bg-gray-100 flex justify-center items-center">
        {tabs.map((tab) => (
          <Link
            key={tab.title}
            href={tab.href}
            className="px-4 hover:bg-gray-200 "
          >
            {tab.title}
          </Link>
        ))}
      </div>
      <Write />
    </nav>
  );
}

const tabs = [
  {
    title: "카테고리",
    href: "/blog",
  },
  {
    title: "전체보기",
    href: "/blog/search",
  },
];
