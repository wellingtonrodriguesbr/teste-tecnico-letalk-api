import { FastifyReply, FastifyRequest } from "fastify";

import { getConfirmedLoansUseCase } from "@/use-cases/get-confirmed-loans-use-case";

export async function getConfirmedLoansController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { confirmedLoans } = await getConfirmedLoansUseCase();

    return reply.status(200).send({ confirmedLoans });
  } catch (error) {
    throw error;
  }
}
