import { prisma } from "@/lib/prisma";
import { Loan } from "@prisma/client";
import { BadRequestError } from "./errors/bad-request";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import { convertToDate } from "@/utils/convert-to-date";

interface RequestLoanUseCaseProps {
  customerDocumentNumber: string;
  customerBirthDate: string;
  customerState: string;
  loanAmountRequested: number;
  desiredInstallmentAmount: number;
}

interface RequestLoanUseCaseResponse {
  loan: Loan;
}

interface Installments {
  outstandingBalance: string;
  interest: string;
  adjustedBalance: string;
  installmentAmount: string;
  dueDate: Date;
}

const PERCENTAGE_LOAN_AMOUNT_REQUESTED = 0.01;
const MINIMUM_LOAN_AMOUNT = 5000000; // 50.000,00
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

  let installmentsQuantity = 0;
  let totalInterestRateAmount = 0;
  let outstandingBalance = loanAmountRequested;
  let dueDate = dayjs().add(30, "day");

  const installments: Installments[] = [];

  while (outstandingBalance > 0) {
    const interest = outstandingBalance * INTEREST_BY_STATE[customerState];
    const adjustedBalance = outstandingBalance + interest;
    const installmentAmount = Math.min(
      desiredInstallmentAmount,
      adjustedBalance
    );
    const balanceAfterPayment = adjustedBalance - installmentAmount;

    installments.push({
      outstandingBalance: outstandingBalance.toFixed(),
      interest: interest.toFixed(),
      adjustedBalance: adjustedBalance.toFixed(),
      installmentAmount: installmentAmount.toFixed(),
      dueDate: dueDate.toDate(),
    });

    totalInterestRateAmount += interest;
    outstandingBalance = balanceAfterPayment > 0 ? balanceAfterPayment : 0;

    installmentsQuantity++;
    dueDate = dueDate.add(30, "day");
  }

  const totalAmount = loanAmountRequested + totalInterestRateAmount;
  const birthDate = convertToDate(customerBirthDate);

  const loan = await prisma.loan.create({
    data: {
      customerDocumentNumber,
      customerBirthDate: birthDate,
      customerState,
      desiredInstallmentAmount: desiredInstallmentAmount.toFixed(),
      installments: installmentsQuantity,
      interestRate: INTEREST_BY_STATE[customerState],
      loanAmountRequested: loanAmountRequested.toFixed(),
      totalInterestRateAmount: totalInterestRateAmount.toFixed(),
      totalAmount: totalAmount.toFixed(),
      loanInstallments: {
        createMany: {
          data: installments,
        },
      },
    },
  });

  return { loan };
}
