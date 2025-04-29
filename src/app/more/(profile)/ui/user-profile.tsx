import { User } from "@/lib/definitions";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div
      className="
        flex flex-row h-full w-2/3"
    >
      <div className="bg-white/60 rounded-[15%] border-8 border-white h-full w-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
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
