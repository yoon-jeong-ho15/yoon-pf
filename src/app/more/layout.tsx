import { SessionProvider } from "next-auth/react";
import MoreNav from "./ui/more-nav";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // console.log("more/layout.tsx > session : ", session);
  if (!session || !session.user) {
    return <div>no session</div>;
  }
  return (
    <div className="flex flex-col items-center">
      <SessionProvider session={session}>
        <MoreNav />
        {children}
      </SessionProvider>
    </div>
  );
}
