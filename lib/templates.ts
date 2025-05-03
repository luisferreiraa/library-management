import { seedControlFieldDefinitions } from "@/prisma/seed/seedControlFieldDefinitions";
import { prisma } from "./prisma"
import type { Template as PrismaTemplate, Prisma } from "@prisma/client"

export interface CreateTemplateInput {
    name: string
    description?: string
    controlFieldDefinitionIds: string[]
    dataFieldDefinitionIds: string[]
}

export type Template = Prisma.TemplateGetPayload<{
    include: {
        controlFields: {
            include: {
                definition: true;
            };
        };
        dataFields: {
            include: {
                definition: true;
            };
        };
    };
}>

export async function getTemplates(): Promise<Template[]> {
    return prisma.template.findMany({
        include: {
            controlFields: {
                include: {
                    definition: true,
                },
            },
            dataFields: {
                include: {
                    definition: true,
                },
            },
        },
    });
}

export async function getTemplateById(id: string): Promise<Template | null> {
    return prisma.template.findUnique({
        where: { id },
        include: {
            controlFields: {
                include: {
                    definition: true,
                },
            },
            dataFields: {
                include: {
                    definition: true,
                },
            },
        },
    });
}

export async function createTemplate({
    name,
    description,
    controlFieldDefinitionIds = [],
    dataFieldDefinitionIds = [],
}: CreateTemplateInput): Promise<Template> {
    return await prisma.template.create({
        data: {
            name,
            description: description || null,
            controlFields: {
                create: controlFieldDefinitionIds.map((definitionId) => ({
                    definition: {
                        connect: { id: definitionId },
                    },
                })),
            },
            dataFields: {
                create: dataFieldDefinitionIds.map((definitionId) => ({
                    definition: {
                        connect: { id: definitionId },
                    },
                })),
            },
        },
        include: {
            controlFields: {
                include: {
                    definition: true,
                },
            },
            dataFields: {
                include: {
                    definition: true,
                },
            },
        },
    })
}