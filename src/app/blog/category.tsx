import type { Category } from "@/lib/definitions";

export default function Category({
  categories,
}: {
  categories: Category[] | null;
}) {
  return (
    <div>
      <div>
        {categories?.map((item) => (
          <div key={item.id}>
            <div>{item.name}</div>
            <div>{item.slug}</div>
            <div>{item.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
