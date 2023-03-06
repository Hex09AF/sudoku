import { useCallback } from "react";
import hashToAvatar from "~/helper/hash";
import Point from "./point";

type ScoreProps = {
  userId: string;
  score: number;
  plusPoint: number;
  isUser: boolean;
  status: string;
};

export default function Score({
  userId,
  score,
  plusPoint,
  isUser,
  status,
}: ScoreProps) {
  const MyPoint = useCallback(() => <Point plusPoint={plusPoint} />, [score]);

  const avatarStyle = {
    ["--avatar-image" as any]: `url(${hashToAvatar(userId)})`,
  };

  return (
    <div style={avatarStyle} className={`score-info`}>
      <div>{isUser ? "MY" : ""} SCORES</div>
      <h2>{score || 0}</h2>
      <MyPoint />
      {status === "NOT_READY" ? "NOT READY" : status}
    </div>
  );
}
