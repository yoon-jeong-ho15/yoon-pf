import TopBar from "./top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        h-[100vh]
        flex flex-col items-center
        "
    >
      <TopBar />
      {children}
    </div>
  );
}
