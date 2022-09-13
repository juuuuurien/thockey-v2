import React, { useEffect, useRef } from "react";
import { useAppStore } from "../../hooks/useAppStore";

const Timer = () => {
  const idle = useAppStore((state) => state.idle);
  const started = useAppStore((state) => state.started);
  const finished = useAppStore((state) => state.finished);
  const time = useAppStore((state) => state.time);
  const setTime = useAppStore((state) => state.setTimeAndWPM);

  let timerRef = useRef<NodeJS.Timer | null>();

  useEffect(() => {
    console.log(started, "started in timer");

    if (started) {
      timerRef.current = setInterval(() => {
        console.log("Running in timer");
        setTime(time + 1, 0);
        console.log(time);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, idle, finished, time]);

  return <div className=" text-slate-50 text-2xl font-bold">{time}</div>;
};

export default Timer;
