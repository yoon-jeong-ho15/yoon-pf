import type { AuthUser } from "@/lib/definitions";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { supabase } from "./lib/supabase";
import { ZodError } from "zod";

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

function comparePasswords(
  dbPassword: number | string,
  inputPassword: string
): boolean {
  if (typeof dbPassword === "number") {
    return dbPassword === parseInt(inputPassword);
  } else if (typeof dbPassword === "string") {
    return dbPassword === inputPassword;
  }
  return false;
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
        try {
          // Zod 검증
          const { username, password } = await signInSchema.parseAsync(
            credentials
          );

          // console.log("=== LOGIN DEBUG ===");
          // console.log("Input username:", username);
          // console.log("Input password:", password, "type:", typeof password);

          const user = await getUser(username);

          if (!user) {
            throw new Error("존재하지 않는 사용자입니다.");
          }

          // console.log("DB user found:", user.username);
          // console.log(
          //   "DB password:",
          //   user.password,
          //   "type:",
          //   typeof user.password
          // );

          const passwordsMatch = comparePasswords(user.password, password);
          // console.log("Password comparison result:", passwordsMatch);
          // console.log("===================");

          if (!passwordsMatch) {
            throw new Error("생년월일이 올바르지 않습니다.");
          }

          return user;
        } catch (error) {
          console.error("Authorization error:", error);

          // Zod 검증 오류 처리
          if (error instanceof ZodError) {
            const passwordError = error.errors.find((err) =>
              err.path.includes("password")
            );
            if (passwordError) {
              if (
                passwordError.code === "too_small" ||
                passwordError.code === "too_big"
              ) {
                throw new Error("생년월일은 6자리로 입력해주세요.");
              }
              if (passwordError.code === "invalid_string") {
                throw new Error("생년월일은 숫자만 입력해주세요.");
              }
            }

            const usernameError = error.errors.find((err) =>
              err.path.includes("username")
            );
            if (usernameError) {
              throw new Error("이름을 입력해주세요.");
            }

            throw new Error("입력 정보를 확인해주세요.");
          }

          // 다른 에러들은 그대로 전달
          throw error;
        }
      },
    }),
  ],
});
