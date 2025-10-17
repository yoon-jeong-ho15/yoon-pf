import { getCategoryTree } from "@/lib/data/blog";
import BlogList from "./ui/category-view/blog-list";
import { MobileCategoryItem } from "./ui/category-view/mobile-category-item";
import CategoryTree from "./ui/category-view/tree";

export default async function Page(props: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;

  const { categories, categoryMap } = getCategoryTree();

  const selectedCategory = searchParams?.category || "";

  return (
    <div id="blog-category-page" className="w-full my-2 md:my-5 md:px-6">
      {/* 모바일 뷰 (md 미만) */}
      <ul className="p-1 md:hidden">
        {categories.map((category, i) => (
          <MobileCategoryItem key={i} category={category} level={1} />
        ))}
      </ul>

      {/* 데스크톱 뷰 (md 이상) */}
      <div className="hidden md:flex md:justify-around">
        <CategoryTree
          categories={categories}
          selectedCategory={selectedCategory}
        />
        <BlogList category={categoryMap[selectedCategory]} />
      </div>
    </div>
  );
}
