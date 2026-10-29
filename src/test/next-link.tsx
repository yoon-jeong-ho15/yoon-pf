import type { ComponentProps } from "react";

// Browser component tests exercise menu behavior independently of Next's router.
export default function TestLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}
