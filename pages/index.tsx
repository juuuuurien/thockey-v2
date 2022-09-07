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
import { SENTENCE } from "../util/static/static";

/* ==================================================
  Generate random sentence
  Split that into 2D array of [word][chars]
  Render that into the DOM as [span][span]
  Initialize global variables --> wordIndex and charIndex = 0
 
  === USER CONTROLS ===
  Game starts when user hits any alphanumerical key
     Start timer
 
  Any alphanumerical increments charIndex
     if charIndex > 0 --> pressing space button increments wordIndex
 
  This goes on until last character entered matches the last character in the sentence. 
  ================================================== */

const Home: NextPage = () => {
  // Define "global" variables
  let cursor: HTMLElement | null;
  let spanArray: Element[];
  let currWordIndex = useRef<number>(0);
  let currCharIndex = useRef<number>(0);
  let currWord = useRef<HTMLElement>();
  let currChar = useRef<string>();
  let words = useRef<string[][]>([]);
  words.current = SENTENCE.split(" ").map((word) =>
    word.split("").map((char) => char)
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);

  if (typeof window !== "undefined") {
    const getSpanArray = useCallback(() => {
      return Array.from(document.querySelectorAll(".word"));
    }, [SENTENCE]);

    spanArray = useMemo(getSpanArray, [SENTENCE]);
    cursor = document.getElementById("cursor");
  }

  const handleFocus = () => {
    if (!focused) setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === " ") return;
    const currWordSpans = Array.from(spanArray[currWordIndex.current].children);
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

  useLayoutEffect(() => {
    // Controller that updates the cursor position
    if (cursor !== null) {
      const currWordSpan = spanArray[currWordIndex.current] as HTMLElement;
      const currCharSpan = Array.from(
        spanArray[currWordIndex.current].children
      )[currCharIndex.current] as HTMLElement;
      const prevCharSpan = Array.from(
        spanArray[currWordIndex.current].children
      )[currCharIndex.current - 1] as HTMLElement;

      if (currCharSpan) {
        cursor.style.top = `${currCharSpan.offsetTop}px`;
        cursor.style.left = `${currCharSpan.offsetLeft - 1}px`;
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
  }, [text]);

  return (
    <div className="relative h-screen w-screen">
      <Head>
        <title>Thockey.io</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <div
          className={`relative w-[50%] md:min-w-[720px] h-auto p-8 bg-[#10364945] backdrop-blur-sm rounded-2xl text-xl bg-blend-multiply text-slate-50 font-DM font-light transition-all duration-300 ${
            focused ? null : "blur-sm opacity-50"
          }`}
        >
          <div className="absolute top-0 left-0 h-[100px] w-[20%] mt-[-64px] ml-2">
            <Image src="/Thockey_logo.svg" layout="fill" objectFit="contain" />
          </div>
          <div
            onClick={() => inputRef.current?.focus()}
            className={`relative flex flex-wrap text-slate-50`}
          >
            <div id="cursor" className="cursor" />
            {SENTENCE.split(" ").map((word) => (
              <span className="word">
                {word.split("").map((char) => (
                  <span className="char">{char}</span>
                ))}
              </span>
            ))}
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
      <video
        autoPlay
        muted
        loop
        width={"100%"}
        height={"100%"}
        className={`absolute top-0 left-0 object-cover h-full z-[-1] transition-all duration-500`}
      >
        <source src="/assets/BlossomBG.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default Home;
