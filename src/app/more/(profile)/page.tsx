import UserProfile from "./ui/user-profile";
import UserInfo from "./ui/user-info";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <div>no session</div>;
  }

  const user = session.user;

  return (
    <div
      className="
      w-[90%] h-140 flex mt-3 p-8
      rounded-xl bg-linear-to-r
      from-indigo-500/50 to-blue-400/60
      "
    >
      <UserProfile user={user} />
      <UserInfo user={user} />
    </div>
  );
}
