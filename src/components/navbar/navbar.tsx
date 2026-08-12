import { robotoMono } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { NavLinks } from "./nav-links";
import { MobileNavLabel } from "./mobile-nav-label";
import { MobileMenu } from "./mobile-menu";
import { OptionsPanel } from "../options-panel";

export default function Navbar() {
  return (
    <nav
      className={cn(
        robotoMono.className,
        "flex items-center h-13 w-full text-2xl border-b border-default font-medium text-shadow-xs/10 bg-surface pl-4 md:pl-6"
      )}
    >
      <NavLinks />
      <div className="md:hidden flex-1 flex justify-between items-center pr-4">
        <MobileNavLabel />
        <MobileMenu />
      </div>
      <div className="border-l border-default h-full flex items-center justify-center p-2">
        <OptionsPanel />
      </div>
    </nav>
  );
}
