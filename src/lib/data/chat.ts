import { ChatMessage } from "../definitions";
import { supabase } from "../supabase";

export async function fetchChatsByChatroomId(chatroomId: string) {
  console.log("fetchChatsByChatroomId id : ", chatroomId);
  const { data, error } = await supabase
    .from("v_chat_message")
    .select("*")
    .eq("chatroom_id", chatroomId)
    .order("id");

  if (error) {
    console.error("Error fetching Chats", error);
    throw new Error("Failed to fetch Chats by chatroom id");
  } else {
    return data as ChatMessage[];
  }
}

export async function insertChat(formData: FormData) {
  // console.log("insertchat() formData : ", formData);
  const { data, error } = await supabase
    .from("chat_message")
    .insert({
      chatroom: formData.get("chatroom"),
      user_id: formData.get("user_id"),
      message: formData.get("message"),
    })
    .select("id");

  if (error) {
    console.error("Error inserting chat message", error);
  } else {
    return data[0].id;
  }
}

export async function fetchChatById(id: string) {
  const { data, error } = await supabase
    .from("v_chat_message")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error("Error fetching chat message", error);
  } else {
    return data[0] as ChatMessage;
  }
}

export async function fetchChatsWithReadStatus(chatroomId: string) {
  const { data, error } = await supabase.rpc(
    "get_chat_messages_with_read_status",
    {
      p_chatroom_id: chatroomId,
    }
  );

  if (error) {
    console.error(
      "Error fetching chats with read status:",
      JSON.stringify(error, null, 2)
    );
    return null;
  }

  return data;
}

export async function markMessageAsRead(messageId: string, userId: string) {
  const { error } = await supabase.rpc("mark_single_message_as_read", {
    p_message_id: messageId,
    p_user_id: userId,
  });

  if (error) {
    console.error("Error marking message as read", error);
  }
}
