/*
  Warnings:

  - A unique constraint covering the columns `[tag]` on the table `ControlFieldDefinition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ControlFieldDefinition_tag_key" ON "ControlFieldDefinition"("tag");
