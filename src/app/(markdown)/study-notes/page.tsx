import { getAllNotes } from "@/features/(markdown)/lib/data";
import Link from "next/link";
import Pagination from "./_components/pagination";

const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  return <div className="flex-1 flex flex-col"></div>;
}
