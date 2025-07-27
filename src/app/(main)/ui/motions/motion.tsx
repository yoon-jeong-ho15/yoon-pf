"use client";

import { motion } from "motion/react";

export default function Motion() {
  return (
    <div className="w-full p-10">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          scale: { type: "spring", visualDuration: 0.5, bounce: 0.5 },
        }}
        className="w-30 h-30 bg-violet-600"
      />
    </div>
  );
}
