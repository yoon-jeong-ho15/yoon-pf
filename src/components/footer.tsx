export default function Footer() {
  return (
    <footer className="text-gray-500 text-sm py-4 w-full pointer-events-none absolute bottom-0">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <span>© {new Date().getFullYear()} 윤정호.</span>
        <div></div>
      </div>
    </footer>
  );
}
