-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BorrowedBook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barcodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "borrowedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "returnDate" DATETIME,
    "fineValue" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "BorrowedBook_barcodeId_fkey" FOREIGN KEY ("barcodeId") REFERENCES "Barcode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BorrowedBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BorrowedBook" ("barcodeId", "borrowedAt", "dueDate", "fineValue", "id", "isActive", "returnDate", "userId") SELECT "barcodeId", "borrowedAt", "dueDate", "fineValue", "id", "isActive", "returnDate", "userId" FROM "BorrowedBook";
DROP TABLE "BorrowedBook";
ALTER TABLE "new_BorrowedBook" RENAME TO "BorrowedBook";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
