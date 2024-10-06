import prisma from "../src";
import bcrypt from "bcrypt";

async function main() {
  const alice = await prisma.user.upsert({
    where: { id: "1" },
    update: {
      name: "alice",
      password: bcrypt.hashSync("123456", 10),
    },
    create: {
      id: "1",
      name: "alice",
      email: "alice@test.com",
      password: bcrypt.hashSync("123456", 10),
    },
  });
  const bob = await prisma.user.upsert({
    where: { id: "2" },
    update: {
      name: "bob",
      password: bcrypt.hashSync("123456", 10),
    },
    create: {
      id: "2",
      name: "bob",
      email: "bob@test.com",
      password: bcrypt.hashSync("123456", 10),
    },
  });
  const charlie = await prisma.user.upsert({
    where: { id: "3" },
    update: {
      name: "charlie",
      password: bcrypt.hashSync("123456", 10),
    },
    create: {
      id: "3",
      name: "charlie",
      email: "charlie@test.com",
      password: bcrypt.hashSync("123456", 10),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
