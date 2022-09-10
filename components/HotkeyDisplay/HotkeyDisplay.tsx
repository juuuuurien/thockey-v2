import React, { useEffect, useState } from "react";
import { useAppStore } from "../../hooks/useAppStore";
import useHotkey from "../../hooks/useHotkey";
import { getSpanArray } from "../../util/static/getSpanArray";

import { Transition } from "@headlessui/react";
import Image from "next/image";
import AltKey from "./Hotkeys/AltKey";
import EnterKey from "./Hotkeys/EnterKey";

const HotkeyDisplay = () => {
  const resetGame = useAppStore((state) => state.resetGame);
  const spanArray = getSpanArray();

  const keysPressed = useHotkey(["Alt", "Enter"], () => {
    console.log(" in handleAbort");
    resetGame();
    spanArray.forEach((word) => {
      let _word = Array.from(word.children);
      _word.forEach((letter) => {
        letter.classList.remove("right", "wrong");
        if (letter.classList.contains("extra")) letter.remove();
      });
    });
  });

  console.log(keysPressed);

  return (
    <div className="flex flex-row gap-3 justify-center items-center">
      <span
        className={` ${keysPressed.includes("Alt") ? "translate-y-1" : null}`}
      >
        <AltKey />
      </span>
      <span className="text-xl text-gray-900 font-bold">{"+"}</span>
      <span
        className={` ${keysPressed.includes("Enter") ? "translate-y-1" : null}`}
      >
        <EnterKey />
      </span>
      <span className="text-lg text-gray-900 font-bold">{"= reset"}</span>
    </div>
  );
};

export default HotkeyDisplay;
