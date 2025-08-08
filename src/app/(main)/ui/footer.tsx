import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0">
        <ul className="flex items-center divide-x-1 divide-gray-300">
          <li className="px-4">윤정호</li>
          <li className="px-4">yoonjh1015@gmail.com</li>
        </ul>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <span className="hidden md:block px-3 text-gray-500">//</span>
        <ul className="flex items-center divide-x-1 divide-gray-400">
          <li className="px-4">
            <Link
              href="https://github.com/yoon-jeong-ho15/yoon-pf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors"
            >
              Source
            </Link>
          </li>
          <li className="px-4">
            <Link
              href="https://github.com/yoon-jeong-ho15"
              className="hover:text-blue-700 transition-colors"
            >
              GitHub
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
