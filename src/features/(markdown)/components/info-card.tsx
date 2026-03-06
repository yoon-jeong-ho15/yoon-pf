// import { CategoryFrontmatter, NoteFrontmatter } from "@/types";
// import { sortFrontmatter } from "../utils/util";
// import Frontmatter from "../study-notes/components/frontmatter";

// export default function InfoCard({
//   type,
//   frontmatter,
// }: {
//   type: "category" | "note";
//   frontmatter: CategoryFrontmatter | NoteFrontmatter;
// }) {
//   const sortedFrontmatter = sortFrontmatter(frontmatter).filter(
//     ([key]) => key !== "title",
//   );

//   if (type === "category") {
//     return (
//       <div
//         className={`flex flex-col p-3 gap-5
//               bg-linear-to-b from-green-400 to-lime-200
//           `}
//       >
//         <div className="pl-6 overflow-hidden">
//           <h1 className="text-xl font-semibold text-shadow whitespace-nowrap">
//             {frontmatter.title}
//           </h1>
//         </div>
//         <div className="flex flex-col gap-2">
//           {sortedFrontmatter.map(([key, value]) => (
//             <Frontmatter
//               key={key}
//               type={type}
//               label={key}
//               value={value}
//               isArray={Array.isArray(value)}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="flex flex-col justify-center items-center min-h-36 xl:min-h-46
//            py-5 px-4 gap-2 bg-slate-100"
//     >
//       <div
//         className="flex border px-8 pt-2 pb-4 bg-sky-100
//       rounded-xl shadow-[2px_2px_0px_1px] shadow-gray-600"
//       >
//         <h1
//           className={`text-4xl md:text-5xl font-bold text-shadow tracking-wide italic`}
//         >
//           {frontmatter.title}
//         </h1>
//       </div>
//       <div className={`flex flex-wrap justify-end mt-3 gap-3 px-6`}>
//         {sortedFrontmatter.map(([key, value]) => (
//           <Frontmatter
//             key={key}
//             type={type}
//             label={key}
//             value={value}
//             isArray={Array.isArray(value)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
