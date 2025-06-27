import process from "node:process";

import fastify from "fastify";
const server = fastify();
import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();
import { faker } from "@faker-js/faker";
import { map, range, zip } from "rambda";

process.loadEnvFile(".env");

async function initDatabaseConnection(): Promise<PrismaClient> {
  const db = new PrismaClient();
  await db.$connect();
  return db;
}

server.get("/ping", async (request, reply) => {
  return { message: "response" };
});

server.get("/reset", async (req, res) => {
  await prisma.user.deleteMany();
  const emails = faker.helpers.uniqueArray(faker.internet.email, 1000);
  const names = faker.helpers.uniqueArray(faker.person.firstName, 1000);

  const users = zip(emails)(names).map(([email, name]) => {
    return {
      name,
      email,
      password: faker.internet.password({ length: 10 }),
    };
  });

  await prisma.user.createMany({ data: users });

  return { message: "success" };
});

server.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
  }));
});

server.listen({ port: 8080 }, async (err, address) => {
  await initDatabaseConnection();
  console.log(`Connect to database success`);

  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
