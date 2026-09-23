/*
  Warnings:

  - Added the required column `updatedAt` to the `Lead` table with a default
    so this also applies cleanly on databases that already hold lead rows.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;
