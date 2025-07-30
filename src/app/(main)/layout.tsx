import Navbar from "./ui/navbar";
import Footer from "./ui/footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col flex-grow">{children}</div>
      <Footer />
    </>
  );
}
