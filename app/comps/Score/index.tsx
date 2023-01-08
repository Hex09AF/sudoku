import { useCallback } from "react";
import Point from "./point";

export default function Score({ score, plusPoint, isUser }) {
  const MyPoint = useCallback(() => <Point plusPoint={plusPoint} />, [score]);

  return (
    <div
      className={`score-info user-cell ${isUser ? "user-cell" : "enemy-cell"}`}
    >
      <div>SCORE</div>
      <h2>{score || 0}</h2>
      {score !== null && <MyPoint />}
    </div>
  );
}
