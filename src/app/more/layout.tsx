import BoardNav from "./ui/board-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <BoardNav />
      {children}
    </div>
  );
}
