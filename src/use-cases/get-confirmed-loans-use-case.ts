import { prisma } from "@/lib/prisma";
import { Loan } from "@prisma/client";

interface GetConfirmedLoansUseCaseResponse {
  confirmedLoans: Loan[];
}

export async function getConfirmedLoansUseCase(): Promise<GetConfirmedLoansUseCaseResponse> {
  const confirmedLoans = await prisma.loan.findMany({
    where: {
      loanMadeEffective: true,
    },
    include: {
      loanInstallments: true,
    },
  });

  return { confirmedLoans };
}
