import { robotoMono } from "@/app/fonts";
import { NavLinks } from "./nav-links";
import { MobileNavLabel } from "./mobile-nav-label";
import { MobileMenu } from "./mobile-menu";

export default function Navbar() {
  return (
    <nav
      className={`
       ${robotoMono.className}
       flex justify-between items-center 
       h-13 w-auto text-2xl
      border-b border-gray-500
       font-medium text-shadow-xs/10
       md:justify-around
       bg-surface
     `}
    >
      <NavLinks />
      <div className="md:hidden w-full flex justify-between items-center">
        <MobileNavLabel />
        <MobileMenu />
      </div>
    </nav>
  );
}
