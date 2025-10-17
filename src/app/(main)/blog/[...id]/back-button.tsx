"use client";

import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Back() {
  const router = useRouter();
  return (
    <ArrowUturnLeftIcon
      className="hidden md:flex size-6 stroke-3 stroke-gray-600 cursor-pointer hover:stroke-gray-800 transition-colors m-2 mr-5"
      onClick={() => router.back()}
    />
  );
}
