/*
  Warnings:

  - The `tips` column on the `ControlFieldDefinition` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ControlFieldDefinition" DROP COLUMN "tips",
ADD COLUMN     "tips" TEXT[];
