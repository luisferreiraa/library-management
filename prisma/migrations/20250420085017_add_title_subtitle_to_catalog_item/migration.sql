/*
  Warnings:

  - Added the required column `subTitle` to the `CatalogItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `CatalogItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CatalogItem" ADD COLUMN     "subTitle" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
