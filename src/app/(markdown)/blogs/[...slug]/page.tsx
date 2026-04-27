import {
  getMDTree,
  getTreeItemBySlug,
  getPostBodyBySlug,
} from "@/features/(markdown)/lib/data";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const tree = getMDTree("blogs");
  const result = getTreeItemBySlug(tree, slug);

  if (!result) return notFound();

  const { type, data } = result;

  const body = getPostBodyBySlug("blogs", slug);

  if (!body) return notFound();

  return (
    <div className="flex-1 flex flex-col items-start min-h-screen p-4">
      {JSON.stringify(data)}
      <br />
      {body}
    </div>
  );
}
