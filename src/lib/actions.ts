"use server";

import { auth, signOut } from "@/auth";
import type { ChatMessage, AuthUser } from "@/lib/definitions";
import { supabase } from "./supabase";
// import { insertBlog, updateBlog, updateBlogStatus } from "./data/blog";
import {
  insertChat,
  fetchChatById,
  updateReadStatusByMessageId,
  fetchChatsByChatroomId,
} from "./data/chat";
import {
  checkExistingChatroom,
  insertChatroom,
  insertChatroomMember,
  fetchUnreadCountsByUserId,
} from "./data/chatroom";
import {
  fetchNotificationByUserId,
  updateNotificationReadAt,
  updateNotificationReadAtByMessageId,
} from "./data/notification";

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
// export async function createBlog(data: BlogInsertData) {
//   const error = insertBlog(data);
//   if (error) {
//     console.error("Error inserting Data : ", error);
//   }
//   return redirect("/blog");
// }

// export async function editBlog(data: BlogUpdateData) {
//   const error = await updateBlog(data);
//   if (error) {
//     console.error("Error updating Blog", error);
//   } else {
//     return redirect(`/blog/${data.id}`);
//   }
// }

// export async function deleteBlog(id: number) {
//   const error = await updateBlogStatus(id);
//   if (error) {
//     console.error("Error deleteing Blog", error);
//   }
// }

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

export async function markSingleMessageAsRead(
  messageId: string,
  userId: string
) {
  const [chatError, notificationError] = await Promise.all([
    updateReadStatusByMessageId(messageId, userId),
    updateNotificationReadAtByMessageId(messageId, userId),
  ]);

  if (chatError) {
    console.error("Error marking message as read", chatError);
  }
  if (notificationError) {
    console.error("Error marking notification as read", chatError);
  }
}

export async function getPrevChats(chatroomId: string) {
  const data = await fetchChatsByChatroomId(chatroomId);
  return data;
}
// chatroom
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function addChatroom(
  selectedFriend: string[],
  title?: string,
  usernames?: string[]
): Promise<{
  type: "error" | "success";
  msg: string;
  data?: string;
}> {
  const session = await auth();
  const user = session?.user as AuthUser;
  if (!session || !user) return { type: "error", msg: "no session" };
  selectedFriend.push(user.id);

  if (selectedFriend.length == 2) {
    const existing = await checkExistingChatroom(selectedFriend);

    if (existing) {
      console.error("dm채팅방 existing:", existing);
      return {
        type: "error",
        msg: "existing dm",
        data: existing,
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
    if (!title) {
      usernames?.push(user.username);
      title = usernames?.sort().join(", ");
    }
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

export async function getUnreadCountsMap(userId: string) {
  const data = await fetchUnreadCountsByUserId(userId);

  const countsMap = new Map();
  data.forEach((item: { chatroom_id: string; unread_count: number }) => {
    countsMap.set(item.chatroom_id.toString(), item.unread_count);
  });
  return countsMap;
}

// notification
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 아직 사용 안하는중
export async function readNotification(notificationId: number) {
  const error = await updateNotificationReadAt(notificationId);
  if (error) {
    console.error("Error updating notification", error);
  }
}

export async function getNotifications(userId: string) {
  const data = await fetchNotificationByUserId(userId);
  return data;
}
