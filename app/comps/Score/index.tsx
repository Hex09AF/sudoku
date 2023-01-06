import { useCallback } from "react";
import Point from "./point";

export default function Score({ userId, score, plusPoint }) {

  const MyPoint = useCallback(
    () => <Point plusPoint={plusPoint} />,
    [plusPoint]
  );

  return (
    <div className="score-info">
      <div>{userId}</div>
      <h2>{score}</h2>
      <MyPoint />
    </div>
  );
}
