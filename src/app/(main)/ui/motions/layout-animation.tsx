"use client";

import * as motion from "motion/react-client";
import { useState } from "react";

export default function LayoutAnimation() {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <button
      className="toggle-container bg-blue-400"
      style={{
        ...container,
        justifyContent: isOn ? "flex-start" : "flex-end",
        alignItems: "center",
      }}
      onClick={toggleSwitch}
    >
      <motion.div
        className="toggle-handle"
        style={handle}
        layout
        transition={{
          type: "spring",
          visualDuration: 0.2,
          bounce: 0.2,
        }}
      />
    </button>
  );
}

/**
 * ==============   Styles   ================
 */

const container = {
  width: 100,
  height: 50,
  // backgroundColor: "var(--hue-3-transparent)",
  borderRadius: 50,
  cursor: "pointer",
  display: "flex", // 추가
  padding: 10,
};

const handle = {
  width: 40, //50->40
  height: 40, //50->40
  backgroundColor: "#9911ff",
  borderRadius: "50%",
};
