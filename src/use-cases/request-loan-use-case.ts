import { prisma } from "@/lib/prisma";
import { Loan, LoanInstallments } from "@prisma/client";
import { BadRequestError } from "./errors/bad-request";
import { formatCurrency } from "@/utils/format-currency";

import dayjs from "dayjs";

interface RequestLoanUseCaseProps {
  customerDocumentNumber: string;
  customerBirthDate: string;
  customerState: string;
  loanAmountRequested: number;
  desiredInstallmentAmount: number;
}

interface RequestLoanUseCaseResponse {
  loan: Loan;
  loanInstallments: LoanInstallments[];
}

interface Installments {
  outstandingBalance: number;
  interest: number;
  adjustedBalance: number;
  installmentAmount: number;
  dueDate: Date;
}

const PERCENTAGE_LOAN_AMOUNT_REQUESTED = 0.01;
const MINIMUM_LOAN_AMOUNT = 50000; // 50.000,00
const INTEREST_BY_STATE: Record<string, number> = {
  MG: 0.01,
  SP: 0.008,
  RJ: 0.009,
  ES: 0.011,
};

export async function requestLoanUseCase({
  customerDocumentNumber,
  customerBirthDate,
  customerState,
  loanAmountRequested,
  desiredInstallmentAmount,
}: RequestLoanUseCaseProps): Promise<RequestLoanUseCaseResponse> {
  const minimumInstallmentAmount =
    loanAmountRequested * PERCENTAGE_LOAN_AMOUNT_REQUESTED;

  if (loanAmountRequested < MINIMUM_LOAN_AMOUNT) {
    throw new BadRequestError(
      `The minimum loan amount is ${formatCurrency(MINIMUM_LOAN_AMOUNT)}`
    );
  }

  if (desiredInstallmentAmount < minimumInstallmentAmount) {
    throw new BadRequestError(
      `The minimum installment amount is ${formatCurrency(
        minimumInstallmentAmount
      )}`
    );
  }

  let quantityInstallments = 0;
  let totalInterestRateAmount = 0;
  let outstandingBalance = loanAmountRequested;
  let dueDate = dayjs().add(30, "day");

  let installments: Installments[] = [];

  while (outstandingBalance > 0) {
    const interest = outstandingBalance * INTEREST_BY_STATE[customerState];
    const adjustedBalance = outstandingBalance + interest;
    const installmentAmount = Math.min(
      desiredInstallmentAmount,
      adjustedBalance
    );
    const balanceAfterPayment = adjustedBalance - desiredInstallmentAmount;

    installments.push({
      outstandingBalance,
      interest,
      adjustedBalance,
      installmentAmount,
      dueDate: dueDate.toDate(),
    });

    totalInterestRateAmount += interest;
    outstandingBalance = balanceAfterPayment;

    if (outstandingBalance < 0) {
      outstandingBalance = 0;
    }

    quantityInstallments++;
    dueDate = dueDate.add(30, "day");
  }

  const totalAmount = loanAmountRequested + totalInterestRateAmount;

  const loan = await prisma.loan.create({
    data: {
      customerDocumentNumber,
      customerBirthDate: dayjs(customerBirthDate).toDate(),
      customerState,
      desiredInstallmentAmount,
      installments: quantityInstallments,
      interestRate: INTEREST_BY_STATE[customerState],
      loanAmountRequested,
      totalInterestRateAmount,
      totalAmount,
      loanInstallments: {
        createMany: {
          data: installments,
        },
      },
    },
  });

  const loanInstallments = await prisma.loanInstallments.findMany({
    where: {
      loanId: loan.id,
    },
  });

  return { loan, loanInstallments };
}
