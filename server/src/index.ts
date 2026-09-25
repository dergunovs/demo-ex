import "dotenv/config";

import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import mongoose from "mongoose";

import { registerRoutes } from "./routes.ts";
import { seed } from "./seed.ts";

import type { FastifyError } from "fastify";

const PORT = Number(process.env.PORT ?? 5000);
const HOST = "127.0.0.1";
const DATABASE = process.env.DATABASE ?? "driverf";
const SECRET = process.env.SECRET ?? "driverf-secret";
const MONGO_URL = `mongodb://127.0.0.1:27017/${DATABASE}`;

export function buildApp() {
  const app = Fastify();

  app.register(cors, { origin: true });
  app.register(jwt, { secret: SECRET });
  app.register(registerRoutes, { prefix: "/api" });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    reply.code(error.statusCode ?? 500).send({ message: error.message });
  });

  return app;
}

export async function start(): Promise<void> {
  await mongoose.connect(MONGO_URL);
  await seed();

  const app = buildApp();

  await app.listen({ port: PORT, host: HOST });

  process.stdout.write(`Водить.РФ API: http://${HOST}:${PORT}/api\n`);
}

start();
