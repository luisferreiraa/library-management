/*
  Warnings:

  - You are about to drop the column `callNumber` on the `Holding` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Holding` table. All the data in the column will be lost.
  - You are about to drop the column `shelf` on the `Holding` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Holding" DROP COLUMN "callNumber",
DROP COLUMN "location",
DROP COLUMN "shelf",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "HoldingControlField" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "holdingId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,

    CONSTRAINT "HoldingControlField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoldingControlDefinition" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tips" TEXT[],

    CONSTRAINT "HoldingControlDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoldingDataField" (
    "id" TEXT NOT NULL,
    "ind1" TEXT NOT NULL,
    "ind2" TEXT NOT NULL,
    "holdingId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,

    CONSTRAINT "HoldingDataField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoldingDataDefinition" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ind1Name" TEXT NOT NULL,
    "ind1Tips" TEXT[],
    "ind2Name" TEXT NOT NULL,
    "ind2Tips" TEXT[],
    "tips" TEXT[],

    CONSTRAINT "HoldingDataDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoldingSubfieldDefinition" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "repeatable" BOOLEAN NOT NULL DEFAULT false,
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "tips" TEXT[],
    "holdingDataDefinitionId" TEXT NOT NULL,

    CONSTRAINT "HoldingSubfieldDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoldingSubfield" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "dataFieldId" TEXT NOT NULL,

    CONSTRAINT "HoldingSubfield_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HoldingControlDefinition_tag_key" ON "HoldingControlDefinition"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "HoldingDataDefinition_tag_key" ON "HoldingDataDefinition"("tag");

-- AddForeignKey
ALTER TABLE "HoldingControlField" ADD CONSTRAINT "HoldingControlField_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "Holding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoldingControlField" ADD CONSTRAINT "HoldingControlField_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "HoldingControlDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoldingDataField" ADD CONSTRAINT "HoldingDataField_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "Holding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoldingDataField" ADD CONSTRAINT "HoldingDataField_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "HoldingDataDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoldingSubfieldDefinition" ADD CONSTRAINT "HoldingSubfieldDefinition_holdingDataDefinitionId_fkey" FOREIGN KEY ("holdingDataDefinitionId") REFERENCES "HoldingDataDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoldingSubfield" ADD CONSTRAINT "HoldingSubfield_dataFieldId_fkey" FOREIGN KEY ("dataFieldId") REFERENCES "HoldingDataField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
