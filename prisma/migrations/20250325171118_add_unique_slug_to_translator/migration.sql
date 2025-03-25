/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Translator` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Translator_slug_key" ON "Translator"("slug");
