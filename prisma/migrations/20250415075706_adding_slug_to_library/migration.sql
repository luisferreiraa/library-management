/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Catalog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Library` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Catalog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Catalog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Library` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Catalog" DROP CONSTRAINT "Catalog_libraryId_fkey";

-- DropForeignKey
ALTER TABLE "Library" DROP CONSTRAINT "Library_libraryNetworkId_fkey";

-- AlterTable
ALTER TABLE "Catalog" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Library" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Catalog_slug_key" ON "Catalog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Library_slug_key" ON "Library"("slug");

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_libraryNetworkId_fkey" FOREIGN KEY ("libraryNetworkId") REFERENCES "LibraryNetwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catalog" ADD CONSTRAINT "Catalog_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "Library"("id") ON DELETE CASCADE ON UPDATE CASCADE;
