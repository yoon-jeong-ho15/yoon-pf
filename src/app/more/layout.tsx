import BoardNav from "./ui/board-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <BoardNav />
      {children}
    </div>
  );
}
