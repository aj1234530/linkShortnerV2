/*
  Warnings:

  - You are about to drop the column `shortenedUrl` on the `Url` table. All the data in the column will be lost.
  - Added the required column `shortenedUrlUniqueSlug` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "shortenedUrl",
ADD COLUMN     "shortenedUrlUniqueSlug" TEXT NOT NULL;
