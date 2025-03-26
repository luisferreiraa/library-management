/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Format` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Format_slug_key" ON "Format"("slug");
