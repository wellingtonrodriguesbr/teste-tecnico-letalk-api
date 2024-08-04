import { FastifyInstance } from "fastify";
import { getInstallmentsByLoanController } from "../controllers/get-installments-by-loan-controller";

export async function loanInstallmentsRoutes(app: FastifyInstance) {
  app.get("/loans/:loanId/installments", getInstallmentsByLoanController);
}
