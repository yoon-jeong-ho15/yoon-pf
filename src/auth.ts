import type { AuthUser } from "@/lib/definitions";
import NextAuth from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

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
  //세션 토큰은 기본적으로 30일 유지
  callbacks: {
    session: ({ session, token }) => {
      // console.log("session() token: ", token);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          username: token.username as string,
          from: token.from as number,
          pic: token.pic as string,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        // console.log("jwt() user : ", user);
        token.username = (user as AuthUser).username;
        token.from = (user as AuthUser).from;
        token.pic = (user as AuthUser).profile_pic;
      }
      return token;
    },
  },
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
