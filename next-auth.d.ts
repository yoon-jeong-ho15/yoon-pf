import NextAuth from "next-auth";
import type { User } from "@/lib/definitions";

declare module "next-auth" {
  //세션과 토큰 둘 다 사용하는 이유?
  interface Session {
    user: {
      id: string;
      username: string;
      from: number;
    };
  }
  interface JWT {
    username: string;
    from: number;
  }
}
