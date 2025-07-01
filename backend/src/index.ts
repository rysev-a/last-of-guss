import process from "node:process";

import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";

import { initDatabaseConnection } from "./core/database";
import auth, { checkAuth } from "./controllers/auth";
import dev from "./controllers/dev";
import game from "./controllers/game";

process.loadEnvFile(".env");

const fastify = Fastify({ logger: process.env.LOGGING === "true" });

fastify.register(fastifyJwt, { secret: process.env.SECRET_KEY as string });

fastify.addHook("onRequest", checkAuth(fastify));

fastify.register(auth, { prefix: "/api/v1/auth" });
fastify.register(dev, { prefix: "/api/v1/dev" });
fastify.register(game, { prefix: "/api/v1/games" });

fastify.listen({ port: 8080 }, async (err, address) => {
  await initDatabaseConnection();

  console.log(`Connect to database success`);

  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
