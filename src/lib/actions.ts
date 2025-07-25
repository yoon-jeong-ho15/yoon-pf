"use server";

import { auth, signOut } from "@/auth";
import type {
  ChatMessage,
  BlogInsertData,
  BlogUpdateData,
} from "@/lib/definitions";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { fetchChatById, insertChat } from "./data/chat";
import { insertBlog, updateBlog, updateBlogStatus } from "./data/blog";
import {
  checkExistingChatroom,
  insertChatroom,
  insertChatroomMember,
} from "./data/chatroom";

// auth
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData
// ) {
//   try {
//     console.log("authenticate() formData : ", formData);
//     await signIn("credentials", formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       const authError = error as { type?: string };
//       switch (authError.type) {
//         case "CredentialsSignin":
//           return "Invalid credentials.";
//         default:
//           return "Something went wrong.";
//       }
//     }
//     throw error;
//   }
// }

export async function logOut() {
  await signOut({ redirectTo: "/more" });
}

// blog
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createBlog(data: BlogInsertData) {
  const error = insertBlog(data);
  if (error) {
    console.error("Error inserting Data : ", error);
  }
  return redirect("/blog");
}

export async function editBlog(data: BlogUpdateData) {
  const error = updateBlog(data);
  if (error) {
    console.error("Error updating Blog", error);
  } else {
    return redirect(`/blog/${data.id}`);
  }
}

export async function deleteBlog(id: number) {
  const error = await updateBlogStatus(id);
  if (error) {
    console.error("Error deleteing Blog", error);
  }
}

// chat
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
export async function sendChatMessage(formData: FormData) {
  const chatroom = formData.get("chatroom");

  const newMessageId = await insertChat(formData);
  const newMessage = (await fetchChatById(newMessageId)) as ChatMessage;
  // console.log("newMessage : ", newMessage);

  const channel = supabase.channel(`ch${chatroom}`);
  const result = await channel.send({
    type: "broadcast",
    event: "new-message",
    payload: newMessage,
  });

  // console.log("sendChatMessage()  result : ", result);
  return result;
}

export async function markMessageAsRead(messageId: string, userId: string) {
  const [chatResult, notifResult] = await Promise.all([
    supabase
      .from("chat_read_status")
      .update({ read_at: new Date().toISOString() })
      .eq("message_id", messageId)
      .eq("user_id", userId)
      .is("read_at", null),

    supabase
      .from("notification")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("type", "chat_message")
      .filter("data->message_id", "eq", messageId)
      .is("read_at", null),
  ]);

  return !chatResult.error && !notifResult.error;
}

// chatroom
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function addChatroom(
  selectedFriend: string[],
  title?: string
): Promise<{
  type: "error" | "success";
  msg: string;
  data?: string;
}> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { type: "error", msg: "no session" };
  selectedFriend.push(userId);

  if (selectedFriend.length == 2) {
    const existing = await checkExistingChatroom(selectedFriend);

    if (existing) {
      console.error("dm채팅방 existing:", existing);
      return {
        type: "error",
        msg: "existing dm",
        data: existing[0].chatroom_id as string,
      };
    } else {
      const newChatroomId = (await insertChatroom()) as string;

      const insertingData = selectedFriend.map((item) => ({
        chatroom_id: newChatroomId,
        user_id: item,
      }));

      const error = await insertChatroomMember(insertingData);
      if (error) {
        console.error("failed to insert chatrooms ", error);
      }
      return {
        type: "success",
        msg: "created new dm chat",
        data: newChatroomId,
      };
    }
  } else {
    const existing = await checkExistingChatroom(selectedFriend, title);

    if (existing) {
      console.log("그룹채팅방 existing:", existing);
      return {
        type: "error",
        msg: "existing group",
      };
    } else {
      const newChatroomId = (await insertChatroom()) as string;

      const insertingData = selectedFriend.map((item) => ({
        chatroom_id: newChatroomId,
        user_id: item,
      }));

      const error = await insertChatroomMember(insertingData);
      if (error) {
        console.error("failed to insert chatrooms ", error);
      }
      return {
        type: "success",
        msg: "created new group chat",
        data: newChatroomId,
      };
    }
  }
}

export async function markChatroomAsRead(chatroomId: string, userId: string) {
  const { data, error } = await supabase.rpc("mark_chatroom_as_read", {
    p_chatroom_id: chatroomId,
    p_user_id: userId,
  });

  if (error) {
    console.error("Error marking chatroom as read:", error);
    return false;
  }

  console.log(`Marked ${data?.[0]?.messages_read || 0} messages as read`);
  return true;
}

// notification
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 아직 사용 안하는중
export async function readNotification(notificationId: string) {
  const { error } = await supabase
    .from("notification")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .is("read_at", null);

  return !error;
}
