-- Add userId column (nullable first for backfill)
ALTER TABLE "reservations" ADD COLUMN "userId" TEXT;

-- Backfill userId from trip owner
UPDATE "reservations" SET "userId" = (SELECT "ownerId" FROM "trips" WHERE "trips"."id" = "reservations"."tripId");

-- Make userId required and tripId optional
ALTER TABLE "reservations" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "reservations" ALTER COLUMN "tripId" DROP NOT NULL;

-- Add foreign key for userId
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
