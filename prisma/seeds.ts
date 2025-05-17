import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.upsert({
    where: {
      username: "kody",
    },
    update: {},
    create: {
      username: "kody",
      passwordHash:
        "$2a$10$wpxaSypb3rfWrEV61G4eg.Sjps8d3gaIM.1Z6Bw13TYuCeTDAELYe",
    },
  });
  const kody2 = await db.user.upsert({
    where: {
      username: "kody2",
    },
    update: {},
    create: {
      username: "kody2",
      passwordHash:
        "$2a$10$ogiEXZkyb7u/ygI5yU8mvu0vvLEXxvzwKIYyH.mckOyZgs6YJH/wu",
    },
  });
  const kody3 = await db.user.upsert({
    where: {
      username: "kody3",
    },
    update: {},
    create: {
      username: "kody3",
      passwordHash:
        "$2a$10$ogiEXZkyb7u/ygI5yU8mvu0vvLEXxvzwKIYyH.mckOyZgs6YJH/wu",
    },
  });
  const kody4 = await db.user.upsert({
    where: {
      username: "kody4",
    },
    update: {},
    create: {
      username: "kody4",
      passwordHash:
        "$2a$10$ogiEXZkyb7u/ygI5yU8mvu0vvLEXxvzwKIYyH.mckOyZgs6YJH/wu",
    },
  });
  const kody5 = await db.user.upsert({
    where: {
      username: "kody5",
    },
    update: {},
    create: {
      username: "kody5",
      passwordHash:
        "$2a$10$ogiEXZkyb7u/ygI5yU8mvu0vvLEXxvzwKIYyH.mckOyZgs6YJH/wu",
    },
  });
}

seed();
