import { redirect } from "@remix-run/node";
import RANDOMBOARD from "~/helper/random";
import { db } from "./db.server";

export async function createRoom() {
  const board = JSON.stringify(await RANDOMBOARD());
  const room = await db.room.create({
    data: { board },
  });
  return redirect(`/solo/${room.id}`);
}

export async function getRooms() {
  const rooms = await db.room.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      users: true,
    },
  });

  return rooms;
}

export async function getRoom(id: string) {
  const room = await db.room.findUnique({
    where: { id },
    select: { id: true, board: true },
  });
  return room;
}

export async function getMoves({ roomId }: { roomId: string }) {
  try {
    const moves = await db.usersOnRooms.findMany({
      where: {
        roomId,
      },
      select: { moves: true, userId: true, score: true },
    });
    return moves;
  } catch {}
}

export async function updateMoves({
  roomId,
  userId,
  moves,
  score,
}: {
  roomId: string;
  userId: string;
  moves: string; // JSON.stringify
  score: number;
}) {
  try {
    await db.usersOnRooms.update({
      data: {
        moves,
        score,
      },
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });
  } catch {}
}

export async function joinRoom({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  try {
    const usersOnRooms = await db.usersOnRooms.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (!usersOnRooms) {
      await db.usersOnRooms.create({
        data: {
          roomId,
          userId,
          moves: "[]",
          score: 0,
        },
      });
    }
  } catch {
    console.error("ERROR");
  }
}
