export default function TabButtons({
  onSelectTab,
}: {
  onSelectTab: (tab: string) => void;
}) {
  return (
    <div className="ml-5">
      <button
        className="mr-2 p-2 rounded-md bg-gray-200"
        onClick={() => onSelectTab("summary")}
      >
        개요
      </button>
      <button
        className="p-2 rounded-md bg-gray-200"
        onClick={() => onSelectTab("chatting")}
      >
        채팅
      </button>
    </div>
  );
}
