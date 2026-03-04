"use client";

export default function TopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={scrollToTop}
        className="flex items-center justify-center w-12 h-12 text-gray-500 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
      </button>
    </div>
  );
}
