// "use client";
// import { useEffect, useRef } from "react";
// import Item from "./c-pr-item";
// import { animate } from "motion";

// type itemData = {
//   id: number;
//   blog: { id: number; title: string }[];
//   children: itemData[];
// };

// export default function CategoryViewPR() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef(new Map<number, HTMLDivElement>());

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const onMouseMove = (e: MouseEvent) => {
//       for (const ref of itemRefs.current.values()) {
//         const rect = ref.getBoundingClientRect();
//         const x = e.clientX - (rect.left + rect.width / 2);
//         const y = e.clientY - (rect.top + rect.height / 2);
//         const distance = Math.sqrt(x * x + y * y);
//         const maxDistance = 250; // Max distance to feel the "gravity"

//         if (distance < maxDistance) {
//           const pullStrength = 1 - distance / maxDistance;
//           animate(
//             ref,
//             {
//               transform: `translate(${x * pullStrength * 0.3}px, ${
//                 y * pullStrength * 0.3
//               }px)`,
//             },
//             { duration: 0.1, ease: "ease-out" }
//           );
//         } else {
//           animate(
//             ref,
//             { transform: "translate(0px, 0px)" },
//             { duration: 0.5, type: "spring", damping: 10, stiffness: 100 }
//           );
//         }
//       }
//     };

//     const onMouseLeave = () => {
//       for (const ref of itemRefs.current.values()) {
//         animate(
//           ref,
//           { transform: "translate(0px, 0px)" },
//           { duration: 0.5, type: "spring", damping: 10, stiffness: 100 }
//         );
//       }
//     };

//     container.addEventListener("mousemove", onMouseMove);
//     container.addEventListener("mouseleave", onMouseLeave);

//     return () => {
//       container.removeEventListener("mousemove", onMouseMove);
//       container.removeEventListener("mouseleave", onMouseLeave);
//     };
//   }, []);

//   const renderItems = (items: itemData[]) => (
//     <ul className="space-y-2 pl-4">
//       {items.map((item) => (
//         <li key={item.id}>
//           <div ref={(el) => el && itemRefs.current.set(item.id, el)}>
//             <Item title={item.blog.map((b) => b.title).join(", ")} />
//           </div>
//           {item.children.length > 0 && renderItems(item.children)}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <div ref={containerRef} className="relative p-8">
//       {renderItems(data)}
//     </div>
//   );
// }

// const data: itemData[] = [
//   {
//     id: 1,
//     blog: [{ id: 1, title: "First Post" }],
//     children: [
//       {
//         id: 11,
//         blog: [
//           { id: 2, title: "Getting Started with Next.js" },
//           { id: 3, title: "Tailwind CSS Best Practices" },
//         ],
//         children: [
//           {
//             id: 111,
//             blog: [
//               { id: 4, title: "Advanced React Patterns" },
//               { id: 5, title: "State Management in React" },
//               { id: 6, title: "Server-side Rendering Explained" },
//             ],
//             children: [
//               {
//                 id: 1111,
//                 blog: [
//                   { id: 7, title: "Deep Dive into WebSockets" },
//                   { id: 8, title: "Optimizing Performance" },
//                   { id: 9, title: "Database Indexing Strategies" },
//                   { id: 10, title: "Micro-frontend Architecture" },
//                 ],
//                 children: [],
//               },
//               {
//                 id: 1112,
//                 blog: [
//                   { id: 11, title: "CI/CD Pipelines for Web Apps" },
//                   { id: 12, title: "Dockerizing a Next.js App" },
//                   { id: 13, title: "Kubernetes for Beginners" },
//                   { id: 14, title: "Monitoring and Logging" },
//                 ],
//                 children: [],
//               },
//             ],
//           },
//           {
//             id: 112,
//             blog: [
//               { id: 15, title: "Introduction to GraphQL" },
//               { id: 16, title: "Building a REST API with Node.js" },
//               { id: 17, title: "Authentication with NextAuth.js" },
//             ],
//             children: [
//               {
//                 id: 1121,
//                 blog: [
//                   { id: 18, title: "Real-time Chat with Supabase" },
//                   {
//                     id: 19,
//                     title: "PostgreSQL Functions and Triggers",
//                   },
//                   { id: 20, title: "Full-text Search in Postgres" },
//                   { id: 21, title: "Row Level Security in Supabase" },
//                 ],
//                 children: [],
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: 12,
//         blog: [
//           { id: 22, title: "UI/UX Design Principles" },
//           { id: 23, title: "Animations with Framer Motion" },
//         ],
//         children: [
//           {
//             id: 121,
//             blog: [
//               { id: 24, title: "Component Library with Storybook" },
//               { id: 25, title: "Testing React Components" },
//               { id: 26, title: "End-to-end Testing with Cypress" },
//             ],
//             children: [
//               {
//                 id: 1211,
//                 blog: [
//                   { id: 27, title: "Web Accessibility (a11y)" },
//                   { id: 28, title: "SEO for Modern Websites" },
//                   { id: 29, title: "Internationalization (i18n)" },
//                   { id: 30, title: "Content Security Policy (CSP)" },
//                 ],
//                 children: [],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 2,
//     blog: [{ id: 31, title: "My Second Post" }],
//     children: [
//       {
//         id: 21,
//         blog: [
//           { id: 32, title: "Data Structures in JavaScript" },
//           { id: 33, title: "Algorithms Explained" },
//         ],
//         children: [
//           {
//             id: 211,
//             blog: [
//               { id: 34, title: "Big O Notation" },
//               { id: 35, title: "Sorting Algorithms" },
//               { id: 36, title: "Graph Traversal" },
//             ],
//             children: [
//               {
//                 id: 2111,
//                 blog: [
//                   { id: 37, title: "Dynamic Programming" },
//                   { id: 38, title: "Greedy Algorithms" },
//                   { id: 39, title: "Divide and Conquer" },
//                   { id: 40, title: "Backtracking" },
//                 ],
//                 children: [],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 3,
//     blog: [{ id: 41, title: "Another Post" }],
//     children: [
//       {
//         id: 31,
//         blog: [
//           { id: 42, title: "Functional Programming in JS" },
//           { id: 43, title: "Object-Oriented Programming" },
//         ],
//         children: [
//           {
//             id: 311,
//             blog: [
//               { id: 44, title: "Closures and Scopes" },
//               { id: 45, title: "Promises and Async/Await" },
//               { id: 46, title: "Event Loop" },
//             ],
//             children: [
//               {
//                 id: 3111,
//                 blog: [
//                   { id: 47, title: "WebAssembly with Rust" },
//                   { id: 48, title: "Building a CLI with Go" },
//                   { id: 49, title: "Machine Learning with Python" },
//                   { id: 50, title: "Data Science Fundamentals" },
//                 ],
//                 children: [],
//               },
//               {
//                 id: 3112,
//                 blog: [
//                   { id: 51, title: "Cybersecurity Basics" },
//                   { id: 52, title: "Cryptography Explained" },
//                   { id: 53, title: "Network Protocols" },
//                   { id: 54, title: "Ethical Hacking" },
//                 ],
//                 children: [],
//               },
//               {
//                 id: 3113,
//                 blog: [
//                   { id: 55, title: "History of Computing" },
//                   { id: 56, title: "Quantum Computing" },
//                   { id: 57, title: "The Future of AI" },
//                   { id: 58, title: "Blockchain and Cryptocurrency" },
//                 ],
//                 children: [],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];
