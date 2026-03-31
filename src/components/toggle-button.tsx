import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./ui/button";

export function ToggleButton({
  onClick,
  isExpanded,
}: {
  onClick: () => void;
  isExpanded: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center justify-center gap-2"
    >
      {isExpanded ? (
        <>
          <span className="w-10">접기</span>
          <ChevronDoubleUpIcon className="w-5 h-5" />
        </>
      ) : (
        <>
          <span className="w-10">펼치기</span>
          <ChevronDoubleDownIcon className="w-5 h-5" />
        </>
      )}
    </Button>
  );
}
