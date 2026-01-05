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
       h-14 w-auto mt-4 mx-4 md:mx-6 text-2xl shadow-lg
       border-gray-400 border-1 bg-gray-100
       rounded-2xl font-[500] text-shadow-xs/10
       md:justify-around
     `}
    >
      <NavLinks />
      <MobileNavLabel />
      <MobileMenu />
    </nav>
  );
}
