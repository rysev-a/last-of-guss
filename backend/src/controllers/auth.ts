import { FastifyInstance, HookHandlerDoneFunction } from "fastify";

import { prisma } from "../core/database";

interface SignUpData {
  email: string;
  username: string;
  password: string;
}

const auth = (
  fastify: FastifyInstance,
  _: any,
  done: HookHandlerDoneFunction,
) => {
  fastify.post<{ Body: SignUpData }>("/signup", async (request, reply) => {
    if (
      await prisma.user.findFirst({
        where: {
          email: request.body.email,
        },
      })
    ) {
      reply.status(400).send({ email: "email already exist" });
    }

    if (
      await prisma.user.findFirst({
        where: {
          username: request.body.username,
        },
      })
    ) {
      reply.status(400).send({ username: "username already exist" });
    }

    const user = await prisma.user.create({ data: request.body });

    const token = fastify.jwt.sign({
      email: user.email,
      username: user.username,
    });
    reply.send({ token });
  });

  done();
};

export default auth;
