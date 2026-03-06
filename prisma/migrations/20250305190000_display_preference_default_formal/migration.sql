-- Default address style to formal (title + last name) for new users
ALTER TABLE "users" ALTER COLUMN "displayPreference" SET DEFAULT 'formal';
