import { logOut } from "@/lib/actions";

export default function Logout() {
  return (
    <form action={logOut}>
      <button className="hover:bg-indigo-200 p-1.5 rounded-md transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
          />
        </svg>
      </button>
    </form>
  );
}
