import { redirect } from "@remix-run/node";
import RANDOMBOARD from "~/helper/random";
import { db } from "./db.server";
import { logout } from "./session.server";


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