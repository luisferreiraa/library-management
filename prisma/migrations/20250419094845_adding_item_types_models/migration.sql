/*
  Warnings:

  - A unique constraint covering the columns `[catalogItemId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `catalogItemId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "catalogItemId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Periodical" (
    "id" TEXT NOT NULL,
    "issn" TEXT NOT NULL,
    "issueNumber" TEXT NOT NULL,
    "volume" TEXT,
    "publicationDate" TIMESTAMP(3) NOT NULL,
    "catalogItemId" TEXT NOT NULL,

    CONSTRAINT "Periodical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DVD" (
    "id" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "studio" TEXT,
    "releaseYear" INTEGER,
    "rating" TEXT,
    "catalogItemId" TEXT NOT NULL,

    CONSTRAINT "DVD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VHS" (
    "id" TEXT NOT NULL,
    "director" TEXT,
    "duration" INTEGER,
    "catalogItemId" TEXT NOT NULL,

    CONSTRAINT "VHS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CD" (
    "id" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "trackCount" INTEGER,
    "label" TEXT,
    "releaseYear" INTEGER,
    "catalogItemId" TEXT NOT NULL,

    CONSTRAINT "CD_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Periodical_issn_key" ON "Periodical"("issn");

-- CreateIndex
CREATE UNIQUE INDEX "Periodical_catalogItemId_key" ON "Periodical"("catalogItemId");

-- CreateIndex
CREATE UNIQUE INDEX "DVD_catalogItemId_key" ON "DVD"("catalogItemId");

-- CreateIndex
CREATE UNIQUE INDEX "VHS_catalogItemId_key" ON "VHS"("catalogItemId");

-- CreateIndex
CREATE UNIQUE INDEX "CD_catalogItemId_key" ON "CD"("catalogItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_catalogItemId_key" ON "Book"("catalogItemId");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periodical" ADD CONSTRAINT "Periodical_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DVD" ADD CONSTRAINT "DVD_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VHS" ADD CONSTRAINT "VHS_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CD" ADD CONSTRAINT "CD_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
