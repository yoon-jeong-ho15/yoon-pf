import { object, string } from "zod";

export const signInSchema = object({
  username: string({ required_error: "이름을 입력해주세요" }),
  password: string({ required_error: "생년월일을 입력해주세요" }).min(6).max(6),
});
