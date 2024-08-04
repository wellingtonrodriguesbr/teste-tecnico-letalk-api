import { FastifyReply, FastifyRequest } from "fastify";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found";
import { z } from "zod";
import { getInstallmentsByLoanUseCase } from "@/use-cases/get-installments-by-loan";

export async function getInstallmentsByLoanController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const getInstallmentsByLoanParamsSchema = z.object({
    loanId: z.string().uuid(),
  });

  const { loanId } = getInstallmentsByLoanParamsSchema.parse(req.params);

  try {
    const { installments } = await getInstallmentsByLoanUseCase({
      loanId,
    });

    return reply.status(200).send({ installments });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
