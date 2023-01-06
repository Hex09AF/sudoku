import { redirect } from "@remix-run/node";
import RANDOMBOARD from "~/helper/random";
import { db } from "./db.server";


export async function createRoom() {
  const board = JSON.stringify(await RANDOMBOARD())
  const room = await db.room.create({
    data: { board },
  });
  return redirect(`/solo/${room.id}`)
}

export async function getRoom(id) {
  try {
    const room = await db.room.findUnique({
      where: { id },
      select: { id: true, board: true },
    });
    return room;
  } catch {

  }
}

export async function getMoves({ roomId }) {
  try {
    const moves = await db.usersOnRooms.findMany({
      where: {
        roomId
      },
      select: { moves: true, userId: true }
    })
    return moves
  } catch {

  }
}

export async function updateMoves({ roomId, userId, moves }) {
  try {
    await db.usersOnRooms.update({
      data: {
        moves
      },
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    })
  } catch {

  }
}

export async function joinRoom({ roomId, userId }) {
  try {
    const usersOnRooms = await db.usersOnRooms.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    })

    if (!usersOnRooms) {
      await db.usersOnRooms.create({
        data: {
          roomId,
          userId,
          moves: "[]"
        },
      });
    }
  } catch {
    console.error("ERROR")
  }
}