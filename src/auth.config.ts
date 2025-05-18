import { NextAuthConfig } from "next-auth";
import { User } from "@/lib/definitions";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // const isAdmin = (auth?.user as User).username == "윤정호" ? true : false;
      const isOnBoard = nextUrl.pathname.startsWith("/more");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      // const isOnDynamicChat = nextUrl.pathname.startsWith("/more/chat/[id]");

      if (isOnBoard) {
        if (isLoggedIn) return true;
        return false;
      }
      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/more", nextUrl));
        }
      }
      // if (isOnDynamicChat) {
      //   if (isAdmin) return true;
      //   return false;
      // }
    },
  },
  providers: [],
} satisfies NextAuthConfig;
