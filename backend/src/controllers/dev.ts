import { prisma } from "../core/database";
import { faker } from "@faker-js/faker";
import { zip } from "rambda";
import { FastifyInstance } from "fastify";

const dev = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.get("/reset", async (req, res) => {
    await prisma.user.deleteMany();
    const emails = faker.helpers.uniqueArray(faker.internet.email, 1000);
    const usernames = faker.helpers.uniqueArray(faker.person.firstName, 1000);

    const users = zip(emails)(usernames).map(([email, username]) => {
      return {
        username,
        email,
        password: faker.internet.password({ length: 10 }),
      };
    });
    await prisma.user.createMany({ data: users });

    return { message: "success" };
  });

  fastify.get("/ping", async (request, reply) => {
    return { message: "response" };
  });

  done();
};

export default dev;
