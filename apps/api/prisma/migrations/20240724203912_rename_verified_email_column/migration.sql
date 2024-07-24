/*
  Warnings:

  - You are about to drop the column `verified_email` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "verified_email",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
