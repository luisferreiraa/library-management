/*
  Warnings:

  - You are about to drop the column `tag` on the `DataField` table. All the data in the column will be lost.
  - You are about to drop the column `tips` on the `DataField` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Subfield` table. All the data in the column will be lost.
  - Added the required column `definitionId` to the `DataField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataField" DROP COLUMN "tag",
DROP COLUMN "tips",
ADD COLUMN     "definitionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subfield" DROP COLUMN "code";

-- CreateTable
CREATE TABLE "DataFieldDefinition" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ind1Tips" TEXT[],
    "ind2Tips" TEXT[],
    "tips" TEXT[],

    CONSTRAINT "DataFieldDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubfieldDefinition" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "repeatable" BOOLEAN NOT NULL DEFAULT false,
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "dataFieldDefinitionId" TEXT NOT NULL,

    CONSTRAINT "SubfieldDefinition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "DataFieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubfieldDefinition" ADD CONSTRAINT "SubfieldDefinition_dataFieldDefinitionId_fkey" FOREIGN KEY ("dataFieldDefinitionId") REFERENCES "DataFieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
