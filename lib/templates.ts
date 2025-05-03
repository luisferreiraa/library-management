import { prisma } from "./prisma"
import type { Template as PrismaTemplate, Prisma } from "@prisma/client"

export interface CreateTemplateInput {
    name: string
    description?: string
    controlFieldDefinitionIds: string[]
    dataFieldDefinitionIds: string[]
}

export interface UpdateTemplateInput {
    id: string
    name: string
    description?: string | null
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

export async function updateTemplate({
    id,
    name,
    description,
    controlFieldDefinitionIds,
    dataFieldDefinitionIds,
}: UpdateTemplateInput): Promise<Template> {
    // Primeiro, obtemos o template existente para comparar os campos
    const existingTemplate = await prisma.template.findUnique({
        where: { id },
        include: {
            controlFields: true,
            dataFields: true,
        },
    });

    if (!existingTemplate) {
        throw new Error("Template não encontrado");
    }

    // Atualiza o template e seus relacionamentos
    return await prisma.template.update({
        where: { id },
        data: {
            name,
            description: description || null,
            // Atualiza campos de controle - estratégia: deleta todos e recria
            controlFields: {
                deleteMany: {}, // Remove todos os campos de controle existentes
                create: controlFieldDefinitionIds.map((definitionId) => ({
                    definition: {
                        connect: { id: definitionId },
                    },
                })),
            },
            // Atualiza campos de dados - estratégia: deleta todos e recria
            dataFields: {
                deleteMany: {}, // Remove todos os campos de dados existentes
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
    });
}