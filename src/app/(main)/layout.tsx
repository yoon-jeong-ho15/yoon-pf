import Navbar from "./ui/navbar";
import Footer from "./ui/footer";
import { SessionProvider } from "next-auth/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Navbar />
      <div className="flex flex-col flex-grow items-center">{children}</div>
      <Footer />
    </SessionProvider>
  );
}
