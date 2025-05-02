/*
  Warnings:

  - A unique constraint covering the columns `[tag]` on the table `DataFieldDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataFieldDefinition_tag_key" ON "DataFieldDefinition"("tag");
