-- AlterTable: Booking.clientPhone becomes nullable (Google sign-ups may not have a phone)
ALTER TABLE "Booking" ALTER COLUMN "clientPhone" DROP NOT NULL;

-- AlterTable: User gets googleId for "Continue with Google"; phone becomes nullable
ALTER TABLE "User" ADD COLUMN "googleId" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
