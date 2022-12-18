import { FastifyInstance } from "fastify";
import { number, z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export const guessRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    "/polls/:pollId/games/:gameId/guesses",
    {
      onRequest: [authenticate],
    },
    async (req, rep) => {
      const createGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });
      const createGuessBody = z.object({
        firstTeamPoints: number(),
        secondTeamPoints: number(),
      });

      const { pollId, gameId } = createGuessParams.parse(req.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(req.body);

      const participant = await prisma.participant.findUnique({
        where: {
          userId_pollId: {
            pollId,
            userId: req.user.sub,
          },
        },
      });

      if (!participant) {
        return rep.status(400).send({ Message: "You're not allowed to guess on this poll." });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return rep
          .status(400)
          .send({ Message: "You already sent a guess on this game on this poll." });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return rep.status(400).send({ Message: "Game no found!" });
      }

      if (game.date < new Date()) {
        return rep.status(400).send({ Message: "You cannot send guesses after the game date." });
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return rep.status(201).send();
    }
  );
};
