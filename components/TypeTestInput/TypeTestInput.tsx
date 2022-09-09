import { useEffect, useRef, useState, forwardRef } from "react";
import { useAppStore } from "../../hooks/useAppStore";
import useHotkey from "../../hooks/useHotkey";

type PropTypes = {
  sentence: string;
  focused: boolean;
  setFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setInitialized: (initialized: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  initialized: boolean;
  initializing: boolean;
};

const TypeTestInput = forwardRef<HTMLInputElement, PropTypes>(
  (
    {
      sentence,
      focused,
      setFocused,
      setInitialized,
      setInitializing,
      initialized,
      initializing,
    }: PropTypes,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    let cursor: HTMLElement | null = document.getElementById("cursor");

    const [inputText, setInputText] = useAppStore((state) => [
      state.inputText,
      state.setInputText,
    ]);
    const words = useAppStore((state) => state.words);
    const currWordIndex = useAppStore((state) => state.currWordIndex);
    const currCharIndex = useAppStore((state) => state.currCharIndex);
    const incrementWordIndex = useAppStore((state) => state.incrementWordIndex);
    const resetWordIndex = useAppStore((state) => state.resetWordIndex);
    const resetCharIndex = useAppStore((state) => state.resetCharIndex);
    const setCharIndex = useAppStore((state) => state.setCharIndex);

    const resetGame = useAppStore((state) => state.resetGame);

    const inputRef = useRef<HTMLInputElement>(null);

    let spanArray = Array.from(document.getElementsByClassName("word"));
    useEffect(() => {
      if (!spanArray || spanArray.length < 1)
        spanArray = Array.from(document.getElementsByClassName("word"));
    });

    const handleFocus = () => {
      if (!focused) setFocused(true);
    };

    const handleBlur = () => {
      setFocused(false);
    };

    const handleAbort = () => {
      console.log(" in handleAbort");
      resetGame();
      spanArray.forEach((word) => {
        let _word = Array.from(word.children);
        _word.forEach((letter) => {
          letter.classList.remove("right", "wrong");
          if (letter.classList.contains("extra")) letter.remove();
        });
      });
    };

    const keysPressed = useHotkey(["Alt", "Enter"], handleAbort);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === " ") return;

      const input = e.target.value.trim();

      const currWordSpans = Array.from(spanArray[currWordIndex]?.children);
      const currTextChars = e.target.value.trim().split("");

      //=============================== Game Functions ==============================
      // if (idle && !started) {
      //   startTest();
      // }

      // Determines if the e.target.value contains any extra characters
      // that are not included in the test word.
      if (
        e.target.value.trim().length > words[currWordIndex].length ||
        currWordSpans.length > words[currWordIndex].length
      ) {
        // Determines whether or not user is appending extra characters
        if (e.target.value.length > currWordSpans.length) {
          //appending more extras if the extra char isn't a space
          let extraChar = e.target.value.slice(-1);
          if (extraChar !== " ") {
            const newSpan = document.createElement("span");
            newSpan.innerHTML = extraChar;
            newSpan.classList.add("extra");
            spanArray[currWordIndex].appendChild(newSpan);
          }
        }

        // Determines whether or not user is deleting extra characters
        if (e.target.value.length <= currWordSpans.length) {
          spanArray[currWordIndex].lastChild?.remove();
        }

        // Determines if user has deleted the whole contents of the text input
        if (e.target.value.length < words[currWordIndex].length) {
          currWordSpans.forEach((span) => {
            if (span.classList.contains("extra")) span.remove();
          });
        }
      }

      // Controller that handles the styles of the characters within the dom
      currWordSpans.forEach((el, i) => {
        // Loop through current word and apply right, wrong, class changes.
        // compare each element child (character) to the characters in text.
        if (currTextChars[i]) {
          if (currTextChars[i] === el.innerHTML) {
            el.classList.add("right");
            // if (
            //   currWordIndex === words.length - 1 &&
            //   currCharIndex ===
            //     words[currWordIndex].length - 1
            // ) {
            //   finishTest();
            // }
          } else {
            el.classList.add("wrong");
          }
        } else {
          el.classList.remove("right", "wrong");
        }
      });

      // Controller that handles index increments
      if (/\s+$/.test(e.target.value)) {
        // If text input ends with space, move onto the next word
        incrementWordIndex(); // Increment wordIndex
        resetCharIndex(); // Reset charIndex
        setInputText("");
      } else {
        setCharIndex(e.target.value.length); // Sets the char index to exactly end of input
        setInputText(e.target.value);
      }
    };

    useEffect(() => {
      // Controller that updates the cursor position
      if (cursor !== null) {
        const currWordSpan = spanArray[currWordIndex] as HTMLElement;
        const currCharSpan = Array.from(spanArray[currWordIndex].children)[
          currCharIndex
        ] as HTMLElement;
        const prevCharSpan = Array.from(spanArray[currWordIndex].children)[
          currCharIndex - 1
        ] as HTMLElement;

        // console.log(prevCharSpan, currCharSpan, "prevCharSpan, currCharSpan");

        if (currCharSpan) {
          // console.log("setting cursor to currCharSpan");
          cursor.style.top = `${currCharSpan.offsetTop}px`;
          cursor.style.left = `${currCharSpan.offsetLeft - 2}px`;
          // cursor.style.width = `${currCharSpan.clientWidth}px`;
          // cursor.style.height = `${currCharSpan.clientHeight}px`;
        } else {
          if (prevCharSpan) {
            cursor.style.top = `${prevCharSpan?.offsetTop}px`;
            cursor.style.left = `${
              prevCharSpan.offsetLeft + prevCharSpan?.offsetWidth
            }px`;
            // cursor.style.width = `${prevCharSpan.clientWidth}px`;
            // cursor.style.height = `${prevCharSpan.clientHeight}px`;
          }
        }

        inputRef.current?.focus();
      }
    }, [inputText, initialized, initializing, spanArray]);

    return (
      <>
        <input
          className="self-start h-10 mr-4 focus:ring-2 focus:ring-pink-200 border-none focus:outline-none rounded-md opacity-0 "
          id="text_input"
          ref={ref}
          value={inputText}
          onChange={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </>
    );
  }
);

export default TypeTestInput;
