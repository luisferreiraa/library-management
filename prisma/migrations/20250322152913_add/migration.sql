/*
  Warnings:

  - Added the required column `minDaysLate` to the `PenaltyRule` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PenaltyRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "finePerDay" REAL NOT NULL,
    "minDaysLate" INTEGER NOT NULL,
    "maxDaysLate" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_PenaltyRule" ("createdAt", "description", "finePerDay", "id", "isActive", "name", "slug", "updatedAt") SELECT "createdAt", "description", "finePerDay", "id", "isActive", "name", "slug", "updatedAt" FROM "PenaltyRule";
DROP TABLE "PenaltyRule";
ALTER TABLE "new_PenaltyRule" RENAME TO "PenaltyRule";
CREATE UNIQUE INDEX "PenaltyRule_name_key" ON "PenaltyRule"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
