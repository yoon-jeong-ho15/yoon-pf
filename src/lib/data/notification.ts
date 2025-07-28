import { supabase } from "../supabase";

export async function updateNotificationReadAtByMessageId(
  messageId: string,
  userId: string
) {
  const { error } = await supabase
    .from("notification")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("type", "chat_message")
    .filter("data->message_id", "eq", messageId)
    .is("read_at", null);

  if (error) {
    return error;
  }
}
