import { useEffect } from "react";
import { useCountdown } from "~/utils/hooks/useCountDown";

type CountDownProps = {
  onFinish: Function;
};

const CountDown = ({ onFinish }: CountDownProps) => {
  const { count, formatCountdown } = useCountdown(5);

  useEffect(() => {
    if (Math.floor(count) === 5000) {
      onFinish();
    }
  }, [count]);

  return <div>The game will start in {formatCountdown()}</div>;
};

export default CountDown;
