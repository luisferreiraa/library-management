-- CreateTable
CREATE TABLE "CDUClass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notation" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "parentId" INTEGER,
    "level" INTEGER NOT NULL,
    CONSTRAINT "CDUClass_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CDUClass" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CDUAuxiliary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notation" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CDUClassAuxiliary" (
    "classId" INTEGER NOT NULL,
    "auxiliaryId" INTEGER NOT NULL,

    PRIMARY KEY ("classId", "auxiliaryId"),
    CONSTRAINT "CDUClassAuxiliary_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CDUClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CDUClassAuxiliary_auxiliaryId_fkey" FOREIGN KEY ("auxiliaryId") REFERENCES "CDUAuxiliary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CDUClass_notation_key" ON "CDUClass"("notation");

-- CreateIndex
CREATE UNIQUE INDEX "CDUAuxiliary_notation_key" ON "CDUAuxiliary"("notation");
