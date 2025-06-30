import {
  FastifyInstance,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";

import { prisma } from "../core/database";
import bcrypt from "bcrypt";

interface SignUpData {
  email: string;
  username: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const auth = (
  fastify: FastifyInstance,
  _: any,
  done: HookHandlerDoneFunction,
) => {
  fastify.addHook("onRequest", async (request, reply) => {
    if (request.headers.authorization) {
      const decodedTokenAlt = fastify.jwt.decode(
        request.headers.authorization as string,
        {
          complete: false,
        },
      );

      request.user = JSON.stringify(decodedTokenAlt);
    }
  });

  fastify.post<{ Body: SignUpData }>("/signup", async (request, reply) => {
    if (await prisma.user.findFirst({ where: { email: request.body.email } })) {
      reply.status(400).send({ email: "email already exist" });
    }

    if (
      await prisma.user.findFirst({
        where: { username: request.body.username },
      })
    ) {
      reply.status(400).send({ username: "username already exist" });
    }

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(request.body.password, 5, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });

    const user = await prisma.user.create({
      data: {
        email: request.body.email,
        username: request.body.username,
        password: hashedPassword as string,
      },
    });

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });
    reply.send({ token });
  });

  fastify.post<{ Body: LoginData }>("/login", async (request, reply) => {
    const emailUser = await prisma.user.findFirst({
      where: { email: request.body.email },
    });

    if (!emailUser) {
      reply.status(400).send({ email: "email not found" });
    }

    if (emailUser) {
      if (
        !(await bcrypt.compare(
          request.body.password,
          emailUser.password as string,
        ))
      ) {
        reply.status(400).send({ password: "wrong password" });
      }

      const token = fastify.jwt.sign({
        id: emailUser.id,
        email: emailUser.email,
        username: emailUser.username,
      });
      reply.send({
        token,
      });
    }
  });

  fastify.get("/account", async (request, reply) => {
    if (request.user) {
      return reply.send(JSON.parse(request.user as string));
    }
    reply.status(400).send({ message: "not autorized" });
  });

  done();
};

export default auth;
