import { createClient } from "@supabase/supabase-js";
import { Board, ChatMessage, Chatroom, User } from "./definitions";

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
    .eq("status", true)
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
    throw new Error("Failed to fetch the board");
  } else {
    return data[0] as Board;
  }
}

export async function fetchChatrooms(username: string) {
  console.log("fetchChatrooms username : ", username);
  const { data, error } = await supabase
    .from("chatroom")
    .select("*")
    .eq("user1", username);

  if (error) {
    console.error("Error fetching data : ", error);
    throw new Error("Failed to fetch Chatrooms");
  } else {
    return data as Chatroom[];
  }
}

export async function fetchOneChatroom(username: string) {
  console.log("fetchOneChatroom username : ", username);
  const { data, error } = await supabase
    .from("chatroom")
    .select("*")
    .eq("user2", username);

  if (error) {
    console.error("Error fetching data : ", error);
    throw new Error("Failed to fetch one Chatroom");
  } else {
    return data[0];
  }
}

export async function fetchUserByUsername(username: string) {
  console.log("fetchUserByUsername username : ", username);
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username);
  if (error) {
    console.error("Error fetching data", error);
    throw new Error("Failed to fetch user by username");
  } else {
    const user: User = {
      id: data[0].id,
      username: data[0].username,
      from: data[0].from,
      pic: data[0].profile_pic,
    };
    return user;
  }
}

export async function fetchChatsByChatroomId(id: string) {
  console.log("getChatsByChatroomId id : ", id);
  const { data, error } = await supabase
    .from("chat_message")
    .select("*, user(profile_pic)")
    .eq("chatroom", id);

  if (error) {
    console.error("Error fetching Chats", error);
    throw new Error("Failed to fetch Chats by chatroom id");
  } else {
    return data as ChatMessage[];
  }
}
