/*
  Warnings:

  - Made the column `userId` on table `Url` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_userId_fkey";

-- AlterTable
ALTER TABLE "Url" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
