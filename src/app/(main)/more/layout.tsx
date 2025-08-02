import MoreNav from "./ui/more-nav";

export default function MoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center w-full">
      <MoreNav />
      {children}
    </div>
  );
}
