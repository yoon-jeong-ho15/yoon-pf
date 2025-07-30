// "use client";

// import type { CategoryWithDetail } from "@/lib/definitions";
// import { useEffect, useState } from "react";
// import CategoryItem from "./cat-item";

// export default function CategoryView({ data }: { data: CategoryWithDetail[] }) {
//   const [categories, setCategories] = useState<CategoryWithDetail[]>([]);
//   const [resetKey, setResetKey] = useState(0);

//   useEffect(() => {
//     const temp: CategoryWithDetail[] = [];
//     const map = new Map(
//       data.map((item) => [
//         item.id,
//         { ...item, children: new Array<CategoryWithDetail>() },
//       ])
//     );

//     for (const item of data) {
//       const cur = map.get(item.id)!;
//       if (item.parent_id) {
//         const parent = map.get(item.parent_id)!;
//         parent.children.push(cur);
//         parent.count += cur.count;
//       } else {
//         temp.push(cur);
//       }
//     }
//     setCategories(temp);
//   }, [data]);

//   const handleReset = () => {
//     setResetKey((prevKey) => prevKey + 1);
//   };

//   return (
//     <>
//       <button
//         onClick={handleReset}
//         className="m-4 p-2 bg-gray-200 rounded z-10"
//       >
//         reset
//       </button>
//       <div className="relative w-full h-96" key={resetKey}>
//         {categories?.map((category, i) => (
//           <CategoryItem
//             key={`c${category.id}`}
//             category={category}
//             position={{ top: 10 + i * 15, left: 10 + i * 10 }}
//             index={i}
//           />
//         ))}
//       </div>
//     </>
//   );
// }
