"use client";

import { Button } from "./ui/button";

export default function TopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        variant="default"
        size="icon"
        onClick={scrollToTop}
        className="w-8 h-8 md:w-12 md:h-12 shadow-lg hover:scale-110"
        aria-label="맨 위로 올라가기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
      </Button>
    </div>
  );
}
