import { useCallback } from "react";
import type { UserId } from "~/utils/declares/interfaces/Id";
import hashToAvatar, { randomHead } from "~/utils/helper/hash";
import Point from "./point";

type ScoreProps = {
  winner: UserId | null;
  userId: string;
  score: number;
  plusPoint: number;
  isUser: boolean;
  status: string;
  socketStatus: string;
};

export default function Score({
  winner,
  userId,
  score,
  plusPoint,
  isUser,
  status,
  socketStatus,
}: ScoreProps) {
  const MyPoint = useCallback(() => <Point plusPoint={plusPoint} />, [score]);

  const avatarStyle = {
    ["--avatar-image" as any]: `url(${hashToAvatar(userId)})`,
  };

  const onlineStatusClass =
    !winner && socketStatus === "OFFLINE" ? "user-offline" : "";

  const winnerClass = winner === userId ? "user-winner" : "";

  if (status === "VIEWER") {
    const viewerStyle = {
      ["--avatar-image" as any]: `url(${hashToAvatar(userId)})`,
      ["--viewer-hat" as any]: `"${randomHead()}"`,
    };
    return <div style={viewerStyle} className={`viewer-info`} />;
  }

  return (
    <div
      style={avatarStyle}
      className={`score-info ${onlineStatusClass} ${winnerClass}`}
    >
      <div>{isUser ? "My" : ""} Scores</div>
      <h3>{score || 0}</h3>
      {Boolean(plusPoint) && <MyPoint />}
      <div className="user-status">
        {winner ? (
          winner === userId ? (
            <div>Victory</div>
          ) : (
            <div>Defeat</div>
          )
        ) : onlineStatusClass ? (
          "Offline"
        ) : status === "NOT_READY" ? (
          "Not ready"
        ) : (
          status.toLowerCase()
        )}
      </div>
    </div>
  );
}
