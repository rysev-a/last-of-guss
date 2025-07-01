import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import bcrypt from "bcrypt";

import { prisma } from "../core/database";

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
        roles: {
          create: [
            {
              role: {
                create: {
                  name: request.body.username,
                },
              },
            },
          ],
        },
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
    });
    reply.send({ token });
  });

  fastify.post<{ Body: LoginData }>("/login", async (request, reply) => {
    const loginUser = await prisma.user.findFirst({
      where: { email: request.body.email },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!loginUser) {
      reply.status(400).send({ email: "email not found" });
    }

    if (loginUser) {
      if (
        !(await bcrypt.compare(
          request.body.password,
          loginUser.password as string,
        ))
      ) {
        reply.status(400).send({ password: "wrong password" });
      }

      const token = fastify.jwt.sign({
        id: loginUser.id,
        email: loginUser.email,
        username: loginUser.username,
        roles: loginUser.roles,
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
    reply.status(400).send({ message: "not authorized" });
  });

  fastify.get("/users", async (request, reply) => {
    reply.send(
      await prisma.user.findMany({
        include: {
          roles: {
            include: { role: true },
          },
        },
      }),
    );
  });

  done();
};

export const checkAuth =
  (fastify: FastifyInstance) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    if (
      ["/api/v1/auth/login", "/api/v1/auth/singup", "/api/v1/games/ws"].indexOf(
        request.url,
      ) == -1
    ) {
      if (request.headers.authorization) {
        const decodedTokenAlt = fastify.jwt.decode(
          request.headers.authorization as string,
          {
            complete: false,
          },
        );

        request.user = JSON.stringify(decodedTokenAlt);
      } else {
        reply.status(400).send({ message: "not authorized" });
      }
    }
  };

export default auth;
