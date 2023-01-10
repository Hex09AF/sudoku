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
}

seed();
