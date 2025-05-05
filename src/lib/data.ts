import { createClient } from "@supabase/supabase-js";
import { Board } from "./definitions";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function fetchBoards(query: string, currentPage: number) {
  const offset = (currentPage - 1) * 25;
  const { data, error } = await supabase
    .from("board")
    .select("*")
    .or(`title.ilike.%${query},writer.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .range(offset, offset + 24);
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data;
  }
}

export async function fetchBoardById(id: string) {
  const { data, error } = await supabase.from("board").select("*").eq("id", id);

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data[0] as Board;
  }
}
