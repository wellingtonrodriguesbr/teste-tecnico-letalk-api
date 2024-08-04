import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { env } from "../env";
import { loanRoutes } from "./routes/loan-routes";
import { loanInstallmentsRoutes } from "./routes/loan-installments-routes";

const server = fastify();

server.register(fastifyCors, {
  origin: "*",
  credentials: false,
});

server.register(loanRoutes);
server.register(loanInstallmentsRoutes);

server
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is running");
  });
