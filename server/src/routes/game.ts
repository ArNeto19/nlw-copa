import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export const gameRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/polls/:id/games",
    {
      onRequest: [authenticate],
    },
    async (req, rep) => {
      const getPollParams = z.object({
        id: z.string(),
      });

      const { id } = getPollParams.parse(req.params);

      const games = await prisma.game.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          guesses: {
            where: {
              participant: {
                userId: req.user.sub,
                pollId: id,
              },
            },
          },
        },
      });

      return {
        games: games.map((game) => {
          return {
            ...game,
            guess: game.guesses.length > 0 ? game.guesses[0] : null,
            guesses: undefined,
          };
        }),
      };
    }
  );
};
