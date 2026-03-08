-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_tripId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "preferredName" TEXT,
ALTER COLUMN "displayPreference" SET DEFAULT 'firstName';

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;
