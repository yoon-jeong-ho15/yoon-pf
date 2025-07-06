"use server";

import { auth, signOut } from "@/auth";
import type { User } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import {
  fetchChatById,
  checkExistingDM,
  insertChat,
  checkExistingGroupChat,
} from "./data";
import { PostgrestError } from "@supabase/supabase-js";

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

export async function createBoard(title: string, content: string) {
  // console.log("createBoard : ", title);
  const session = await auth();
  const user: User | null = (session?.user as User) || null;

  const { error } = await supabase.from("board").insert({
    writer: user?.username,
    title: title,
    content: content,
  });
  if (error) {
    console.error("Error inserting Data : ", error);
  }
  return redirect("/more/board");
}

export async function updateBoard(formData: FormData) {
  // console.log("updateBoard()");
  // console.log(formData.get("id"));
  // console.log(formData.get("title"));
  // console.log(formData.get("content"));
  const { error } = await supabase
    .from("board")
    .update({
      title: formData.get("title"),
      content: formData.get("content"),
      updated_at: "now()",
    })
    .eq("id", formData.get("id"));
  if (error) {
    console.error("Error updating Board", error);
  } else {
    return redirect("/more/board");
  }
}

export async function deleteBoard(id: string) {
  // console.log("deleting : ", id);
  const { error } = await supabase
    .from("board")
    .update({
      status: false,
    })
    .eq("id", id);
  if (error) {
    console.error("Error deleteing Board", error);
  }
}

export async function sendChatMessage(formData: FormData) {
  const chatroom = formData.get("chatroom");

  const newMessageId = await insertChat(formData);
  const newMessage = await fetchChatById(newMessageId);
  console.log("newMessage : ", newMessage);
  const channel = supabase.channel(`ch${chatroom}`);
  const result = await channel.send({
    type: "broadcast",
    event: "new-message",
    payload: newMessage,
  });

  // console.log("sendChatMessage()  result : ", result);
  return result;
}

export async function addChatroom(
  selectedFriend: string[],
  title?: string
): Promise<
  { type: "error" | "success"; msg: string; data?: string } | PostgrestError
> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { type: "error", msg: "no session" };
  selectedFriend.push(userId);
  title = title ? title : "";
  // console.log(selectedFriend);

  if (selectedFriend.length == 2) {
    // dm
    const existing = await checkExistingDM(selectedFriend);
    if (existing) {
      // 이미 있는 채팅
      console.log("dm채팅방 existing:", existing);
      return {
        type: "error",
        msg: "existing dm",
        data: existing[0]?.chatroom_id as string,
      };
    } else {
      const { data, error } = await supabase
        .from("chatroom")
        .insert({})
        .select("id")
        .single();
      const newChatroomId: string = data?.id;
      if (error) {
        // chatroom에 삽입 에러
        return error;
      } else {
        const insertingData = selectedFriend.map((item) => ({
          chatroom_id: newChatroomId,
          user_id: item,
        }));
        const { error } = await supabase
          .from("chatroom_member")
          .insert(insertingData);
        if (error) {
          //chatroom_member에 삽입 에러
          return error;
        } else {
          //chatroom_member에 삽입 성공
          return {
            type: "success",
            msg: "created new dm chat",
            data: newChatroomId,
          };
        }
      }
    }
  } else {
    // group chat
    const existing = await checkExistingGroupChat(selectedFriend, title);
    if (existing) {
      // 이미 있는 채팅
      console.log("그룹채팅방 existing:", existing);
      return {
        type: "error",
        msg: "existing group",
      };
    } else {
      const { data, error } = await supabase
        .from("chatroom")
        .insert({})
        .select("id")
        .single();
      const newChatroomId: string = data?.id;
      if (error) {
        // chatroom에 삽입 에러
        return error;
      } else {
        const insertingData = selectedFriend.map((item) => ({
          chatroom_id: newChatroomId,
          user_id: item,
        }));
        const { error } = await supabase
          .from("chatroom_member")
          .insert(insertingData);
        if (error) {
          //chatroom_member에 삽입 에러
          return error;
        } else {
          //chatroom_member에 삽입 성공
          return {
            type: "success",
            msg: "created new group chat",
            data: newChatroomId,
          };
        }
      }
    }
  }
}
