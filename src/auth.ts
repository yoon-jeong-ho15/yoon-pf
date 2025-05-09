import type { User } from "@/lib/definitions";
import NextAuth from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authConfig } from "./auth.config";
import { z } from "zod";
import Credentials from "next-auth/providers/credentials";

const sql = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function getUser(username: string): Promise<User | undefined> {
  const { data: user, error } = await sql
    .from("user")
    .select("*")
    .eq("username", username);

  if (error) {
    console.error("Failed to fetch user", error);
    throw new Error("Failed to fetch user.");
  }
  return user[0];
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  //세션 토큰은 기본적으로 30일 유지
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          username: token.username as string,
          from: token.from as number,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.username = (user as User).username;
        token.from = (user as User).from;
      }
      return token;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string(),
            password: z.string(),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);

          if (!user) return null;
          const passwordsMatch = user.password == password ? true : false;

          if (passwordsMatch) return user;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
