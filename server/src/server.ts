import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { pollRoutes } from "./routes/poll";
import { userRoutes } from "./routes/user";
import { guessRoutes } from "./routes/guess";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: "oghwoh0823t018tjjsdgkn",
  });

  await fastify.register(authRoutes);
  await fastify.register(pollRoutes);
  await fastify.register(userRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);

  await fastify.listen({ port: 3030, host: "0.0.0.0" });
}

start();
