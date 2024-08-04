import { prisma } from "@/lib/prisma";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LoanInstallments } from "@prisma/client";

interface GetInstallmentsByLoanUseCaseRequest {
  loanId: string;
}

interface GetInstallmentsByLoanUseCaseResponse {
  installments: LoanInstallments[];
}

export async function getInstallmentsByLoanUseCase({
  loanId,
}: GetInstallmentsByLoanUseCaseRequest): Promise<GetInstallmentsByLoanUseCaseResponse> {
  const loan = await prisma.loan.findUnique({
    where: {
      id: loanId,
    },
  });

  if (!loan) {
    throw new ResourceNotFoundError("Loan not found.");
  }

  const installments = await prisma.loanInstallments.findMany({
    where: {
      loanId,
    },
  });

  return { installments };
}
