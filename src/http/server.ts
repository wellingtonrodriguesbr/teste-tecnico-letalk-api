import fastify from "fastify";
import { env } from "../env";
import { loanRoutes } from "./routes/loan-routes";

const server = fastify();

server.register(loanRoutes);

server
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is running");
  });
