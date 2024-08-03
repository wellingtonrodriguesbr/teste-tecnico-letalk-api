import { FastifyInstance } from "fastify";
import { requestLoanController } from "../controllers/request-loan-controller";
import { confirmLoanController } from "../controllers/confirm-loan-controller";
import { getConfirmedLoansController } from "../controllers/get-confirmed-loans-controller";

export async function loanRoutes(app: FastifyInstance) {
  app.get("/loans", getConfirmedLoansController);
  app.post("/loans", requestLoanController);
  app.patch("/loans/confirm", confirmLoanController);
}
