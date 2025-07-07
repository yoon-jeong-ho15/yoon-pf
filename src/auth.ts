import type { AuthUser } from "@/lib/definitions";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { supabase } from "./lib/supabase";

async function getUser(username: string): Promise<AuthUser> {
  const { data: user, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username);

  if (error) {
    console.error("Failed to fetch user", error);
    throw new Error("Failed to fetch user.");
  }
  return user[0];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: {
          label: "이름",
          placeholder: "게스트",
        },
        password: {
          label: "password",
          placeholder: "999999",
        },
      },
      authorize: async (credentials) => {
        let user = null;

        const { username, password } = await signInSchema.parseAsync(
          credentials
        );

        user = await getUser(username);
        const passwordsMatch = user.password == password ? true : false;

        if (!user) {
          throw new Error("no user");
        }

        if (!passwordsMatch) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
});
