-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "currency" SET DEFAULT 'XOF';

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "currency" SET DEFAULT 'XOF';

-- AlterTable
ALTER TABLE "Escrow" ALTER COLUMN "currency" SET DEFAULT 'XOF';
