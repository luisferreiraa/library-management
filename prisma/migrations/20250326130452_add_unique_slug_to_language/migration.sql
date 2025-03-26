/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Language` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Language_slug_key" ON "Language"("slug");
