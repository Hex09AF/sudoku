import { useCallback } from "react";
import Point from "./point";

type ScoreProps = {
  score: number;
  plusPoint: number;
  isUser: boolean;
  status: string;
};

export default function Score({
  score,
  plusPoint,
  isUser,
  status,
}: ScoreProps) {
  const MyPoint = useCallback(() => <Point plusPoint={plusPoint} />, [score]);

  return (
    <div
      className={`score-info user-cell ${isUser ? "user-cell" : "enemy-cell"}`}
    >
      <div>{isUser ? "MY" : ""} SCORE</div>
      <h2>{score || 0}</h2>
      <MyPoint />
      {status}
    </div>
  );
}
