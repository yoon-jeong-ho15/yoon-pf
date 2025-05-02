"use server";

import { auth, signIn } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@/lib/definitions";
import AuthError from "next-auth";
import { Delta } from "quill";
import { NextURL } from "next/dist/server/web/next-url";
import { redirect } from "next/navigation";

const sql = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    console.log("formData : ", formData);
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
  const session = await auth();
  const user: User | null = (session?.user as User) || null;
  console.log("content : ", content);
  console.log("user : ", user);
  const { error } = await sql.from("board").insert({
    writer: user?.username,
    title: title,
    content: content,
  });
  if (error) {
    console.error("Error inserting Data : ", error);
  }
  return redirect("/more/board");
}
