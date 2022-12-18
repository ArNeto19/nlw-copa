import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export const pollRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/polls/count", async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  fastify.get(
    "/polls",
    {
      onRequest: [authenticate],
    },
    async (req, rep) => {
      const polls = await prisma.poll.findMany({
        where: {
          participants: {
            some: {
              userId: req.user.sub,
            },
          },
        },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },
          participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { polls };
    }
  );

  fastify.get(
    "/polls/:id",
    {
      onRequest: [authenticate],
    },
    async (req, rep) => {
      const getPoolParams = z.object({
        id: z.string(),
      });

      const { id } = getPoolParams.parse(req.params);

      const poll = await prisma.poll.findUnique({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              participants: true,
            },
          },
          participants: {
            select: {
              id: true,

              user: {
                select: {
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return { poll };
    }
  );

  fastify.post("/polls", async (req, rep) => {
    const createPollBody = z.object({
      title: z.string(),      
    });

    const { title } = createPollBody.parse(req.body);
    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    try {
      await req.jwtVerify();

      await prisma.poll.create({
        data: {
          title,
          code,
          ownerID: req.user.sub,

          participants: {
            create: {
              userId: req.user.sub,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);

      await prisma.poll.create({
        data: {
          title,
          code,
        },
      });
    }

    return rep.status(201).send({ code });
  });

  fastify.post(
    "/polls/join",
    {
      onRequest: [authenticate],
    },
    async (req, rep) => {
      const joinPollBody = z.object({
        code: z.string(),
      });

      const { code } = joinPollBody.parse(req.body);

      const poll = await prisma.poll.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: req.user.sub,
            },
          },
        },
      });

      if (!poll) {
        return rep.status(400).send({ Message: "Poll not find." });
      }

      if (poll.participants.length > 0) {
        return rep.status(400).send({ Message: "User already joined this poll" });
      }

      await prisma.participant.create({
        data: {
          pollId: poll.id,
          userId: req.user.sub,
        },
      });

      return rep.status(201).send();
    }
  );
};
