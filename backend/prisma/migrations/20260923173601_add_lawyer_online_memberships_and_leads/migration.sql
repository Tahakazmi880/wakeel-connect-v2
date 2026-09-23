-- AlterTable
ALTER TABLE "Lawyer" ADD COLUMN     "memberships" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "offersOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onlineFeePaisa" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "citySlug" TEXT NOT NULL,
    "matter" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
