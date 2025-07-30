// "use client";
// import { CategoryWithDetail } from "@/lib/definitions";
// import * as motion from "motion/react-client";

// export default function BlogItem({
//   blog,
//   position,
//   isChild = false,
//   index,
// }: {
//   blog: NonNullable<CategoryWithDetail["blogs"]>[0];
//   position: { top: number; left: number };
//   isChild?: boolean;
//   index: number;
// }) {
//   const initialTop = isChild ? `50%` : `${position.top}%`;
//   const initialLeft = isChild ? `50%` : `${position.left}%`;

//   return (
//     <motion.div
//       className="absolute"
//       initial={{ top: initialTop, left: initialLeft }}
//       animate={{ top: `${position.top}%`, left: `${position.left}%` }}
//       transition={{
//         duration: 2 + index * 0.5,
//         repeat: Infinity,
//         repeatType: "reverse",
//         ease: "easeInOut",
//       }}
//     >
//       <motion.div
//         drag
//         dragMomentum={false}
//         whileTap={{ cursor: "grabbing" }}
//         className={`
//             rounded-full size-3 bg-gray-400
//             shadow-lg cursor-grab
//             `}
//         animate={{
//           y: ["0%", "5%", "0%"],
//         }}
//       ></motion.div>
//     </motion.div>
//   );
// }
