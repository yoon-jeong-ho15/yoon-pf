import Link from "next/link";

export default function BlogNav() {
  return (
    <nav className="bg-gray-100 w-6/12 divide-x">
      {tabs.map((tab) => (
        <Link key={tab.title} href={tab.href}>
          {tab.title}
        </Link>
      ))}
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
