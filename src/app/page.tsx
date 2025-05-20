import * as motion from "motion/react-client";
import ExitAnimation from "./ui/motions/exit-animation";
import LayoutAnimation from "./ui/motions/layout-animation";
import ScrollTriggered from "./ui/motions/scroll-triggered";
import SharedLayoutAnimation from "./ui/motions/shared-layout-animation";

export default function Page() {
  return (
    <>
      <motion.div
        initial={false}
        animate={{ x: 100 }}
        className="w-100 h-100 bg-blue-300"
      />
      <LayoutAnimation />
      <SharedLayoutAnimation />
      <ExitAnimation />
      <ScrollTriggered />
    </>
  );
}
