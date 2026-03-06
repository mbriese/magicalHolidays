-- AlterTable
ALTER TABLE "users" ADD COLUMN "firstName" TEXT,
ADD COLUMN "lastName" TEXT,
ADD COLUMN "title" TEXT,
ADD COLUMN "displayPreference" TEXT DEFAULT 'casual';
