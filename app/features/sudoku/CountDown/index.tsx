import { useEffect } from "react";
import { useCountdown } from "~/utils/hooks/useCountDown";

type CountDownProps = {
  onFinish: Function;
};

const CountDown = ({ onFinish }: CountDownProps) => {
  const { done, formatCountdown } = useCountdown(5);

  useEffect(() => {
    if (done) {
      onFinish();
    }
  }, [done]);

  return (
    <div className="count-down-info">
      The game will start in {formatCountdown()}
    </div>
  );
};

export default CountDown;
