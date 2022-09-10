import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../hooks/useAppStore";
import HotkeyDisplay from "../HotkeyDisplay/HotkeyDisplay";

import Spinner from "../Spinner/Spinner";
import TypeTestInput from "../TypeTestInput/TypeTestInput";

const TypingTest = () => {
  // // Define "global" variables
  // const sentence = useAppStore((state) => state.sentence);
  // const loading = useAppStore((state) => state.initializing);

  // let spanArray: Element[] = Array.from(
  //   document.getElementsByClassName("word")
  // );

  // console.log(inputRef, "inputRef");

  const initializing = useAppStore((state) => state.initializing);
  const initialized = useAppStore((state) => state.initialized);
  const setInitializing = useAppStore((state) => state.setInitializing);
  const setInitialized = useAppStore((state) => state.setInitialized);

  const wordAmount = useAppStore((state) => state.wordAmount);

  const sentence = useAppStore((state) => state.sentence);
  const words = useAppStore((state) => state.words);
  const setSentence = useAppStore((state) => state.setSentence);
  const setWords = useAppStore((state) => state.setWords);

  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState<boolean>(true);

  useEffect(() => {
    inputRef.current?.focus();
  }, [initialized]);

  const initializeApp = async () => {
    // First, initialize the sentence and words
    const response = await fetch(`/api/words?amount=${wordAmount}`);
    const sentence = await response.json();

    setSentence(sentence);
    setWords(sentence);
    setInitialized(true);
    setInitializing(false);
  };

  useEffect(() => {
    // To initialize, we need to get the initial sentence into the DOM
    if (!initialized) initializeApp();
  }, [initializeApp, initializing]);

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex flex-col justify-center items-center w-[50%] md:min-w-[720px]">
        <div
          className={`relative flex justify-center items-center self-center h-auto min-h-[148px] w-full p-8 mb-2 bg-[#10364945] backdrop-blur-sm rounded-2xl text-xl text-slate-50 font-DM font-light transition-all duration-300 ${
            focused ? null : "blur-sm opacity-50"
          }`}
        >
          <div className="absolute top-0 left-0 w-[25%] h-[60px] mt-[-44px] ml-2">
            <Image src="/Thockey_logo.svg" layout="fill" objectFit="contain" />
          </div>
          <div
            onClick={() => inputRef.current?.focus()}
            className={`relative flex flex-wrap text-slate-50`}
          >
            {initializing && <Spinner />}

            <div
              id="cursor"
              className={`cursor animate-pulse duration-[120] ${
                initializing && "hidden"
              }`}
            />
            <div
              className={`flex flex-wrap w-full ${initializing && "hidden"}`}
            >
              {sentence?.split(" ").map((word) => (
                <span className="word">
                  {word.split("").map((char) => (
                    <span className="char">{char}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`relative flex flex-row justify-center items-center w-full transition-all duration-300 ${
            focused ? null : "blur-sm opacity-50"
          }`}
        >
          <TypeTestInput
            ref={inputRef}
            sentence={sentence}
            focused={focused}
            setFocused={setFocused}
            setInitialized={setInitialized}
            setInitializing={setInitializing}
            initialized={initialized}
            initializing={initializing}
          />
          <HotkeyDisplay />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(TypingTest), {
  ssr: false,
});
