/*
  Warnings:

  - You are about to drop the `UDCAuxiliary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UDCClassification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UDCMainClass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClassificationAuxiliaries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UDCAuxiliary";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UDCClassification";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UDCMainClass";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ClassificationAuxiliaries";
PRAGMA foreign_keys=on;
