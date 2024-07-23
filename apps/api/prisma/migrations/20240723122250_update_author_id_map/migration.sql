/*
  Warnings:

  - You are about to drop the column `authorId` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `memberships` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId,user_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_authorId_fkey";

-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_organization_id_fkey";

-- DropIndex
DROP INDEX "memberships_organization_id_user_id_key";

-- AlterTable
ALTER TABLE "invites" DROP COLUMN "authorId",
ADD COLUMN     "author_id" TEXT;

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "organization_id",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "memberships_organizationId_user_id_key" ON "memberships"("organizationId", "user_id");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
