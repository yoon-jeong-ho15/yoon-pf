import { object, string } from "zod";

export const signInSchema = object({
  username: string({ required_error: "이름을 입력해주세요" }).min(
    1,
    "이름을 입력해주세요"
  ),
  password: string({ required_error: "생년월일을 입력해주세요" })
    .min(6, "생년월일은 6자리여야 합니다")
    .max(6, "생년월일은 6자리여야 합니다")
    .regex(/^\d{6}$/, "생년월일은 6자리 숫자여야 합니다"),
});
