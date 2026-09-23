-- AlterTable
ALTER TABLE "Lawyer" ADD COLUMN     "uploadTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "uploadTokenHash" TEXT;
