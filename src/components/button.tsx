import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
} from "@heroicons/react/24/outline";

export function ToggleButton({
  onClick,
  isExpanded,
}: {
  onClick: () => void;
  isExpanded: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 p-1 px-4 border-gray-300 ${
        isExpanded ? "" : ""
      }`}
    >
      {isExpanded ? (
        <>
          <span className="w-10">접기</span>
          <ChevronDoubleUpIcon className="w-6 h-6" />
        </>
      ) : (
        <>
          <span className="w-10">펼치기</span>
          <ChevronDoubleDownIcon className="w-6 h-6" />
        </>
      )}
    </button>
  );
}
