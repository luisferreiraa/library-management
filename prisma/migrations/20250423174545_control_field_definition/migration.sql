/*
  Warnings:

  - You are about to drop the column `tag` on the `ControlField` table. All the data in the column will be lost.
  - You are about to drop the column `tips` on the `ControlField` table. All the data in the column will be lost.
  - Added the required column `definitionId` to the `ControlField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ControlField" DROP COLUMN "tag",
DROP COLUMN "tips",
ADD COLUMN     "definitionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ControlFieldDefinition" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "tips" TEXT NOT NULL,

    CONSTRAINT "ControlFieldDefinition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ControlField" ADD CONSTRAINT "ControlField_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "ControlFieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
