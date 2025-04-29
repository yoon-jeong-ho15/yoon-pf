import { createClient } from "@supabase/supabase-js";
// import { Board } from "./definitions";

const sql = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function fetchBoards(query: string, currentPage: number) {
  const offset = (currentPage - 1) * 5;
  const { data, error } = await sql
    .from("board")
    .select("*")
    .or(
      `title.ilike.%${query},writer.ilike.%${query}%,content.ilike.%${query}%`
    )
    .range(offset, offset + 4);
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("data:", data);
    return data.map((item) => ({
      id: item.id,
      createdAt: item.created_at,
      writer: item.writer,
      title: item.title,
      content: item.content,
    }));
  }
}
