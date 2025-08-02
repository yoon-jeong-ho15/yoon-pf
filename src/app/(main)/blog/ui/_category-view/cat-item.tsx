// "use client";
// import { CategoryWithDetail } from "@/lib/definitions";
// import { useState } from "react";
// import BlogItem from "./blog-item";
// import * as motion from "motion/react-client";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { top: 0, left: 0, opacity: 0 },
//   visible: (custom: { top: number; left: number }) => ({
//     top: `${custom.top}px`,
//     left: `${custom.left}px`,
//     opacity: 1,
//     transition: { type: "spring", stiffness: 100 },
//   }),
// };

// export default function CategoryItem({
//   category,
//   position,
//   index,
//   isChild = false,
// }: {
//   category: CategoryWithDetail;
//   position: { top: number; left: number };
//   index: number;
//   isChild?: boolean;
// }) {
//   const [showChildren, setShowChildren] = useState(false);
//   const [showBlogs, setShowBlogs] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (isDragging) {
//       setIsDragging(false);
//       return;
//     }
//     setShowChildren(!showChildren);
//     setShowBlogs(!showBlogs);
//   };

//   const initialTop = isChild ? `50%` : `${position.top}%`;
//   const initialLeft = isChild ? `50%` : `${position.left}%`;

//   return (
//     <motion.div
//       className="absolute"
//       style={{ top: initialTop, left: initialLeft }}
//     >
//       {!showChildren && !showBlogs && (
//         <motion.div
//           className={`p-4 rounded-full bg-blue-500 text-white shadow-lg cursor-grab`}
//           animate={{
//             y: ["0%", "5%", "0%"],
//           }}
//           transition={{
//             duration: 2 + index * 0.5,
//             repeat: Infinity,
//             repeatType: "reverse",
//             ease: "easeInOut",
//           }}
//           onClick={handleClick}
//           drag
//           dragMomentum={false}
//           onDragStart={() => setIsDragging(true)}
//           onDragEnd={() => setTimeout(() => setIsDragging(false), 10)}
//           whileTap={{ cursor: "grabbing" }}
//         >
//           <div>
//             {category.name} : {category.count || 0}
//           </div>
//         </motion.div>
//       )}

//       {showChildren &&
//         category.children?.map((child, j) => {
//           const childrenCount = category.children!.length;
//           const angle = (j / childrenCount) * 2 * Math.PI;
//           const radius = 150;
//           return (
//             <motion.div
//               key={`c${child.id}`}
//               custom={{
//                 top: radius * Math.sin(angle),
//                 left: radius * Math.cos(angle),
//               }}
//               variants={itemVariants}
//               className="absolute"
//             >
//               <CategoryItem
//                 category={child}
//                 position={{ top: 0, left: 0 }}
//                 isChild={true}
//                 index={j}
//               />
//             </motion.div>
//           );
//         })}

//       {showBlogs &&
//         category.blogs?.map((blog, j) => {
//           const blogsCount = category.blogs!.length;
//           const angle = (j / blogsCount) * 2 * Math.PI;
//           const radius = 75;
//           return (
//             <motion.div
//               key={`b${blog.id}`}
//               custom={{
//                 top: radius * Math.sin(angle),
//                 left: radius * Math.cos(angle),
//               }}
//               variants={itemVariants}
//               className="absolute"
//             >
//               <BlogItem
//                 blog={blog}
//                 position={{ top: 0, left: 0 }}
//                 isChild={true}
//                 index={j}
//               />
//             </motion.div>
//           );
//         })}
//     </motion.div>
//   );
// }
