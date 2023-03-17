import { useState, useEffect, useCallback } from "react";

export function useCountdown(duration: number) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let start: number, previousTimeStamp: number;

    function step(timestamp: number) {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - start;

      if (previousTimeStamp !== timestamp) {
        setCount(Math.min(elapsed, duration * 1000));
      }

      if (Math.floor(elapsed) <= duration * 1000) {
        previousTimeStamp = timestamp;
        requestAnimationFrame(step);
      } else {
        setDone(true);
      }
    }

    const frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [duration]);

  const formatCountdown = useCallback(() => {
    const remaining = Math.floor((duration * 1000 - count) / 1000);
    const milliseconds = Math.floor(
      (Math.floor(duration * 1000 - count) % 1000) / 100
    );
    return `${remaining.toString()}.${milliseconds.toString()}`;
  }, [count, duration]);

  return { done, count, formatCountdown };
}
