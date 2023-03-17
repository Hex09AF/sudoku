import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


async function seed() {
  const kody = await db.user.create({
    data: {
      username: "kody",
      passwordHash:
        "$2a$10$J3KUUA1ZjkgxmjIhOpztYuMfy9ovEiRBoRz4pQgExIq/8wJWWbluW",
    },
  });
  const kody2 = await db.user.create({
    data: {
      username: "kody2",
      passwordHash:
        "$2a$10$4RIfbFVuMqM4jkvZmrd7CefU4NmBNqnllHU1D9QMG1RoAaPyqoVFy",
    },
  });
  const kody3 = await db.user.create({
    data: {
      username: "kody3",
      passwordHash:
        "$2a$10$4RIfbFVuMqM4jkvZmrd7CefU4NmBNqnllHU1D9QMG1RoAaPyqoVFy",
    },
  });
  const kody4 = await db.user.create({
    data: {
      username: "kody4",
      passwordHash:
        "$2a$10$4RIfbFVuMqM4jkvZmrd7CefU4NmBNqnllHU1D9QMG1RoAaPyqoVFy",
    },
  });
  const kody5 = await db.user.create({
    data: {
      username: "kody5",
      passwordHash:
        "$2a$10$4RIfbFVuMqM4jkvZmrd7CefU4NmBNqnllHU1D9QMG1RoAaPyqoVFy",
    },
  });
}

seed();
