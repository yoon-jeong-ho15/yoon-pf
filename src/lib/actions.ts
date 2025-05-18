"use server";

import { auth, signIn } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@/lib/definitions";
import AuthError from "next-auth";
import { redirect } from "next/navigation";
import { fetchUserByUsername } from "./data";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    console.log("authenticate() formData : ", formData);
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      const authError = error as { type?: string };
      switch (authError.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function createBoard(title: string, content: string) {
  console.log("createBoard : ", title);
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
  console.log("updateBoard()");
  console.log(formData.get("id"));
  console.log(formData.get("title"));
  console.log(formData.get("content"));
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
  console.log("deleting : ", id);
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

export async function sendMessage(formData: FormData) {
  console.log("sendMessage() formData : ", formData);
}

export async function getUser(username: string) {
  return fetchUserByUsername(username);
}
