-- CreateTable
CREATE TABLE "TemplateControlField" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "definitionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateControlField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateControlField" ADD CONSTRAINT "TemplateControlField_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateControlField" ADD CONSTRAINT "TemplateControlField_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "ControlFieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
