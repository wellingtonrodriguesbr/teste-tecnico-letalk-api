import { prisma } from "@/lib/prisma";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface ConfirmLoanUseCaseRequest {
  loanId: string;
}

export async function confirmLoanUseCase({
  loanId,
}: ConfirmLoanUseCaseRequest) {
  const loan = await prisma.loan.findUnique({
    where: {
      id: loanId,
    },
  });

  if (!loan) {
    throw new ResourceNotFoundError("Loan not found.");
  }

  await prisma.loan.update({
    where: {
      id: loanId,
    },
    data: {
      loanMadeEffective: true,
    },
  });
}
