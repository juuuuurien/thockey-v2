import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppStore } from "../../hooks/useAppStore";
import useHotkey from "../../hooks/useHotkey";
import { SENTENCE } from "../../util/static/static";
import Spinner from "../Spinner";

const TypingTest = () => {
  // Define "global" variables
  const { sentence, initializing: loading } = useAppStore((state) => state);

  console.log(sentence, "in typing test");

  let cursor: HTMLElement | null;
  let spanArray: Element[];
  let currWordIndex = useRef<number>(0);
  let currCharIndex = useRef<number>(0);
  let currWord = useRef<HTMLElement>();
  let currChar = useRef<string>();
  let words = useRef<string[][]>([]);

  words.current = sentence
    .split(" ")
    .map((word) => word.split("").map((char) => char));

  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(true);

  const keysPressed = useHotkey(["Alt", "Enter"], () =>
    console.log("Resetting!")
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      spanArray = Array.from(document.querySelectorAll(".word"));
      console.log(spanArray, "span array");

      cursor = document.getElementById("cursor");
      inputRef.current?.focus();
    }
  });

  const handleFocus = () => {
    if (!focused) setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === " ") return;

    const currWordSpans = Array.from(
      spanArray[currWordIndex.current]?.children
    );
    const currTextChars = e.target.value.trim().split("");

    // Determines if the e.target.value contains any extra characters
    // that are not included in the test word.
    if (
      e.target.value.trim().length >
        words.current[currWordIndex.current].length ||
      currWordSpans.length > words.current[currWordIndex.current].length
    ) {
      // Determines whether or not user is appending extra characters
      if (e.target.value.length > currWordSpans.length) {
        //appending more extras
        let extraChar = e.target.value.slice(-1);

        const newSpan = document.createElement("span");
        newSpan.innerHTML = extraChar;
        newSpan.classList.add("extra");
        spanArray[currWordIndex.current].appendChild(newSpan);
      }

      // Determines whether or not user is deleting extra characters
      if (e.target.value.length <= currWordSpans.length) {
        spanArray[currWordIndex.current].lastChild?.remove();
      }

      // Determines if user has deleted the whole contents of the text input
      if (e.target.value.length < words.current[currWordIndex.current].length) {
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
      currWordIndex.current++; // Increment wordIndex
      currCharIndex.current = 0; // Reset charIndex
      setText("");
    } else {
      currCharIndex.current = e.target.value.length; // Sets the char index to exactly end of input
      setText(e.target.value);
    }
  };

  useEffect(() => {
    // Controller that updates the cursor position
    if (cursor !== null) {
      const currWordSpan = spanArray[currWordIndex.current] as HTMLElement;
      const currCharSpan = Array.from(
        spanArray[currWordIndex.current].children
      )[currCharIndex.current] as HTMLElement;
      console.log(currCharSpan, "currCharSpan");
      const prevCharSpan = Array.from(
        spanArray[currWordIndex.current].children
      )[currCharIndex.current - 1] as HTMLElement;

      if (currCharSpan) {
        cursor.style.top = `${currCharSpan.offsetTop}px`;
        cursor.style.left = `${currCharSpan.offsetLeft - 2}px`;
        // cursor.style.width = `${currCharSpan.clientWidth}px`;
        // cursor.style.height = `${currCharSpan.clientHeight}px`;
      } else {
        cursor.style.top = `${prevCharSpan.offsetTop}px`;
        cursor.style.left = `${
          prevCharSpan.offsetLeft + prevCharSpan.offsetWidth
        }px`;
        // cursor.style.width = `${prevCharSpan.clientWidth}px`;
        // cursor.style.height = `${prevCharSpan.clientHeight}px`;
      }
    }
  });

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div
        className={`relative flex justify-center items-center w-[50%] md:min-w-[720px] h-auto min-h-[124px] p-8 bg-[#10364945] backdrop-blur-sm rounded-2xl text-xl bg-blend-multiply text-slate-50 font-DM font-light transition-all duration-300 ${
          focused ? null : "blur-sm opacity-50"
        }`}
      >
        <div className="absolute top-0 left-0 w-[20%] mt-[-64px] ml-2">
          <Image src="/Thockey_logo.svg" layout="fill" objectFit="contain" />
        </div>
        <div
          onClick={() => inputRef.current?.focus()}
          className={`relative flex flex-wrap text-slate-50`}
        >
          {loading && <Spinner />}
          {!loading && (
            <>
              <div id="cursor" className="cursor" />
              {sentence.split(" ").map((word) => (
                <span className="word">
                  {word.split("").map((char) => (
                    <span className="char">{char}</span>
                  ))}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
      <input
        id="text_input"
        ref={inputRef}
        value={text}
        onChange={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default TypingTest;
