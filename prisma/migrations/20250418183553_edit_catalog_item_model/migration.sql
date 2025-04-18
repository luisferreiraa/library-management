/*
  Warnings:

  - You are about to drop the column `author` on the `CatalogItem` table. All the data in the column will be lost.
  - You are about to drop the column `isbn` on the `CatalogItem` table. All the data in the column will be lost.
  - You are about to drop the column `publisher` on the `CatalogItem` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CatalogItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CatalogItem" DROP COLUMN "author",
DROP COLUMN "isbn",
DROP COLUMN "publisher",
DROP COLUMN "title";
