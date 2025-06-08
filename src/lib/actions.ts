"use server";

import { auth } from "@/auth";
import type { User } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { fetchChatById, insertChat } from "./data";

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
