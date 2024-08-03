import { FastifyReply, FastifyRequest } from "fastify";
import { requestLoanUseCase } from "@/use-cases/request-loan-use-case";
import { BadRequestError } from "@/use-cases/errors/bad-request";
import { z } from "zod";

export async function requestLoanController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const requestLoanBodySchema = z.object({
    customerDocumentNumber: z.string().min(11),
    customerBirthDate: z.string(),
    customerState: z.string(),
    loanAmountRequested: z.number(),
    desiredInstallmentAmount: z.number(),
  });

  const {
    customerDocumentNumber,
    customerBirthDate,
    customerState,
    loanAmountRequested,
    desiredInstallmentAmount,
  } = requestLoanBodySchema.parse(req.body);

  try {
    const { loan, loanInstallments } = await requestLoanUseCase({
      customerDocumentNumber,
      customerBirthDate,
      customerState,
      loanAmountRequested,
      desiredInstallmentAmount,
    });

    return reply.status(201).send({ loan, loanInstallments });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
