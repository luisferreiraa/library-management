-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateDataField" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "defaultInd1" TEXT,
    "defaultInd2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateDataField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateDataField" ADD CONSTRAINT "TemplateDataField_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateDataField" ADD CONSTRAINT "TemplateDataField_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "DataFieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
