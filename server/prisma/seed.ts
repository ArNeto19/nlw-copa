import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.game.create({
    data: {
      date: "2022-12-18T12:00:00.201Z",
      firstTeamCountryCode: "AR",
      secondTeamCountryCode: "FR",
    },
  });
}

main();
