/*
  Warnings:

  - Added the required column `ind1Name` to the `DataFieldDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ind2Name` to the `DataFieldDefinition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataFieldDefinition" ADD COLUMN     "ind1Name" TEXT NOT NULL,
ADD COLUMN     "ind2Name" TEXT NOT NULL;
