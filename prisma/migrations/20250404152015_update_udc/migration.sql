/*
  Warnings:

  - You are about to drop the `CDUAuxiliary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CDUClass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CDUClassAuxiliary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CDUAuxiliary";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CDUClass";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CDUClassAuxiliary";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UDCMainClass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notation" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "UDCMainClass_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "UDCMainClass" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UDCAuxiliary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notation" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "kind" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UDCClassification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookId" TEXT NOT NULL,
    "mainClassId" INTEGER NOT NULL,
    "fullNotation" TEXT NOT NULL,
    CONSTRAINT "UDCClassification_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UDCClassification_mainClassId_fkey" FOREIGN KEY ("mainClassId") REFERENCES "UDCMainClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ClassificationAuxiliaries" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ClassificationAuxiliaries_A_fkey" FOREIGN KEY ("A") REFERENCES "UDCAuxiliary" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClassificationAuxiliaries_B_fkey" FOREIGN KEY ("B") REFERENCES "UDCClassification" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UDCMainClass_notation_key" ON "UDCMainClass"("notation");

-- CreateIndex
CREATE UNIQUE INDEX "UDCAuxiliary_notation_key" ON "UDCAuxiliary"("notation");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassificationAuxiliaries_AB_unique" ON "_ClassificationAuxiliaries"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassificationAuxiliaries_B_index" ON "_ClassificationAuxiliaries"("B");
