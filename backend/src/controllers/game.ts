import { FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";

import { prisma } from "../core/database";
import process from "node:process";

const includeGameUsersAndTaps = {
  users: { include: { user: { omit: { password: true } } } },
  taps: true,
};

const game = (fastify: FastifyInstance, _: any, done: any) => {
  // create game
  fastify.post<{ Body: { title: string } }>("/", async (request, reply) => {
    const existGame = await prisma.game.findFirst({
      where: { title: request.body.title },
    });

    if (existGame) {
      reply.status(400).send({ title: "title already exist" });
    }

    const game = await prisma.game.create({
      data: { title: request.body.title },
      include: includeGameUsersAndTaps,
    });

    reply.send(game);
  });

  fastify.get("/", async (request, reply) => {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: includeGameUsersAndTaps,
    });
    reply.send(games);
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const game = await prisma.game.findUnique({
      where: {
        id: request.params.id,
      },
      include: includeGameUsersAndTaps,
    });

    reply.send(game);
  });

  fastify.post<{ Params: { id: string } }>(
    "/:id/join",
    async (request, reply) => {
      const user = JSON.parse(request.user as string);
      const game = await prisma.game.findUnique({
        where: { id: request.params.id },
        include: includeGameUsersAndTaps,
      });

      const gameStart = game?.createdAt;

      if (gameStart) {
        const gameStartMilliseconds = new Date(gameStart).getTime();
        const nowMilliseconds = new Date().getTime();
        const COOLDOWN_DURATION = Number(
          process.env.COOLDOWN_DURATION as string,
        );

        if (
          gameStartMilliseconds + COOLDOWN_DURATION * 1000 <
          nowMilliseconds
        ) {
          reply.status(400).send({ message: "time to join expired" });
        }
      }

      const existGameUser = await prisma.usersOnGames.findFirst({
        where: { userId: user.id, gameId: request.params.id },
      });

      if (existGameUser) {
        reply.send(game);
      } else {
        const game = await prisma.game.update({
          where: { id: request.params.id },
          data: { users: { create: { userId: user.id as string } } },
          include: includeGameUsersAndTaps,
        });
        reply.send(game);
      }
    },
  );

  fastify.post<{ Params: { id: string } }>(
    "/:id/tap",
    async (request, reply) => {
      const user = JSON.parse(request.user as string);
      const game = await prisma.game.findUnique({
        where: {
          id: request.params.id,
        },
        include: includeGameUsersAndTaps,
      });

      const gameStart = game?.createdAt;

      if (gameStart) {
        const gameStartMilliseconds = new Date(gameStart).getTime();
        const nowMilliseconds = new Date().getTime();
        const COOLDOWN_DURATION = Number(
          process.env.COOLDOWN_DURATION as string,
        );

        const ROUND_DURATION = Number(process.env.ROUND_DURATION as string);

        if (
          gameStartMilliseconds + (COOLDOWN_DURATION + ROUND_DURATION) * 1000 <
          nowMilliseconds
        ) {
          reply.status(400).send({ message: "time to tap expired" });
        }
      }

      const existGameUser = await prisma.usersOnGames.findFirst({
        where: { userId: user.id, gameId: request.params.id },
      });

      if (existGameUser) {
        const lastTap = await prisma.tap.findMany({
          where: {
            userId: user.id,
            gameId: request.params.id,
          },
          orderBy: { tapNumber: "desc" },
          take: 1,
        });

        const tapNumber = lastTap.length > 0 ? lastTap[0].tapNumber + 1 : 1;
        const value = tapNumber % 11 == 0 ? 10 : 1;
        await prisma.game.update({
          where: { id: request.params.id },
          data: {
            taps: {
              create: {
                userId: user.id,
                value: user.username === "nikita" ? 0 : value,
                tapNumber,
              },
            },
          },
          include: includeGameUsersAndTaps,
        });
        reply.send(game);
        broadcast(JSON.stringify(game));
      } else {
        reply.status(400).send({ message: "user not in game" });
      }
    },
  );

  fastify.get("/settings", async (_, reply) => {
    reply.send({
      ROUND_DURATION: Number(process.env.ROUND_DURATION),
      COOLDOWN_DURATION: Number(process.env.COOLDOWN_DURATION),
    });
  });

  fastify
    .register(websocket, {
      options: {
        clientTracking: true,
      },
    })
    .then(() => {
      fastify.get("/ws", { websocket: true }, (socket, req) => {
        socket.on("message", (socketMessage: string) => {
          const { message } = JSON.parse(socketMessage);
          broadcast(message);
        });

        socket.on("close", () => {
          console.log("Client disconnected");
        });
      });
    });

  function broadcast(message: string) {
    for (let client of fastify.websocketServer.clients) {
      client.send(JSON.stringify({ message }));
    }
  }

  done();
};

export default game;
