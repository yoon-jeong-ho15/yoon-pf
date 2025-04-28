import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnBoard = nextUrl.pathname.startsWith("/board");
      if (isOnBoard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/board", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
