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
    .or(`title.ilike.%${query},writer.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .range(offset, offset + 4);
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data;
  }
}

export async function fetchBoardById(id: string) {
  const { data, error } = await sql.from("board").select("*").eq("id", id);

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log(data[0].content);
    return data[0];
  }
}
