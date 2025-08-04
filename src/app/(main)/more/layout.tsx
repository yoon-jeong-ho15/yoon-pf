import MoreNav from "./ui/more-nav";

export default function MoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="more-layout"
      className="
      flex flex-col w-full min-h-200"
    >
      <MoreNav />
      {children}
    </div>
  );
}
