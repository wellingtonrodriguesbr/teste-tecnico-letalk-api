import { FastifyReply, FastifyRequest } from "fastify";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found";
import { confirmLoanUseCase } from "@/use-cases/confirm-loan-use-case";
import { z } from "zod";

export async function confirmLoanController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const confirmLoanBodySchema = z.object({
    loanId: z.string().uuid(),
  });

  const { loanId } = confirmLoanBodySchema.parse(req.body);

  try {
    await confirmLoanUseCase({
      loanId,
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}
