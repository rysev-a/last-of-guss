import { PrismaClient } from "../generated/client";

export const prisma = new PrismaClient();
export async function initDatabaseConnection(): Promise<PrismaClient> {
  const db = new PrismaClient();
  await db.$connect();
  return db;
}
