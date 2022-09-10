import React, { useEffect, useState } from "react";
import { useAppStore } from "../../hooks/useAppStore";
import useHotkey from "../../hooks/useHotkey";
import { getSpanArray } from "../../util/static/getSpanArray";

import { Transition } from "@headlessui/react";

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

  return (
    <div className="flex flex-row gap-5 justify-center items-center">
      <Transition
        show={keysPressed.includes("Alt")}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <span className="text-2xl font-bold text-slate-100 bg-[#00000080] p-3 rounded-lg">
          Alt
        </span>
      </Transition>
      <span className="text-lg text-slate-50 font-bold">+</span>
      {/* <Transition
        show={keysPressed.includes("Enter")}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      > */}
      <span className="text-lg font-bold text-slate-100 bg-[#00000080] p-3 rounded-lg">
        Enter
      </span>
      {/* </Transition> */}
    </div>
  );
};

export default HotkeyDisplay;
