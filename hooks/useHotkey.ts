import React, { useEffect, useState } from "react";

type PropTypes = {
  keys: string[];
  fn: () => void;
};

const useHotkey = (keys: string[], fn: () => void) => {
  const [hotkey, setHotkey] = useState<string[]>([]);
  const [key1, key2]: string[] = keys;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      if (event.key === "Alt" || event.key === "Enter") {
        event.stopPropagation();
        event.preventDefault();
        event.preventDefault();
        setHotkey((prev) => [...prev, event.key]);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setHotkey((prev) => prev.slice(0, prev.length - 1));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  if (hotkey.includes(key1) && hotkey.includes(key2)) {
    fn();
  }

  return hotkey;
};

export default useHotkey;
