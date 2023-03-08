import type { UserMove } from "./UserMove";

export type GameMove = {
  moves: UserMove[];
  userId: string;
  score: number;
  plus?: number;
  status: string;
};
