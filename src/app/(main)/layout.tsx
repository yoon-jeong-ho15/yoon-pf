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
      <div id="main-layout" className="flex flex-col flex-grow">
        {children}
      </div>
      <Footer />
    </SessionProvider>
  );
}
