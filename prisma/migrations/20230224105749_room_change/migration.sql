-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "board" TEXT NOT NULL,
    "gameStatus" TEXT NOT NULL DEFAULT 'READY'
);

-- CreateTable
CREATE TABLE "UsersOnRooms" (
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "moves" TEXT,
    "role" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "roomId"),
    CONSTRAINT "UsersOnRooms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnRooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
