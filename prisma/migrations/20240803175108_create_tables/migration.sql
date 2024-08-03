-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_document_number" TEXT NOT NULL,
    "customer_birth_date" DATETIME NOT NULL,
    "customer_state" TEXT NOT NULL,
    "loan_amount_requested" INTEGER NOT NULL,
    "interest_rate" REAL NOT NULL,
    "desired_installment_amount" INTEGER NOT NULL,
    "installments" INTEGER NOT NULL,
    "total_interest_rate_amount" INTEGER NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "loan_made_effective" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "loan_installments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "outstanding_balance" INTEGER NOT NULL,
    "interest" INTEGER NOT NULL,
    "adjusted_balance" INTEGER NOT NULL,
    "installment_amount" INTEGER NOT NULL,
    "due_date" DATETIME NOT NULL,
    "loanId" TEXT NOT NULL,
    CONSTRAINT "loan_installments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "loans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
