import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnBoard = nextUrl.pathname.startsWith("/more");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      if (isOnBoard) {
        if (isLoggedIn) return true;
        return false;
      }
      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/more", nextUrl));
        }
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
