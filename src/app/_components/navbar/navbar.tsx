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
      border-b border-gray-400
       font-[500] text-shadow-xs/10
       md:justify-around
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
