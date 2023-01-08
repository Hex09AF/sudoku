import { useCallback } from "react";
import Point from "./point";

export default function Score({ userId, score, plusPoint }) {
  const MyPoint = useCallback(() => <Point plusPoint={plusPoint} />, [score]);

  return (
    <div className="score-info">
      <div>{userId}</div>
      <h2>{score || 0}</h2>
      {score !== null && <MyPoint />}
    </div>
  );
}
