-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlField" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "tips" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,

    CONSTRAINT "ControlField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataField" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "ind1" TEXT NOT NULL,
    "ind2" TEXT NOT NULL,
    "tips" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,

    CONSTRAINT "DataField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subfield" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "dataFieldId" TEXT NOT NULL,

    CONSTRAINT "Subfield_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holding" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "callNumber" TEXT,
    "location" TEXT,
    "shelf" TEXT,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "holdingId" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "condition" TEXT,
    "acquisitionDate" TIMESTAMP(3),
    "loanType" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorityRecord" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "mainEntry" TEXT,
    "otherForms" TEXT,
    "code" TEXT,
    "authorityRef" TEXT,
    "description" TEXT,
    "relatedTerms" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorityRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectHeading" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "relatedTerms" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectHeading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenreFormHeading" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenreFormHeading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicName" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "relatedTerms" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorporateName" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT,
    "relatedTerms" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorporateName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniformTitle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "creator" TEXT,
    "edition" TEXT,
    "date" TEXT,
    "relatedTerms" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniformTitle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");

-- AddForeignKey
ALTER TABLE "ControlField" ADD CONSTRAINT "ControlField_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataField" ADD CONSTRAINT "DataField_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subfield" ADD CONSTRAINT "Subfield_dataFieldId_fkey" FOREIGN KEY ("dataFieldId") REFERENCES "DataField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_holdingId_fkey" FOREIGN KEY ("holdingId") REFERENCES "Holding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
