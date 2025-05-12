import { User } from "@/lib/definitions";
import NoProfile from "public/no-profile";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div
      className="
        flex flex-row h-full w-2/3"
    >
      <div className="bg-white/60 rounded-[15%] border-8 border-white h-full w-auto">
        <NoProfile size="full" />
      </div>
      <ul className="flex flex-col mx-10 items-center h-full text-2xl">
        <li>
          <span>{user.from}</span>
        </li>
        <li>
          <span>{user.username}</span>
        </li>
      </ul>
    </div>
  );
}
