import Link from "next/link";

export default function BlogNav() {
  return (
    <nav>
      <div>
        <Link href="/blog">카테고리</Link>
        <Link href="/blog/search">전체 보기</Link>
      </div>
    </nav>
  );
}
