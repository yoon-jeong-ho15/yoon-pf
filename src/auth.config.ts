import type { NextAuthConfig } from "next-auth";
import type { AuthUser } from "@/lib/definitions";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as AuthUser)?.username === "윤정호";

      const isOnWritePage = nextUrl.pathname.startsWith("/more/board/write");
      const isOnMorePage = nextUrl.pathname.startsWith("/more");
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");

      if (isOnWritePage) {
        if (isLoggedIn && isAdmin) return true;
        return false;
      }

      if (isOnMorePage) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isOnLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/more", nextUrl));
        }
      }

      return true;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          username: token.username as string,
          from: token.from as number,
          profilePic: token.profilePic as string,
          friendGroup: token.friendGroup as string,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.username = (user as AuthUser).username;
        token.from = (user as AuthUser).from;
        token.profilePic = (user as AuthUser).profile_pic;
        token.friendGroup = (user as AuthUser).friend_group;
      }
      return token;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
